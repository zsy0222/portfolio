import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export interface SpatialSceneController { dispose: () => void; reset: () => void }
interface SceneCallbacks { onReady: () => void; onError: () => void }

/** Client-only, procedurally built material study. No remote models or texture requests. */
export function createSpatialScene(host: HTMLDivElement, callbacks: SceneCallbacks): SpatialSceneController {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const targets = new Set<THREE.WebGLRenderTarget>();
  const cleanups: (() => void)[] = [];
  let renderer: THREE.WebGLRenderer | undefined;
  let destroyed = false;
  let frame = 0;
  let visible = true;
  let lastPaint = 0;
  let pointer: { id: number; x: number; y: number; rotation: number } | null = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const createdAt = performance.now();
  let activeUntil = createdAt + (reduceMotion.matches ? 0 : 4400);
  let targetRotation = -.13;
  let targetTilt = 0;
  let targetCameraX = 0;
  let targetCameraY = 0;
  let lastTheme: boolean | null = null;

  const dispose = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(frame); frame = 0;
    cleanups.forEach(cleanup => cleanup());
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    textures.forEach(texture => texture.dispose());
    targets.forEach(target => target.dispose());
    if (renderer) {
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      renderer.forceContextLoss();
    }
  };
  const fail = () => { if (!destroyed) { dispose(); callbacks.onError(); } };
  const ownMaterial = <T extends THREE.Material>(material: T) => { materials.add(material); return material; };
  const ownGeometry = <T extends THREE.BufferGeometry>(geometry: T) => { geometries.add(geometry); return geometry; };

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    const view = renderer;
    view.outputColorSpace = THREE.SRGBColorSpace;
    view.toneMapping = THREE.ACESFilmicToneMapping;
    view.toneMappingExposure = 1.04;
    view.shadowMap.enabled = true;
    view.shadowMap.type = THREE.PCFSoftShadowMap;
    view.domElement.setAttribute("aria-hidden", "true");
    view.domElement.setAttribute("role", "presentation");
    host.appendChild(view.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-2.9, 2.9, 3.2, -3.2, .1, 60);
    const cameraBase = new THREE.Vector3(4.4, 3.3, 7.8);
    camera.position.copy(cameraBase);
    const cameraTarget = new THREE.Vector3(0, 1.52, 0);
    camera.lookAt(cameraTarget);
    const sculpture = new THREE.Group(); scene.add(sculpture); sculpture.rotation.y = targetRotation;

    const pmrem = new THREE.PMREMGenerator(view);
    const environment = new RoomEnvironment();
    try {
      const target = pmrem.fromScene(environment, .05); targets.add(target); scene.environment = target.texture;
    } finally { environment.dispose(); pmrem.dispose(); }
    scene.environmentIntensity = .95;

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
    const violet = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#82659d", metalness: .9, roughness: .29, roughnessMap: brushing, bumpMap: brushing, bumpScale: .006, anisotropy: .65, anisotropyRotation: .4, clearcoat: .25, clearcoatRoughness: .28 }));
    const wine = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#885467", metalness: .86, roughness: .27, roughnessMap: brushing, bumpMap: brushing, bumpScale: .004, anisotropy: .5, clearcoat: .3 }));
    const ceramic = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#ede6d9", metalness: .03, roughness: .5, bumpMap: ceramicGrain, bumpScale: .009, clearcoat: .12, clearcoatRoughness: .5 }));
    const paleCeramic = ownMaterial(new THREE.MeshStandardMaterial({ color: "#d8cedd", roughness: .57, metalness: .02, bumpMap: ceramicGrain, bumpScale: .008 }));
    const glass = ownMaterial(new THREE.MeshPhysicalMaterial({ color: "#d7cae6", metalness: 0, roughness: .24, transmission: .8, thickness: .28, ior: 1.4, attenuationColor: new THREE.Color("#ad93c4"), attenuationDistance: 2.3, clearcoat: .9, clearcoatRoughness: .2, side: THREE.DoubleSide }));
    const trim = ownMaterial(new THREE.MeshStandardMaterial({ color: "#b8a1cc", metalness: .7, roughness: .32 }));
    const floorMaterial = ownMaterial(new THREE.MeshStandardMaterial({ color: "#e5ddea", roughness: .9, metalness: 0 }));

    const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D = sculpture) => {
      const object = new THREE.Mesh(ownGeometry(geometry), material);
      object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
    };
    const roundedBlock = (width: number, height: number, depth: number, radius: number, material: THREE.Material) => {
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
    const dais = mesh(new THREE.LatheGeometry(profile, 72), ceramic); dais.position.y = .06;
    const upper = mesh(new THREE.CylinderGeometry(1.24, 1.24, .13, 64), paleCeramic); upper.position.set(-.2, .38, -.03);
    const etched = mesh(new THREE.TorusGeometry(1.43, .005, 6, 100), trim); etched.rotation.x = Math.PI / 2; etched.position.y = .329;

    // Interlocking metal forms are the central object; the genuine portrait sits outside this scene.
    const ringOne = mesh(new THREE.TorusGeometry(1.19, .145, 24, 96), violet);
    ringOne.position.set(-.18, 1.79, -.12); ringOne.rotation.set(.08, -.22, -.18);
    const ringTwo = mesh(new THREE.TorusGeometry(.92, .082, 20, 88), wine);
    ringTwo.position.set(-.13, 1.67, .18); ringTwo.rotation.set(1.04, .3, .55);
    const fineRing = mesh(new THREE.TorusGeometry(1.23, .012, 8, 96), trim);
    fineRing.position.copy(ringOne.position); fineRing.position.z -= .12; fineRing.rotation.copy(ringOne.rotation);

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
    const orb = mesh(new THREE.SphereGeometry(.23, 28, 20), wine); orb.position.set(-1.03, .74, .32);
    const orbBase = mesh(new THREE.CylinderGeometry(.26, .31, .22, 36), ceramic); orbBase.position.set(-1.03, .4, .32);
    const floor = mesh(new THREE.PlaneGeometry(120, 120), floorMaterial, scene); floor.rotation.x = -Math.PI / 2; floor.position.y = .035; floor.castShadow = false;
    const hemisphere = new THREE.HemisphereLight("#f7f0ff", "#877a89", 2.15); scene.add(hemisphere);
    const key = new THREE.DirectionalLight("#fff4df", 3.8); key.position.set(-3, 7, 5); key.castShadow = true;
    const shadowSize = finePointer.matches ? 1024 : 768; key.shadow.mapSize.set(shadowSize, shadowSize);
    key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 5; key.shadow.camera.bottom = -4;
    key.shadow.normalBias = .028; key.shadow.bias = -.0002; key.shadow.radius = 4; scene.add(key);
    const fill = new THREE.DirectionalLight("#d2b7f2", 2); fill.position.set(4, 3, -2); scene.add(fill);
    const rim = new THREE.DirectionalLight("#ffffff", 1.5); rim.position.set(-3, 2, -4); scene.add(rim);
    cleanups.push(() => key.shadow.dispose());

    const theme = () => {
      const dark = document.documentElement.classList.contains("dark");
      if (dark === lastTheme) return;
      lastTheme = dark;
      scene.background = new THREE.Color(dark ? "#352d42" : "#e9e2eb");
      floorMaterial.color.set(dark ? "#352d42" : "#e9e2eb");
      ceramic.color.set(dark ? "#a49aaf" : "#ede6d9");
      paleCeramic.color.set(dark ? "#776785" : "#d8cedd");
      view.toneMappingExposure = dark ? .85 : 1.04;
    };
    theme();

    const schedule = () => { if (!frame && visible && !document.hidden && !destroyed) frame = requestAnimationFrame(draw); };
    function draw(now: number) {
      frame = 0;
      if (destroyed || !visible || document.hidden) return;
      if (now - lastPaint < 30 && !reduceMotion.matches) { schedule(); return; }
      const dt = Math.min(.06, (now - lastPaint) / 1000 || .03); lastPaint = now;
      const ease = reduceMotion.matches ? 1 : 1 - Math.exp(-dt * 7);
      const automatic = !reduceMotion.matches && now < activeUntil;
      const phase = (now - createdAt) / 1000;
      sculpture.rotation.y += (targetRotation - sculpture.rotation.y) * ease;
      sculpture.rotation.x += (targetTilt - sculpture.rotation.x) * ease;
      camera.position.x += (cameraBase.x + targetCameraX - camera.position.x) * ease;
      camera.position.y += (cameraBase.y + targetCameraY - camera.position.y) * ease;
      camera.lookAt(cameraTarget);
      // A short settling motion; no endless render loop or involuntary movement after 4.4 seconds.
      if (automatic) {
        ringTwo.rotation.z = .55 + Math.sin(phase * .8) * .055;
        ringTwo.rotation.y = .3 + Math.sin(phase * .55) * .035;
      }
      try { view.render(scene, camera); } catch { fail(); return; }
      const unsettled = Math.abs(sculpture.rotation.y - targetRotation) + Math.abs(sculpture.rotation.x - targetTilt) + Math.abs(camera.position.x - cameraBase.x - targetCameraX) + Math.abs(camera.position.y - cameraBase.y - targetCameraY) > .001;
      if (automatic || unsettled) schedule();
    }
    const resize = () => {
      if (destroyed) return;
      const { width, height } = host.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      const aspect = width / height;
      const frustumHeight = Math.max(4.75, 4.25 / aspect);
      camera.left = -frustumHeight * aspect / 2; camera.right = frustumHeight * aspect / 2;
      camera.top = frustumHeight / 2; camera.bottom = -frustumHeight / 2; camera.updateProjectionMatrix();
      view.setPixelRatio(Math.min(window.devicePixelRatio || 1, finePointer.matches ? 1.5 : 1.25));
      view.setSize(width, height, false); schedule();
    };
    const onMove = (event: PointerEvent) => {
      if (pointer && event.pointerId === pointer.id) {
        targetRotation = THREE.MathUtils.clamp(pointer.rotation + (event.clientX - pointer.x) * .007, -1.15, 1.05);
        targetTilt = THREE.MathUtils.clamp((event.clientY - pointer.y) * .002, -.11, .11);
        schedule();
      } else if (event.pointerType === "mouse" && finePointer.matches && !reduceMotion.matches) {
        const bounds = host.getBoundingClientRect();
        targetCameraX = ((event.clientX - bounds.left) / bounds.width - .5) * .5;
        targetCameraY = -((event.clientY - bounds.top) / bounds.height - .5) * .24;
        schedule();
      }
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || destroyed) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, rotation: targetRotation };
      host.setPointerCapture(event.pointerId); host.dataset.dragging = "true";
    };
    const release = () => {
      const pointerId = pointer?.id;
      pointer = null; delete host.dataset.dragging;
      if (pointerId !== undefined && host.hasPointerCapture(pointerId)) host.releasePointerCapture(pointerId);
      targetTilt = 0; schedule();
    };
    const leave = () => { if (!pointer) { targetCameraX = targetCameraY = 0; schedule(); } };
    const reset = () => { targetRotation = -.13; targetTilt = targetCameraX = targetCameraY = 0; ringTwo.rotation.set(1.04, .3, .55); activeUntil = 0; schedule(); };
    const onKey = (event: KeyboardEvent) => {
      if (event.target !== host) return;
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") reset();
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") targetRotation = THREE.MathUtils.clamp(targetRotation + (event.key === "ArrowLeft" ? -.12 : .12), -1.15, 1.05);
      else targetTilt = THREE.MathUtils.clamp(targetTilt + (event.key === "ArrowUp" ? -.04 : .04), -.11, .11);
      schedule();
    };
    const lostContext = (event: Event) => { event.preventDefault(); fail(); };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule(); };
    const preference = () => { if (reduceMotion.matches) { activeUntil = 0; targetCameraX = targetCameraY = 0; } schedule(); };
    host.addEventListener("pointerdown", onDown); host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerup", release); host.addEventListener("pointercancel", release); host.addEventListener("lostpointercapture", release); host.addEventListener("pointerleave", leave); host.addEventListener("keydown", onKey);
    view.domElement.addEventListener("webglcontextlost", lostContext);
    document.addEventListener("visibilitychange", visibility); reduceMotion.addEventListener("change", preference);
    const resizer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    if (resizer) resizer.observe(host); else window.addEventListener("resize", resize);
    const themeObserver = new MutationObserver(() => { theme(); schedule(); }); themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; } });
    intersection?.observe(host);
    cleanups.push(() => {
      host.removeEventListener("pointerdown", onDown); host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerup", release); host.removeEventListener("pointercancel", release); host.removeEventListener("lostpointercapture", release); host.removeEventListener("pointerleave", leave); host.removeEventListener("keydown", onKey);
      view.domElement.removeEventListener("webglcontextlost", lostContext); document.removeEventListener("visibilitychange", visibility); reduceMotion.removeEventListener("change", preference);
      resizer?.disconnect(); window.removeEventListener("resize", resize); themeObserver.disconnect(); intersection?.disconnect(); delete host.dataset.dragging;
    });
    resize();
    view.render(scene, camera);
    callbacks.onReady();
    return { dispose, reset };
  } catch (error) { dispose(); throw error; }
}
