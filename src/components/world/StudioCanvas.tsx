"use client";

import { useEffect, useRef } from "react";
import type * as Three from "three";

export type StudioView = "room" | "desk" | "memories";

interface StudioCanvasProps {
  view: StudioView;
  onReady: () => void;
  onError: () => void;
  onNavigate: (href: string) => void;
  onHover: (name: string | null) => void;
  onCompatibility?: () => void;
  label: string;
}

interface StudioRenderer {
  domElement: HTMLCanvasElement | SVGElement;
  setSize: (width: number, height: number) => void;
  render: (scene: Three.Scene, camera: Three.Camera) => void;
  dispose: () => void;
}

/** A lightweight, original scene study. No downloaded model or personal room is implied. */
export default function StudioCanvas(props: StudioCanvasProps) {
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef(props);
  const controller = useRef<{ setView: (view: StudioView) => void } | null>(null);

  useEffect(() => { callbacks.current = props; });
  useEffect(() => { controller.current?.setView(props.view); }, [props.view]);

  useEffect(() => {
    const host = container.current;
    if (!host) return;
    let disposed = false;
    let failed = false;
    let cleanup = () => {};
    const reportError = () => {
      if (disposed || failed) return;
      failed = true;
      try { cleanup(); } finally { callbacks.current.onError(); }
    };

    async function createStudio() {
      const T = await import("three");
      if (disposed || !host) return;
      let renderer: StudioRenderer;
      let compatibility = false;
      const smallScreen = window.matchMedia("(max-width: 700px)").matches;
      try {
        const webgl = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        webgl.setPixelRatio(Math.min(window.devicePixelRatio || 1, smallScreen ? 1.3 : 1.65));
        webgl.shadowMap.enabled = true;
        webgl.shadowMap.type = T.PCFSoftShadowMap;
        webgl.outputColorSpace = T.SRGBColorSpace;
        webgl.toneMapping = T.ACESFilmicToneMapping;
        webgl.toneMappingExposure = 1.05;
        renderer = {
          domElement: webgl.domElement,
          setSize: (width, height) => webgl.setSize(width, height, false),
          render: (scene, camera) => webgl.render(scene, camera),
          dispose: () => webgl.dispose(),
        };
      } catch {
        // Render the same geometry with a CPU/vector backend when WebGL is unavailable.
        // This does not request or enable GPU access, and its simpler materials are labelled.
        const { SVGRenderer } = await import("three/examples/jsm/renderers/SVGRenderer.js");
        if (disposed) return;
        const svg = new SVGRenderer();
        svg.setQuality("low");
        svg.setPrecision(2);
        renderer = {
          domElement: svg.domElement,
          setSize: (width, height) => svg.setSize(width, height),
          render: (scene, camera) => {
            svg.render(scene, camera);
            svg.domElement.style.backgroundColor = "transparent";
          },
          dispose: () => svg.clear(),
        };
        compatibility = true;
        callbacks.current.onCompatibility?.();
      }
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);

      const scene = new T.Scene();
      const camera = new T.OrthographicCamera(-6, 6, 5, -5, 0.1, 100);
      const target = new T.Vector3(0, 1.3, 0);
      const targetGoal = target.clone();
      const positionGoal = new T.Vector3(10, 9.5, 12);
      camera.position.copy(positionGoal);
      const textures = new Set<Three.Texture>();
      const materials = new Set<Three.Material>();
      const geometry = new Set<Three.BufferGeometry>();
      // Also release a partially constructed scene if an asset/setup step throws.
      let resourcesDisposed = false;
      const disposeResources = () => {
        if (resourcesDisposed) return;
        resourcesDisposed = true;
        geometry.forEach(g => g.dispose());
        materials.forEach(m => m.dispose());
        textures.forEach(t => t.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
      cleanup = disposeResources;
      const clickables: Three.Object3D[] = [];
      let frame = 0;
      let visible = true;
      let contextLost = false;
      let zoomGoal = 1;
      let pointerDown: { x: number; y: number; azimuth: number; moved: boolean } | null = null;
      let azimuth = Math.atan2(positionGoal.x, positionGoal.z);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      const mat = (color: string, roughness = 0.72, metalness = 0) => {
        const result = new T.MeshStandardMaterial({ color, roughness, metalness });
        materials.add(result);
        return result;
      };
      const palette = {
        wall: mat("#e8dfe9"), ivory: mat("#f1e6cf"), wood: mat("#ab7955"),
        woodLight: mat("#c5a17a"), darkWood: mat("#68434b"), ink: mat("#292333"),
        lilac: mat("#9585b0"), violet: mat("#6c5c91"), mauve: mat("#b89ca9"),
        white: mat("#f4efdf"), metal: mat("#6d6875", 0.4, 0.65),
        burgundy: mat("#713649"), skin: mat("#dcb49a"), hair: mat("#24202a"),
        cargo: mat("#4d4c58"), green: mat("#547664"), greenLight: mat("#83947a"),
        terracotta: mat("#b67e64"), blue: mat("#536684"), cream: mat("#e8d1ac"),
      };

      function mesh(g: Three.BufferGeometry, m: Three.Material | Three.Material[], parent: Three.Object3D = scene) {
        geometry.add(g);
        const item = new T.Mesh(g, m);
        item.castShadow = true;
        item.receiveShadow = true;
        parent.add(item);
        return item;
      }
      // SVG uses triangle painter order instead of a depth buffer. Large, nearly
      // coplanar surfaces need stable layers to avoid long diagonal occlusion seams.
      function svgLayer(item: Three.Mesh, order: number) {
        if (compatibility) item.renderOrder = order;
        return item;
      }
      function box(w: number, h: number, d: number, x: number, y: number, z: number, m: Three.Material, parent: Three.Object3D = scene, bevel = 0) {
        let g: Three.BufferGeometry;
        if (compatibility) {
          // Short faces reduce painter-order errors where furniture intersects.
          g = new T.BoxGeometry(w, h, d, Math.ceil(w / 0.4), Math.ceil(h / 0.4), Math.ceil(d / 0.4));
        } else if (bevel > 0 && Math.min(w, h, d) > bevel * 3) {
          const shape = new T.Shape();
          shape.moveTo(-w / 2 + bevel, -h / 2 + bevel);
          shape.lineTo(w / 2 - bevel, -h / 2 + bevel);
          shape.lineTo(w / 2 - bevel, h / 2 - bevel);
          shape.lineTo(-w / 2 + bevel, h / 2 - bevel);
          shape.closePath();
          g = new T.ExtrudeGeometry(shape, { depth: d - bevel * 2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: bevel, bevelThickness: bevel });
          g.translate(0, 0, -d / 2 + bevel);
        } else g = new T.BoxGeometry(w, h, d);
        const item = mesh(g, m, parent);
        item.position.set(x, y, z);
        return item;
      }
      function sphere(x: number, y: number, z: number, sx: number, sy: number, sz: number, m: Three.Material, parent: Three.Object3D = scene) {
        const item = mesh(new T.SphereGeometry(1, 20, 12), m, parent);
        item.position.set(x, y, z);
        item.scale.set(sx, sy, sz);
        return item;
      }
      function cylinder(rt: number, rb: number, h: number, x: number, y: number, z: number, m: Three.Material, parent: Three.Object3D = scene, segments = 24) {
        const item = mesh(new T.CylinderGeometry(rt, rb, h, segments), m, parent);
        item.position.set(x, y, z);
        return item;
      }
      function rod(a: Three.Vector3, b: Three.Vector3, r: number, m: Three.Material, parent: Three.Object3D = scene) {
        const result = cylinder(r, r, a.distanceTo(b), 0, 0, 0, m, parent, 10);
        result.position.copy(a).add(b).multiplyScalar(0.5);
        result.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        return result;
      }
      function group(name?: string, href?: string) {
        const result = new T.Group();
        if (name && href) { result.userData = { name, href }; clickables.push(result); }
        scene.add(result);
        return result;
      }
      function canvasTexture(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) {
        const c = document.createElement("canvas"); c.width = width; c.height = height;
        const ctx = c.getContext("2d");
        if (ctx) draw(ctx);
        const texture = new T.CanvasTexture(c);
        texture.colorSpace = T.SRGBColorSpace;
        textures.add(texture);
        return texture;
      }
      function emissiveMaterial(color: string, intensity: number, map?: Three.Texture) {
        const m = new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.7, map });
        materials.add(m); return m;
      }

      // Floating architectural section, individual timber floorboards and skirting.
      svgLayer(box(8.25, 0.3, 6.35, 0, -0.2, 0, palette.violet, scene, 0.08), -60);
      for (let i = 0; i < 22; i++) {
        const color = new T.Color("#bc9675").offsetHSL(0, 0, ((i * 7) % 9 - 4) * 0.008);
        const plankMaterial = mat(`#${color.getHexString()}`);
        svgLayer(box(0.357, 0.085, 6.05, -3.82 + i * 0.363, 0, 0, plankMaterial), -50);
        for (let j = 0; !compatibility && j < 3; j++) {
          box(0.006, 0.003, 1.2 + ((i + j) % 3) * 0.2, -3.8 + i * 0.363 + j * 0.075, 0.044, -2.15 + j * 2.05, palette.woodLight);
        }
      }
      svgLayer(box(8.1, 3.8, 0.12, 0, 1.86, -3.07, palette.wall), -40);
      svgLayer(box(0.12, 3.8, 6.15, -4.06, 1.86, 0, palette.wall), -40);
      box(8, 0.14, 0.09, 0, 0.11, -2.98, palette.woodLight);
      box(0.09, 0.14, 6, -3.98, 0.11, 0, palette.woodLight);
      box(8.1, 0.1, 0.16, 0, 3.8, -3.06, palette.ivory);
      box(0.16, 0.1, 6.15, -4.06, 3.8, 0, palette.ivory);

      const shadowMat = new T.ShadowMaterial({ color: "#51435f", opacity: 0.13 });
      materials.add(shadowMat);
      const ground = mesh(new T.PlaneGeometry(200, 200), shadowMat);
      ground.rotation.x = -Math.PI / 2; ground.position.y = -0.37; ground.castShadow = false;
      ground.visible = !compatibility; // The SVG backend does not implement ShadowMaterial.

      // Dusk skyline is a scene illustration, not a photograph or claimed location.
      const skyline = canvasTexture(768, 576, (ctx) => {
        const sky = ctx.createLinearGradient(0, 0, 0, 576);
        sky.addColorStop(0, "#555b83"); sky.addColorStop(0.58, "#bb94b4"); sky.addColorStop(1, "#dfb5a9");
        ctx.fillStyle = sky; ctx.fillRect(0, 0, 768, 576);
        ctx.fillStyle = "#e7cfba"; ctx.beginPath(); ctx.arc(578, 123, 29, 0, Math.PI * 2); ctx.fill();
        for (let layer = 0; layer < 2; layer++) for (let i = 0; i < 15; i++) {
          const x = i * 57 - layer * 18;
          const h = 100 + ((i * 53 + layer * 71) % 160);
          const y = 576 - h + layer * 56;
          ctx.fillStyle = layer ? "#49455f" : "#77748e"; ctx.fillRect(x, y, 42, h);
          ctx.fillStyle = "#dcbfa7";
          for (let w = 0; w < 3; w++) for (let row = 0; row < 10; row++) if ((i + w * 3 + row * 7) % 4 === 0) ctx.fillRect(x + 6 + w * 11, y + 12 + row * 20, 4, 7);
        }
      });
      const windowFrame = box(2.9, 2.15, 0.13, 2.04, 2.28, -2.96, palette.darkWood);
      const skyMat = new T.MeshBasicMaterial({ map: skyline, color: compatibility ? "#a69cb7" : "#ffffff" }); materials.add(skyMat);
      const windowScene = mesh(new T.PlaneGeometry(2.7, 1.95), skyMat); windowScene.position.set(2.04, 2.28, -2.877);
      if (compatibility) {
        windowFrame.material = [palette.darkWood, palette.darkWood, palette.darkWood, palette.darkWood, skyMat, palette.darkWood];
        windowScene.visible = false;
      }
      box(0.055, 2, 0.09, 2.04, 2.28, -2.81, palette.ivory);
      box(2.8, 0.05, 0.09, 2.04, 2.27, -2.81, palette.ivory);
      box(3.15, 0.1, 0.39, 2.04, 1.18, -2.84, palette.woodLight, scene, 0.02);
      for (let i = 0; i < 7; i++) box(0.09, 2.3, 0.11, 0.5 + i * 0.055, 2.18, -2.68, i % 2 ? palette.ivory : palette.cream);

      // Bookshelf, with individual spines and a restrained reading corner.
      const shelf = group("bookshelf", "/learning");
      box(1.45, 2.7, 0.13, -3.02, 1.4, -2.64, palette.wood, shelf);
      for (const x of [-3.77, -2.27]) box(0.1, 2.8, 0.69, x, 1.45, -2.37, palette.woodLight, shelf);
      for (const y of [0.12, 0.85, 1.58, 2.31, 2.84]) box(1.6, 0.09, 0.73, -3.02, y, -2.35, palette.woodLight, shelf);
      const bookColors = [palette.burgundy, palette.blue, palette.cream, palette.violet, palette.green, palette.mauve];
      for (let level = 0; level < 3; level++) for (let i = 0; i < 8; i++) {
        const h = 0.37 + ((i * 3 + level) % 4) * 0.06;
        const x = -3.62 + i * 0.154;
        const y = 0.17 + level * 0.73 + h / 2;
        box(0.11, h, 0.41, x, y, -2.28, bookColors[(i + level * 2) % bookColors.length], shelf, 0.01);
        box(0.072, 0.012, 0.006, x, y + h * 0.27, -2.07, palette.ivory, shelf);
        box(0.072, 0.008, 0.006, x, y - h * 0.27, -2.07, palette.ivory, shelf);
      }
      box(0.53, 0.29, 0.47, -3.41, 2.5, -2.3, palette.cream, shelf, 0.04);
      box(0.11, 0.035, 0.02, -3.41, 2.5, -2.05, palette.darkWood, shelf);
      sphere(-2.66, 2.48, -2.27, 0.14, 0.15, 0.14, palette.mauve, shelf);
      cylinder(0.06, 0.06, 0.12, -2.66, 2.61, -2.27, palette.mauve, shelf);

      const rug = svgLayer(box(3.25, 0.025, 2.9, -0.15, 0.06, 0.9, palette.ivory, scene, 0.01), -30);
      rug.rotation.y = -0.04;
      for (let i = 0; !compatibility && i < 8; i++) box(0.012, 0.003, 2.7, -1.55 + i * 0.39, 0.075, 0.9, palette.cream);

      // Walnut desk and screens form the engineering portal.
      const desk = group("computer", "/lab?category=software");
      box(3.55, 0.14, 1.16, -0.32, 1.15, -1.97, palette.woodLight, desk, 0.025);
      for (const x of [-1.88, 1.24]) for (const z of [-2.4, -1.53]) box(0.1, 1.08, 0.1, x, 0.59, z, palette.darkWood, desk, 0.02);
      box(0.8, 0.66, 0.87, -1.26, 0.76, -2.02, palette.wood, desk, 0.025);
      for (const y of [0.59, 0.81, 1.02]) { box(0.76, 0.012, 0.015, -1.26, y, -1.575, palette.darkWood, desk); box(0.2, 0.018, 0.04, -1.26, y + 0.06, -1.54, palette.cream, desk); }

      const screenCode = canvasTexture(512, 320, (ctx) => {
        ctx.fillStyle = "#27243c"; ctx.fillRect(0, 0, 512, 320);
        ctx.fillStyle = "#383247"; ctx.fillRect(0, 0, 512, 25); ctx.fillRect(0, 25, 79, 295);
        ["#cf9f9b", "#e2c390", "#8ea995"].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(15 + i * 14, 12, 3, 0, 7); ctx.fill(); });
        const colors = ["#b5a6db", "#a3b8cb", "#d4b88e", "#93b4a6"];
        for (let row = 0; row < 16; row++) {
          ctx.fillStyle = "#6d627e"; ctx.fillRect(89, 42 + row * 16, 8, 3);
          const indent = row % 5 === 0 ? 0 : row % 3 * 18;
          for (let seg = 0; seg < 3; seg++) { ctx.fillStyle = colors[(row + seg) % 4]; ctx.fillRect(115 + indent + seg * 77, 42 + row * 16, 22 + ((row * 13 + seg * 7) % 46), 4); }
        }
        ctx.fillStyle = "#7f7396"; for (let i = 0; i < 10; i++) ctx.fillRect(15, 45 + i * 17, 27 + i % 3 * 9, 3);
      });
      const screenWorld = canvasTexture(512, 320, (ctx) => {
        const gradient = ctx.createLinearGradient(0, 0, 512, 320); gradient.addColorStop(0, "#46506b"); gradient.addColorStop(1, "#9f7e9b"); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 320);
        ctx.strokeStyle = "#c6bbc9"; ctx.lineWidth = 1.5;
        for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(256, 135); ctx.lineTo(i * 64, 320); ctx.stroke(); }
        for (const y of [175, 210, 260, 315]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke(); }
        ctx.fillStyle = "#d2b7b9"; ctx.beginPath(); ctx.moveTo(204, 107); ctx.lineTo(294, 78); ctx.lineTo(344, 113); ctx.lineTo(258, 148); ctx.fill();
        ctx.fillStyle = "#9b789e"; ctx.beginPath(); ctx.moveTo(204, 107); ctx.lineTo(258, 148); ctx.lineTo(258, 242); ctx.lineTo(204, 203); ctx.fill();
        ctx.fillStyle = "#b69bab"; ctx.beginPath(); ctx.moveTo(258, 148); ctx.lineTo(344, 113); ctx.lineTo(344, 205); ctx.lineTo(258, 242); ctx.fill();
        ctx.font = "13px sans-serif"; ctx.fillStyle = "#efe4dc"; ctx.fillText("a world in progress", 20, 28);
      });
      for (let i = 0; i < 2; i++) {
        const x = -0.92 + i * 1.25;
        const monitor = new T.Group(); desk.add(monitor); monitor.position.set(x, 1.84, -2.18); monitor.rotation.y = i ? -0.12 : 0.12;
        const monitorBody = box(1.16, 0.76, 0.075, 0, 0, 0, palette.ink, monitor, 0.025);
        const sm = new T.MeshBasicMaterial({ map: i ? screenWorld : screenCode, color: compatibility ? (i ? "#a79bb8" : "#52516c") : "#ffffff" }); materials.add(sm);
        const display = mesh(new T.PlaneGeometry(1.07, 0.65), sm, monitor); display.position.z = 0.041;
        if (compatibility) {
          monitorBody.material = [palette.ink, palette.ink, palette.ink, palette.ink, sm, palette.ink];
          display.visible = false;
        }
        box(0.055, 0.23, 0.07, 0, -0.48, -0.005, palette.metal, monitor);
        box(0.37, 0.025, 0.23, 0, -0.6, 0.02, palette.ink, monitor, 0.01);
      }
      box(1.19, 0.035, 0.37, -0.48, 1.25, -1.63, palette.ink, desk, 0.01);
      for (let row = 0; row < 4; row++) for (let col = 0; col < 12; col++) box(0.067, 0.014, 0.06, -0.99 + col * 0.09, 1.275, -1.76 + row * 0.075, (col + row) % 5 === 0 ? palette.mauve : palette.metal, desk, 0.004);
      sphere(0.39, 1.28, -1.58, 0.08, 0.038, 0.12, palette.ink, desk);
      box(0.43, 0.065, 0.5, 0.97, 1.23, -2.02, palette.cream, desk, 0.01);
      cylinder(0.083, 0.073, 0.19, 0.94, 1.36, -2.02, palette.mauve, desk);
      const handle = mesh(new T.TorusGeometry(0.065, 0.015, 7, 16), palette.mauve, desk); handle.position.set(1.02, 1.38, -2.02); handle.rotation.y = Math.PI / 2;

      // Notebook is its own target, separate from the rest of the desk.
      const notebook = group("notebook", "/thoughts");
      box(0.58, 0.06, 0.4, -1.69, 1.255, -1.92, palette.burgundy, notebook, 0.015);
      box(0.54, 0.025, 0.37, -1.69, 1.3, -1.92, palette.ivory, notebook);
      box(0.013, 0.004, 0.35, -1.69, 1.314, -1.92, palette.wood, notebook);
      for (let i = 0; i < 5; i++) box(0.19, 0.003, 0.008, -1.55, 1.316, -2.04 + i * 0.048, palette.mauve, notebook);
      const pen = cylinder(0.012, 0.012, 0.39, -1.39, 1.31, -1.88, palette.ink, notebook, 8); pen.rotation.x = Math.PI / 2; pen.rotation.z = 0.16;

      // Ergonomic chair and the user's consistent character silhouette.
      const chair = group(); chair.position.set(-0.18, 0, -0.12); chair.rotation.y = -0.16;
      cylinder(0.08, 0.08, 0.5, 0, 0.36, 0, palette.metal, chair);
      for (let i = 0; i < 5; i++) { const angle = i * Math.PI * 2 / 5; rod(new T.Vector3(0, 0.16, 0), new T.Vector3(Math.cos(angle) * 0.49, 0.12, Math.sin(angle) * 0.49), 0.035, palette.ink, chair); sphere(Math.cos(angle) * 0.49, 0.1, Math.sin(angle) * 0.49, 0.055, 0.07, 0.055, palette.ink, chair); }
      box(0.71, 0.14, 0.68, 0, 0.68, 0, palette.ink, chair, 0.05);
      box(0.66, 0.98, 0.12, 0, 1.19, -0.32, palette.ink, chair, 0.045);
      box(0.43, 0.7, 0.035, 0, 1.2, -0.24, palette.violet, chair, 0.025);
      for (const x of [-0.41, 0.41]) { box(0.055, 0.32, 0.06, x, 0.81, -0.02, palette.ink, chair); box(0.14, 0.065, 0.45, x, 0.96, -0.02, palette.ink, chair, 0.02); }
      const person = new T.Group(); chair.add(person); person.position.set(0, 0.01, 0.09);
      sphere(0, 1.12, 0, 0.3, 0.43, 0.23, palette.burgundy, person);
      sphere(0, 1.44, -0.1, 0.26, 0.17, 0.18, palette.burgundy, person);
      box(0.16, 0.24, 0.032, 0, 1.38, 0.2, palette.ink, person, 0.01);
      for (const x of [-0.28, 0.28]) {
        rod(new T.Vector3(x, 1.36, 0), new T.Vector3(x * 1.2, 0.99, 0.2), 0.105, palette.burgundy, person);
        rod(new T.Vector3(x * 1.2, 0.99, 0.2), new T.Vector3(x * 0.65, 0.84, 0.38), 0.088, palette.burgundy, person);
        sphere(x * 0.65, 0.84, 0.39, 0.067, 0.047, 0.08, palette.skin, person);
      }
      for (const x of [-0.15, 0.15]) {
        rod(new T.Vector3(x, 0.78, 0.1), new T.Vector3(x * 1.2, 0.66, 0.56), 0.14, palette.cargo, person);
        rod(new T.Vector3(x * 1.2, 0.66, 0.56), new T.Vector3(x * 1.3, 0.19, 0.69), 0.11, palette.cargo, person);
        box(0.1, 0.17, 0.08, x * 2, 0.48, 0.61, palette.cargo, person, 0.015);
        sphere(x * 1.3, 0.12, 0.78, 0.12, 0.09, 0.23, palette.white, person);
        box(0.16, 0.02, 0.18, x * 1.3, 0.19, 0.78, palette.metal, person, 0.005);
      }
      cylinder(0.065, 0.07, 0.13, 0, 1.52, 0.05, palette.skin, person);
      sphere(0, 1.76, 0.06, 0.19, 0.25, 0.2, palette.skin, person);
      sphere(0, 1.87, 0.015, 0.206, 0.18, 0.197, palette.hair, person);
      for (let i = 0; i < 5; i++) sphere(-0.14 + i * 0.066, 1.92 - (i % 2) * 0.03, 0.165, 0.062, 0.1, 0.064, palette.hair, person);
      for (const x of [-0.205, 0.205]) sphere(x, 1.75, 0.035, 0.035, 0.063, 0.04, palette.skin, person);
      for (const x of [-0.088, 0.088]) {
        const glasses = mesh(new T.TorusGeometry(0.065, 0.011, 8, 28), palette.ink, person); glasses.position.set(x, 1.76, 0.276);
        sphere(x, 1.755, 0.267, 0.016, 0.022, 0.012, palette.hair, person);
      }
      box(0.055, 0.01, 0.015, 0, 1.775, 0.275, palette.ink, person);
      sphere(0, 1.71, 0.267, 0.025, 0.037, 0.03, palette.skin, person);
      const smile = mesh(new T.TorusGeometry(0.032, 0.006, 6, 12, Math.PI * 0.65), palette.darkWood, person); smile.position.set(-0.01, 1.663, 0.248); smile.rotation.z = Math.PI * 1.2;

      // Travel prints hang on the left wall. An existing, real travel image is reused.
      const photos = group("photos", "/memories");
      const photoLoader = new T.TextureLoader();
      const photoTexture = photoLoader.load("/images/huolunbeier-memory.webp", () => { if (!disposed) invalidate(); }, undefined, () => {});
      photoTexture.colorSpace = T.SRGBColorSpace; textures.add(photoTexture);
      const photoMat = new T.MeshBasicMaterial({ map: photoTexture, color: compatibility ? "#9aab99" : "#ffffff" }); materials.add(photoMat);
      for (let i = 0; i < 3; i++) {
        const print = new T.Group(); photos.add(print); print.position.set(-3.93, 2.55 - (i % 2) * 0.1, -0.65 + i * 0.94); print.rotation.y = Math.PI / 2;
        box(0.76, 0.92, 0.035, 0, 0, 0, compatibility ? palette.greenLight : palette.white, print);
        const image = mesh(new T.PlaneGeometry(0.66, 0.67), photoMat, print); image.position.set(0, 0.06, 0.022);
        image.visible = !compatibility;
        box(0.15, 0.07, 0.008, 0, 0.46, 0.026, palette.cream, print);
      }
      rod(new T.Vector3(-3.86, 3.11, -1.2), new T.Vector3(-3.86, 3.11, 1.8), 0.009, palette.darkWood, photos);
      for (let i = 0; i < 3; i++) rod(new T.Vector3(-3.86, 3.11, -0.65 + i * 0.94), new T.Vector3(-3.86, 2.98 - (i % 2) * 0.1, -0.65 + i * 0.94), 0.006, palette.darkWood, photos);

      // Resting corner: woven bedding, a low bedside table and a small lamp.
      const bed = group();
      box(1.77, 0.32, 2.45, 2.68, 0.3, 0.97, palette.wood, bed, 0.05);
      for (const x of [1.96, 3.4]) for (const z of [-0.1, 2.03]) cylinder(0.06, 0.045, 0.2, x, 0.14, z, palette.darkWood, bed);
      svgLayer(box(1.68, 0.22, 2.3, 2.68, 0.56, 0.97, compatibility ? palette.mauve : palette.white, bed, 0.08), 1);
      box(1.79, 0.87, 0.15, 2.68, 0.6, -0.27, palette.woodLight, bed, 0.035);
      if (!compatibility) {
        box(1.74, 0.19, 1.68, 2.68, 0.73, 1.31, palette.mauve, bed, 0.07);
        for (let i = 0; i < 12; i++) box(0.008, 0.004, 1.55, 1.91 + i * 0.139, 0.828, 1.32, palette.cream, bed);
      }
      svgLayer(box(1.48, 0.12, 0.42, 2.68, compatibility ? 0.71 : 0.81, 0.65, palette.violet, bed, 0.045), 2);
      svgLayer(box(1.12, 0.2, 0.53, 2.68, compatibility ? 0.75 : 0.76, 0.19, palette.ivory, bed, 0.07), 2);
      cylinder(0.43, 0.43, 0.07, 1.44, 0.69, -0.44, palette.woodLight);
      cylinder(0.045, 0.045, 0.59, 1.44, 0.36, -0.44, palette.darkWood);
      cylinder(0.26, 0.26, 0.04, 1.44, 0.09, -0.44, palette.darkWood);
      cylinder(0.1, 0.14, 0.035, 1.44, 0.75, -0.44, palette.burgundy);
      cylinder(0.024, 0.024, 0.31, 1.44, 0.91, -0.44, palette.metal);
      const lampshade = emissiveMaterial("#eacda2", 0.25);
      cylinder(0.13, 0.26, 0.28, 1.44, 1.16, -0.44, lampshade);
      const lamp = new T.PointLight("#ffcc91", 5, 4); lamp.position.set(1.44, 1.08, -0.44); scene.add(lamp);

      function plant(x: number, z: number, scale: number) {
        const p = group(); p.position.set(x, 0.05, z); p.scale.setScalar(scale);
        cylinder(0.25, 0.18, 0.43, 0, 0.215, 0, palette.terracotta, p);
        cylinder(0.26, 0.26, 0.05, 0, 0.43, 0, palette.terracotta, p);
        cylinder(0.23, 0.23, 0.012, 0, 0.44, 0, palette.darkWood, p);
        for (let i = 0; i < 7; i++) {
          const angle = i * 2.4;
          const height = 0.7 + i % 3 * 0.24;
          const end = new T.Vector3(Math.sin(angle) * 0.32, height, Math.cos(angle) * 0.32);
          rod(new T.Vector3(0, 0.44, 0), end, 0.014, palette.green, p);
          const leaf = sphere(end.x, end.y + 0.07, end.z, 0.13, 0.25, 0.055, i % 2 ? palette.green : palette.greenLight, p);
          leaf.rotation.set(0.5, angle, -0.5);
        }
      }
      plant(-3.37, 2.26, 1.25);
      plant(3.32, -2.24, 0.87);
      // Desk task light and a framed typographic study.
      cylinder(0.13, 0.13, 0.03, -1.79, 1.25, -2.39, palette.ink);
      rod(new T.Vector3(-1.79, 1.26, -2.39), new T.Vector3(-1.82, 1.88, -2.39), 0.025, palette.metal);
      rod(new T.Vector3(-1.82, 1.88, -2.39), new T.Vector3(-1.51, 2.05, -2.39), 0.025, palette.metal);
      const shade = cylinder(0.06, 0.14, 0.12, -1.5, 2.02, -2.39, palette.ivory); shade.rotation.z = -0.3;
      const taskLight = new T.PointLight("#ffd9ad", 3, 3); taskLight.position.set(-1.5, 1.94, -2.3); scene.add(taskLight);
      const posterTex = canvasTexture(256, 320, ctx => { ctx.fillStyle = "#f1e8d9"; ctx.fillRect(0, 0, 256, 320); ctx.fillStyle = "#77566f"; ctx.font = "bold 25px sans-serif"; ctx.fillText("STILL", 28, 80); ctx.fillText("LEARNING.", 28, 118); ctx.fillText("ALWAYS", 28, 177); ctx.fillText("MAKING.", 28, 215); ctx.fillStyle = "#b9a0b5"; ctx.fillRect(28, 258, 45, 3); });
      const posterFrame = box(0.76, 0.95, 0.055, -1.22, 2.91, -2.95, palette.wood);
      const posterMat = new T.MeshBasicMaterial({ map: posterTex, color: compatibility ? "#eee4d7" : "#ffffff" }); materials.add(posterMat);
      const poster = mesh(new T.PlaneGeometry(0.68, 0.87), posterMat); poster.position.set(-1.22, 2.91, -2.916);
      if (compatibility) {
        posterFrame.material = [palette.wood, palette.wood, palette.wood, palette.wood, posterMat, palette.wood];
        poster.visible = false;
      }

      scene.add(new T.HemisphereLight("#e7e3ff", "#9b7664", 2.2));
      const key = new T.DirectionalLight("#fff0d7", 4.2); key.position.set(3, 9, 7); key.castShadow = true;
      const shadowSize = smallScreen ? 1024 : 1536;
      key.shadow.mapSize.set(shadowSize, shadowSize); key.shadow.camera.left = -7; key.shadow.camera.right = 7; key.shadow.camera.top = 7; key.shadow.camera.bottom = -7;
      key.shadow.normalBias = 0.025; key.shadow.bias = -0.00015; key.shadow.radius = 3; scene.add(key);
      const fill = new T.DirectionalLight("#b5adf1", 1.7); fill.position.set(-3, 4, 0); scene.add(fill);
      const windowLight = new T.PointLight("#c6a1c9", 7, 8); windowLight.position.set(2, 2.6, -2.4); scene.add(windowLight);
      if (compatibility) {
        // SVGRenderer has no tone mapping or hemisphere-light shader; keep its palette readable.
        scene.traverse(object => { if (object instanceof T.Light) object.intensity *= 0.17; });
        scene.add(new T.AmbientLight("#ebe3ef", 0.62));
      }

      function render() {
        frame = 0;
        if (disposed || failed || contextLost || !visible || document.hidden) return;
        const distance = camera.position.distanceTo(positionGoal) + target.distanceTo(targetGoal) + Math.abs(camera.zoom - zoomGoal);
        if (compatibility || reduceMotion.matches || distance < 0.008) {
          camera.position.copy(positionGoal); target.copy(targetGoal); camera.zoom = zoomGoal;
        } else {
          camera.position.lerp(positionGoal, 0.12); target.lerp(targetGoal, 0.12); camera.zoom += (zoomGoal - camera.zoom) * 0.12;
          frame = window.requestAnimationFrame(render);
        }
        camera.lookAt(target); camera.updateProjectionMatrix();
        try { renderer.render(scene, camera); } catch { reportError(); }
      }
      function invalidate() { if (!frame && !disposed && !failed && visible && !document.hidden && !contextLost) frame = window.requestAnimationFrame(render); }
      function resize() {
        if (!host || disposed || failed) return;
        const width = Math.max(host.clientWidth, 1); const height = Math.max(host.clientHeight, 1); const aspect = width / height;
        const frustum = Math.max(8.6, 11.3 / aspect);
        camera.left = -frustum * aspect / 2; camera.right = frustum * aspect / 2; camera.top = frustum / 2; camera.bottom = -frustum / 2;
        camera.updateProjectionMatrix();
        try { renderer.setSize(width, height); invalidate(); } catch { reportError(); }
      }
      function setView(view: StudioView) {
        if (view === "desk") { positionGoal.set(7, 6.7, 11); targetGoal.set(-0.6, 1.5, -1.2); zoomGoal = 1.52; }
        else if (view === "memories") { positionGoal.set(9, 5.5, 5.6); targetGoal.set(-2.8, 2, 0.2); zoomGoal = 1.62; }
        else { positionGoal.set(10, 9.5, 12); targetGoal.set(0, 1.3, 0); zoomGoal = 1; }
        azimuth = Math.atan2(positionGoal.x - targetGoal.x, positionGoal.z - targetGoal.z);
        invalidate();
      }
      controller.current = { setView };
      const raycaster = new T.Raycaster();
      const pointer = new T.Vector2();
      function hit(event: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(clickables, true);
        for (const intersection of hits) {
          let object: Three.Object3D | null = intersection.object;
          while (object && !object.userData.href) object = object.parent;
          if (object?.userData.href) return object;
        }
        return null;
      }
      function onPointerDown(event: PointerEvent) {
        if (event.button !== 0) return;
        pointerDown = { x: event.clientX, y: event.clientY, azimuth, moved: false };
        renderer.domElement.setPointerCapture(event.pointerId);
      }
      function onPointerMove(event: PointerEvent) {
        if (pointerDown) {
          const dx = event.clientX - pointerDown.x;
          if (Math.abs(dx) + Math.abs(event.clientY - pointerDown.y) > 6) pointerDown.moved = true;
          if (pointerDown.moved) {
            azimuth = Math.max(0.18, Math.min(1.35, pointerDown.azimuth - dx * 0.004));
            const radius = 15.62;
            positionGoal.x = targetGoal.x + Math.sin(azimuth) * radius;
            positionGoal.z = targetGoal.z + Math.cos(azimuth) * radius;
            renderer.domElement.style.cursor = "grabbing";
            callbacks.current.onHover(null); invalidate(); return;
          }
        }
        const hovered = hit(event);
        renderer.domElement.style.cursor = hovered ? "pointer" : "grab";
        callbacks.current.onHover(hovered?.userData.name || null);
      }
      function onPointerUp(event: PointerEvent) {
        if (!pointerDown) return;
        const moved = pointerDown.moved; pointerDown = null;
        if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
        renderer.domElement.style.cursor = "grab";
        if (!moved) { const selected = hit(event); if (selected) callbacks.current.onNavigate(selected.userData.href); }
      }
      function onPointerCancel() { pointerDown = null; renderer.domElement.style.cursor = "grab"; callbacks.current.onHover(null); }
      function onPointerLeave() { if (!pointerDown) callbacks.current.onHover(null); }
      function onContextLost(event: Event) { event.preventDefault(); contextLost = true; reportError(); }
      function onVisibility() { if (document.hidden) { window.cancelAnimationFrame(frame); frame = 0; } else invalidate(); }
      const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
      const intersectionObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) invalidate(); else { window.cancelAnimationFrame(frame); frame = 0; } });
      intersectionObserver.observe(host);
      renderer.domElement.addEventListener("pointerdown", onPointerDown as EventListener);
      renderer.domElement.addEventListener("pointermove", onPointerMove as EventListener);
      renderer.domElement.addEventListener("pointerup", onPointerUp as EventListener);
      renderer.domElement.addEventListener("pointercancel", onPointerCancel);
      renderer.domElement.addEventListener("pointerleave", onPointerLeave);
      renderer.domElement.addEventListener("webglcontextlost", onContextLost);
      document.addEventListener("visibilitychange", onVisibility);
      reduceMotion.addEventListener("change", invalidate);
      let cleanedUp = false;
      cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        window.cancelAnimationFrame(frame); frame = 0; controller.current = null;
        resizeObserver.disconnect(); intersectionObserver.disconnect();
        renderer.domElement.removeEventListener("pointerdown", onPointerDown as EventListener);
        renderer.domElement.removeEventListener("pointermove", onPointerMove as EventListener);
        renderer.domElement.removeEventListener("pointerup", onPointerUp as EventListener);
        renderer.domElement.removeEventListener("pointercancel", onPointerCancel);
        renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        document.removeEventListener("visibilitychange", onVisibility);
        reduceMotion.removeEventListener("change", invalidate);
        key.shadow.dispose(); disposeResources();
      };
      resize();
      if (failed) return;
      setView(callbacks.current.view); render();
      if (!failed) callbacks.current.onReady();
    }
    createStudio().catch(reportError);
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div ref={container} className="studio-canvas" role="img" aria-label={props.label} />;
}
