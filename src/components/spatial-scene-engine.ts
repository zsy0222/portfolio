import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createCanvasSceneRenderer, paintSpatialBackdrop } from "./spatial-canvas-renderer";

export type SpatialMaterial = "titanium" | "crystal" | "porcelain";
export type SpatialRenderMode = "webgl" | "canvas";
export interface SpatialSceneController {
  dispose: () => void; reset: () => void; setMaterial: (material: SpatialMaterial) => void;
  setPlaying: (playing: boolean) => void; setZoom: (zoom: number) => void;
}
interface SceneCallbacks {
  onReady: (mode: SpatialRenderMode) => void; onError: () => void;
  onPlayingChange: (playing: boolean) => void; onZoomChange: (zoom: number) => void;
}

/** Lazy client-only scene; GPU PBR or a projected, interactive CPU 3D renderer. */
export function createSpatialScene(host: HTMLDivElement, callbacks: SceneCallbacks): SpatialSceneController {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const targets = new Set<THREE.WebGLRenderTarget>();
  const cleanups: (() => void)[] = [];
  let renderer: THREE.WebGLRenderer | undefined;
  let canvasRenderer: ReturnType<typeof createCanvasSceneRenderer> | undefined;
  let removeGLListener = () => {};
  let mode: SpatialRenderMode = "webgl";
  let destroyed = false, frame = 0, visible = true, lastPaint = 0;
  let pointer: { id: number; x: number; y: number; yaw: number; pitch: number; lastAt: number } | null = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let targetYaw = .45, yaw = .45, targetPitch = .27, pitch = .27, targetZoom = 1;
  let velocity = 0, playing = false;
  let dark = document.documentElement.classList.contains("dark");
  let settleUntil = performance.now() + (reduceMotion.matches ? 0 : 3500);
  const dispose = () => {
    if (destroyed) return;
    destroyed = true; cancelAnimationFrame(frame); frame = 0;
    cleanups.forEach(cleanup => cleanup()); removeGLListener();
    canvasRenderer?.dispose();
    geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose());
    textures.forEach(item => item.dispose()); targets.forEach(item => item.dispose());
    if (renderer) { renderer.renderLists.dispose(); renderer.dispose(); renderer.domElement.remove(); renderer.forceContextLoss(); }
  };
  const fatal = () => { if (!destroyed) { dispose(); callbacks.onError(); } };
  const ownMaterial = <T extends THREE.Material>(material: T) => { materials.add(material); return material; };
  const ownGeometry = <T extends THREE.BufferGeometry>(geometry: T) => { geometries.add(geometry); return geometry; };
  try {
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
      renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.setAttribute("aria-hidden", "true"); host.appendChild(renderer.domElement);
    } catch { renderer = undefined; mode = "canvas"; }
    const scene = new THREE.Scene(); scene.background = new THREE.Color(dark ? "#22263f" : "#827994");
    const camera = new THREE.OrthographicCamera(-2.9, 2.9, 3.2, -3.2, .1, 60);
    const cameraTarget = new THREE.Vector3(0, 1.52, 0);
    const sculpture = new THREE.Group(); scene.add(sculpture);
    if (renderer) {
      const pmrem = new THREE.PMREMGenerator(renderer); const environment = new RoomEnvironment();
      try { const target = pmrem.fromScene(environment, .04); targets.add(target); scene.environment = target.texture; scene.environmentIntensity = 1.25; }
      catch { renderer.dispose(); renderer.domElement.remove(); renderer.forceContextLoss(); renderer = undefined; mode = "canvas"; }
      finally { environment.dispose(); pmrem.dispose(); }
    }
    // The same camera-reactive chamber is used by both rendering paths.
    const backdropCanvas = document.createElement("canvas");
    const backdropContext = renderer ? backdropCanvas.getContext("2d", { alpha: false }) : null;
    let backdropTexture: THREE.CanvasTexture | undefined;
    let backdropYaw = Infinity, backdropPitch = Infinity;
    if (backdropContext) {
      backdropCanvas.width = 640; backdropCanvas.height = 640;
      backdropTexture = new THREE.CanvasTexture(backdropCanvas);
      backdropTexture.colorSpace = THREE.SRGBColorSpace;
      backdropTexture.generateMipmaps = false; backdropTexture.minFilter = THREE.LinearFilter;
      textures.add(backdropTexture); scene.background = backdropTexture;
    }
    const updateBackdrop = (force = false) => {
      if (!renderer || !backdropContext || !backdropTexture) return;
      if (!force && Math.abs(yaw - backdropYaw) + Math.abs(pitch - backdropPitch) < .025) return;
      backdropYaw = yaw; backdropPitch = pitch;
      paintSpatialBackdrop(backdropContext, backdropCanvas.width, backdropCanvas.height, yaw, pitch, dark);
      backdropTexture.needsUpdate = true;
    };
    cleanups.push(() => { backdropCanvas.width = backdropCanvas.height = 1; });
    const texture = (brushed: boolean) => {
      const size = 128;
      const bytes = new Uint8Array(size * size * 4);
      let seed = 28411;
      const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
      for (let y = 0; y < size; y++) {
        const line = random() * 30;
        for (let x = 0; x < size; x++) {
          const value = Math.floor(150 + (brushed ? line + random() * 12 : random() * 55));
          const offset = (y * size + x) * 4;
          bytes[offset] = value; bytes[offset + 1] = value; bytes[offset + 2] = value; bytes[offset + 3] = 255;
        }
      }
      const result = new THREE.DataTexture(bytes, size, size, THREE.RGBAFormat);
      result.wrapS = result.wrapT = THREE.RepeatWrapping;
      result.magFilter = THREE.LinearFilter; result.minFilter = THREE.LinearMipmapLinearFilter; result.generateMipmaps = true;
      result.repeat.set(brushed ? 5 : 3, brushed ? 2 : 3); result.needsUpdate = true;
      textures.add(result); return result;
    };
    const brushing = texture(true);
    const ceramicGrain = texture(false);
    const violet = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#bbb5d1", metalness: .96, roughness: .18, bumpMap: brushing, bumpScale: .004, anisotropy: .5, clearcoat: .8, clearcoatRoughness: .16 }));
    const wine = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#c395b7", metalness: .92, roughness: .21, bumpMap: brushing, bumpScale: .004, clearcoat: .6 }));
    const ceramic = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#998daa", metalness: .38, roughness: .24, bumpMap: ceramicGrain, bumpScale: .005, clearcoat: .7 }));
    const paleCeramic = ownMaterial(new THREE.MeshStandardMaterial({ color: "#77708b", metalness: .6, roughness: .2 }));
    const glass = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#a6c3dc", roughness: .2, transmission: .76, thickness: .25, ior: 1.4, attenuationColor: new THREE.Color("#8c88ba"), attenuationDistance: 2.3, clearcoat: .8, side: THREE.DoubleSide }));
    const trim = ownMaterial(new THREE.MeshStandardMaterial({ color: "#b4a1ce", metalness: .8, roughness: .2 }));
    const floorMaterial = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#726c87", metalness: .32, roughness: .3, clearcoat: .8, transparent: true, opacity: .52, depthWrite: false }));
    const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D = sculpture) => {
      const object = new THREE.Mesh(ownGeometry(geometry), material);
      object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
    };
    const roundedBlock = (width: number, height: number, depth: number, radius: number, material: THREE.Material) => {
      if (mode === "canvas") return mesh(new THREE.BoxGeometry(width, height, depth), material);
      const shape = new THREE.Shape(); const x = -width / 2; const y = -height / 2; const r = Math.min(radius, width / 3, height / 3);
      shape.moveTo(x + r, y); shape.lineTo(x + width - r, y); shape.quadraticCurveTo(x + width, y, x + width, y + r);
      shape.lineTo(x + width, y + height - r); shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      shape.lineTo(x + r, y + height); shape.quadraticCurveTo(x, y + height, x, y + height - r);
      shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
      const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .025, bevelThickness: .025, curveSegments: 10 });
      geometry.translate(0, 0, -depth / 2);
      return mesh(geometry, material);
    };
    // A rounded ceramic dais with a separate thin top lip catches broad soft shadows.
    const profile = [new THREE.Vector2(0, 0), new THREE.Vector2(1.47, 0), new THREE.Vector2(1.55, .025), new THREE.Vector2(1.59, .075), new THREE.Vector2(1.59, .19), new THREE.Vector2(1.56, .24), new THREE.Vector2(1.48, .265), new THREE.Vector2(0, .265)];
    const dais = mesh(new THREE.LatheGeometry(profile, mode === "canvas" ? 24 : 72), ceramic); dais.position.y = .06;
    const upper = mesh(new THREE.CylinderGeometry(1.24, 1.24, .13, mode === "canvas" ? 24 : 64), paleCeramic); upper.position.set(-.2, .38, -.03);
    if (mode === "webgl") { const etched = mesh(new THREE.TorusGeometry(1.43, .005, 6, 100), trim); etched.rotation.x = Math.PI / 2; etched.position.y = .329; }

    // Interlocking metal forms are the central object; the genuine portrait sits outside this scene.
    const ringOne = mesh(new THREE.TorusGeometry(1.12, .18, mode === "canvas" ? 10 : 24, mode === "canvas" ? 40 : 96), violet);
    ringOne.position.set(-.18, 1.79, -.12); ringOne.rotation.set(.08, -.22, -.18);
    const ringTwo = mesh(new THREE.TorusGeometry(.89, .12, mode === "canvas" ? 8 : 20, mode === "canvas" ? 32 : 88), wine);
    ringTwo.position.set(-.13, 1.67, .18); ringTwo.rotation.set(1.04, .3, .55);
    if (mode === "webgl") { const fineRing = mesh(new THREE.TorusGeometry(1.23, .012, 8, 96), trim); fineRing.position.copy(ringOne.position); fineRing.position.z -= .12; fineRing.rotation.copy(ringOne.rotation); }

    // Frosted architectural screens and a three-step ceramic staircase add spatial depth.
    const screenOne = roundedBlock(.75, 2.34, .1, .13, glass); screenOne.position.set(.92, 1.69, -.82); screenOne.rotation.y = -.32;
    const screenTwo = roundedBlock(.53, 1.66, .09, .11, glass); screenTwo.position.set(1.37, 1.15, -.55); screenTwo.rotation.y = -.32;
    screenOne.castShadow = false; screenTwo.castShadow = false;
    const glassFoot = roundedBlock(1.1, .12, .35, .035, ceramic); glassFoot.position.set(1.06, .51, -.72); glassFoot.rotation.y = -.32;
    for (let step = 0; step < 3; step++) {
      const height = .14 + step * .12;
      const block = roundedBlock(.8, height, .35, .04, ceramic);
      block.position.set(-1.05, height / 2 + .07, .98 - step * .32); block.rotation.y = -.16;
    }
    const orb = mesh(new THREE.SphereGeometry(.23, mode === "canvas" ? 12 : 28, mode === "canvas" ? 8 : 20), wine); orb.position.set(-1.03, .74, .32);
    const orbBase = mesh(new THREE.CylinderGeometry(.26, .31, .22, mode === "canvas" ? 16 : 36), ceramic); orbBase.position.set(-1.03, .4, .32);
    const floor = mesh(new THREE.PlaneGeometry(120, 120), floorMaterial, scene); floor.rotation.x = -Math.PI / 2; floor.position.y = .035; floor.castShadow = false;
    const ambient = new THREE.HemisphereLight("#eadcf7", "#7c718d", 1.1); scene.add(ambient);
    const key = new THREE.DirectionalLight("#fff1e7", 4.3); key.position.set(-3, 7, 5); key.castShadow = true;
    key.shadow.mapSize.set(finePointer.matches ? 1024 : 768, finePointer.matches ? 1024 : 768);
    key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 5; key.shadow.camera.bottom = -4;
    key.shadow.normalBias = .028; key.shadow.bias = -.0002; key.shadow.radius = 4; scene.add(key);
    const fill = new THREE.DirectionalLight("#919fe9", 2.8); fill.position.set(4, 3, -2); scene.add(fill);
    const rim = new THREE.DirectionalLight("#ffffff", 3.5); rim.position.set(-3, 2, -4); scene.add(rim);
    cleanups.push(() => key.shadow.dispose());

    const schedule = () => { if (!frame && visible && !document.hidden && !destroyed) frame = requestAnimationFrame(draw); };
    const setPlaying = (value: boolean) => { playing = value; velocity = 0; settleUntil = 0; callbacks.onPlayingChange(value); schedule(); };
    const setZoom = (value: number) => { targetZoom = Math.round(THREE.MathUtils.clamp(value, .75, 1.45) * 100) / 100; callbacks.onZoomChange(targetZoom); schedule(); };
    const setMaterial = (finish: SpatialMaterial) => {
      const crystal = finish === "crystal", porcelain = finish === "porcelain";
      [violet, wine].forEach((material, index) => {
        material.color.set(crystal ? (index ? "#e2bdef" : "#b9e7fc") : porcelain ? (index ? "#c6a5af" : "#f2e2c9") : (index ? "#c395b7" : "#bbb5d1"));
        material.metalness = crystal || porcelain ? 0 : .96;
        material.roughness = crystal ? .085 : porcelain ? .33 : .18;
        material.transmission = crystal ? .88 : 0;
        material.thickness = crystal ? .48 : 0;
        material.ior = 1.47; material.attenuationColor.set(crystal ? "#bdd5ff" : "#ffffff"); material.attenuationDistance = 2.5;
        material.clearcoat = crystal ? 1 : porcelain ? .72 : .8;
        material.clearcoatRoughness = porcelain ? .21 : .1;
        material.bumpMap = crystal ? null : porcelain ? ceramicGrain : brushing;
        material.bumpScale = porcelain ? .007 : .003;
        material.anisotropy = crystal || porcelain ? 0 : .5;
        material.needsUpdate = true;
      });
      schedule();
    };
    const reset = () => { targetYaw = .45; targetPitch = .27; velocity = 0; ringTwo.rotation.set(1.04, .3, .55); setZoom(1); setPlaying(false); schedule(); };
    const updateCamera = () => {
      const distance = 9;
      camera.position.set(Math.sin(yaw) * Math.cos(pitch) * distance, cameraTarget.y + Math.sin(pitch) * distance, Math.cos(yaw) * Math.cos(pitch) * distance);
      camera.lookAt(cameraTarget); camera.zoom = targetZoom; camera.updateProjectionMatrix(); camera.updateMatrixWorld(); scene.updateMatrixWorld();
    };
    const render = () => { if (renderer) { updateBackdrop(); renderer.render(scene, camera); } else canvasRenderer?.render(); };
    const resize = () => {
      if (destroyed) return;
      const { width, height } = host.getBoundingClientRect(); if (width < 1 || height < 1) return;
      const aspect = width / height; const frustum = Math.max(4.75, 4.1 / aspect);
      camera.left = -frustum * aspect / 2; camera.right = frustum * aspect / 2; camera.top = frustum / 2; camera.bottom = -frustum / 2;
      camera.updateProjectionMatrix();
      const dpr = mode === "canvas" ? 1 : Math.min(window.devicePixelRatio || 1, finePointer.matches ? 1.5 : 1.25);
      if (renderer) {
        renderer.setPixelRatio(dpr); renderer.setSize(width, height, false);
        const scale = Math.min(1.25, 768 / Math.max(width, height));
        backdropCanvas.width = Math.max(1, Math.round(width * scale));
        backdropCanvas.height = Math.max(1, Math.round(height * scale)); updateBackdrop(true);
      }
      else canvasRenderer?.setSize(width, height, dpr);
      schedule();
    };
    const simplifyForCanvas = () => {
      const meshes: THREE.Mesh[] = [];
      sculpture.traverse(object => { if (object instanceof THREE.Mesh) meshes.push(object); });
      for (const object of meshes) {
        const geometry = object.geometry;
        let replacement: THREE.BufferGeometry | undefined;
        if (geometry instanceof THREE.TorusGeometry) {
          const p = geometry.parameters;
          if (p.tube < .03) { object.removeFromParent(); continue; }
          replacement = new THREE.TorusGeometry(p.radius, p.tube, p.radius > 1 ? 10 : 8, p.radius > 1 ? 40 : 32, p.arc);
        } else if (geometry instanceof THREE.LatheGeometry) {
          const p = geometry.parameters; replacement = new THREE.LatheGeometry(p.points, 24, p.phiStart, p.phiLength);
        } else if (geometry instanceof THREE.CylinderGeometry) {
          const p = geometry.parameters; replacement = new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, p.radiusTop > 1 ? 24 : 16);
        } else if (geometry instanceof THREE.SphereGeometry) {
          replacement = new THREE.SphereGeometry(geometry.parameters.radius, 12, 8);
        } else if (geometry instanceof THREE.ExtrudeGeometry) {
          geometry.computeBoundingBox();
          if (geometry.boundingBox) {
            const size = geometry.boundingBox.getSize(new THREE.Vector3());
            const center = geometry.boundingBox.getCenter(new THREE.Vector3());
            replacement = new THREE.BoxGeometry(size.x, size.y, size.z); replacement.translate(center.x, center.y, center.z);
          }
        }
        if (replacement) { object.geometry = ownGeometry(replacement); geometry.dispose(); geometries.delete(geometry); }
      }
    };
    const activateCanvasFallback = () => {
      if (canvasRenderer || destroyed) return;
      if (mode === "webgl") simplifyForCanvas();
      removeGLListener();
      if (renderer) { renderer.renderLists.dispose(); renderer.dispose(); renderer.domElement.remove(); renderer = undefined; }
      targets.forEach(target => target.dispose()); targets.clear(); scene.environment = null;
      canvasRenderer = createCanvasSceneRenderer(host, scene, camera, sculpture, dark); mode = "canvas";
      canvasRenderer.domElement.setAttribute("aria-hidden", "true"); resize(); callbacks.onReady(mode);
    };
    function draw(now: number) {
      frame = 0; if (destroyed || !visible || document.hidden) return;
      const minimumFrame = mode === "canvas" ? 1000 / 24 : 1000 / 30;
      if (now - lastPaint < minimumFrame && !reduceMotion.matches) { schedule(); return; }
      const dt = Math.min(.07, (now - lastPaint) / 1000 || .03); lastPaint = now;
      if (playing && !pointer) targetYaw += dt * .26;
      if (!pointer && !playing && !reduceMotion.matches && Math.abs(velocity) > .003) { targetYaw += velocity * dt; velocity *= Math.exp(-dt * 6); }
      const ease = reduceMotion.matches ? 1 : 1 - Math.exp(-dt * 10);
      yaw += (targetYaw - yaw) * ease; pitch += (targetPitch - pitch) * ease;
      if (!reduceMotion.matches && now < settleUntil) { ringTwo.rotation.z = .55 + Math.sin((now - settleUntil + 3500) / 1700) * .04; }
      updateCamera();
      try { render(); } catch { try { activateCanvasFallback(); updateCamera(); render(); } catch { fatal(); return; } }
      const drifting = !pointer && !reduceMotion.matches && Math.abs(velocity) > .003;
      if (playing || now < settleUntil || drifting || Math.abs(yaw - targetYaw) + Math.abs(pitch - targetPitch) > .0008) schedule();
    }
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || destroyed || pointer) return;
      setPlaying(false); velocity = 0;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw: targetYaw, pitch: targetPitch, lastAt: performance.now() };
      host.setPointerCapture(event.pointerId); host.dataset.dragging = "true";
    };
    const onMove = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const now = performance.now(), nextYaw = pointer.yaw - (event.clientX - pointer.x) * .009;
      velocity = THREE.MathUtils.clamp((nextYaw - targetYaw) / Math.max(.012, (now - pointer.lastAt) / 1000), -2.2, 2.2);
      targetYaw = nextYaw; targetPitch = THREE.MathUtils.clamp(pointer.pitch + (event.clientY - pointer.y) * .005, .05, .88);
      pointer.lastAt = now; schedule();
    };
    const release = () => {
      const id = pointer?.id; if (pointer && performance.now() - pointer.lastAt > 120) velocity = 0;
      pointer = null; delete host.dataset.dragging;
      if (id !== undefined && host.hasPointerCapture(id)) host.releasePointerCapture(id);
      if (reduceMotion.matches) velocity = 0; schedule();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.target !== host || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "+", "=", "-", " "].includes(event.key)) return;
      event.preventDefault();
      if (event.key === " ") { setPlaying(!playing); return; }
      setPlaying(false);
      if (event.key === "Home") reset();
      else if (event.key === "+" || event.key === "=") setZoom(targetZoom + .1);
      else if (event.key === "-") setZoom(targetZoom - .1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") targetYaw += event.key === "ArrowLeft" ? -.15 : .15;
      else targetPitch = THREE.MathUtils.clamp(targetPitch + (event.key === "ArrowUp" ? .06 : -.06), .05, .88);
      schedule();
    };
    // Theme changes repaint this scene without replacing the camera or controls.
    const applyTheme = () => {
      dark = document.documentElement.classList.contains("dark");
      host.dataset.theme = dark ? "dark" : "light";
      ceramic.color.set(dark ? "#696a8a" : "#998daa");
      paleCeramic.color.set(dark ? "#494d6c" : "#77708b");
      floorMaterial.color.set(dark ? "#171c32" : "#726c87");
      floorMaterial.opacity = dark ? .6 : .52;
      ambient.color.set(dark ? "#aebdf3" : "#eadcf7");
      ambient.groundColor.set(dark ? "#25233f" : "#7c718d");
      ambient.intensity = dark ? .8 : 1.1;
      key.color.set(dark ? "#e4eaff" : "#fff1e7"); key.intensity = dark ? 3.8 : 4.3;
      fill.color.set(dark ? "#849bff" : "#919fe9"); fill.intensity = dark ? 3.2 : 2.8;
      rim.color.set(dark ? "#ddbdf8" : "#ffffff");
      scene.environmentIntensity = dark ? .95 : 1.25;
      canvasRenderer?.setTheme(dark);
      updateBackdrop(true); schedule();
    };
    const themeObserver = new MutationObserver(() => {
      if (document.documentElement.classList.contains("dark") !== dark) applyTheme();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    cleanups.push(() => { themeObserver.disconnect(); delete host.dataset.theme; });
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; velocity = 0; } else { lastPaint = performance.now(); schedule(); } };
    const preference = () => { if (reduceMotion.matches) { settleUntil = 0; setPlaying(false); velocity = 0; } schedule(); };
    host.addEventListener("pointerdown", onDown); host.addEventListener("pointermove", onMove, { passive: true }); host.addEventListener("pointerup", release); host.addEventListener("pointercancel", release); host.addEventListener("lostpointercapture", release); host.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", visibility); reduceMotion.addEventListener("change", preference);
    const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    if (resizer) resizer.observe(host); else window.addEventListener("resize", resize);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); if (visible) { lastPaint = performance.now(); schedule(); } else { cancelAnimationFrame(frame); frame = 0; velocity = 0; } }); observer?.observe(host);
    cleanups.push(() => {
      host.removeEventListener("pointerdown", onDown); host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerup", release); host.removeEventListener("pointercancel", release); host.removeEventListener("lostpointercapture", release); host.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", visibility); reduceMotion.removeEventListener("change", preference); resizer?.disconnect(); observer?.disconnect(); window.removeEventListener("resize", resize); delete host.dataset.dragging;
    });
    if (renderer) {
      const glCanvas = renderer.domElement;
      const contextLost = (event: Event) => { event.preventDefault(); try { activateCanvasFallback(); } catch { fatal(); } };
      glCanvas.addEventListener("webglcontextlost", contextLost); removeGLListener = () => glCanvas.removeEventListener("webglcontextlost", contextLost);
    } else activateCanvasFallback();
    setMaterial("titanium");
    applyTheme();
    try { resize(); updateCamera(); render(); }
    catch { activateCanvasFallback(); resize(); updateCamera(); render(); }
    callbacks.onReady(mode);
    return { dispose, reset, setMaterial, setPlaying, setZoom };
  } catch (error) { dispose(); throw error; }
}
