import * as THREE from "three";

export interface CanvasSceneRenderer {
  domElement: HTMLCanvasElement;
  setSize: (width: number, height: number, dpr: number) => void;
  render: () => void;
  dispose: () => void;
}

type Surface = THREE.Material & Partial<Pick<THREE.MeshPhysicalMaterial,
  "color" | "metalness" | "roughness" | "transmission" | "clearcoat">>;
interface Shade { r: number; g: number; b: number; a: number }
interface Triangle { a: number; b: number; c: number; material: number; depth: number; back: boolean; cache: MeshCache }
interface MeshCache {
  mesh: THREE.Mesh;
  geometry: THREE.BufferGeometry;
  positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute;
  normals: THREE.BufferAttribute | THREE.InterleavedBufferAttribute;
  screen: Float32Array;
  world: Float32Array;
  normal: Float32Array;
  lights: Float32Array;
  triangles: Triangle[];
  surfaces: Surface[];
  baseColors: number[][];
  shades: Map<number, Shade>;
}
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const light = new THREE.Vector3(-.6, .95, 1).normalize();
const fillLight = new THREE.Vector3(.8, .45, -.6).normalize();
const softbox = new THREE.Vector3(-.18, .7, .69).normalize();
const secondaryBox = new THREE.Vector3(.7, .2, .7).normalize();

/**
 * A CPU projection of the real mesh geometry for browsers without WebGL.
 * It approximates material response; it does not claim physically based refraction.
 * Ownership of Three geometries/materials stays with the scene controller.
 */
export function createCanvasSceneRenderer(
  host: HTMLDivElement,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  root: THREE.Object3D,
): CanvasSceneRenderer {
  const canvas = document.createElement("canvas");
  const layer = document.createElement("canvas");
  const backdrop = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const paint = layer.getContext("2d");
  const background = backdrop.getContext("2d", { alpha: false });
  if (!ctx || !paint || !background) throw new Error("Canvas 2D rendering is unavailable");
  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");
  canvas.dataset.renderer = "canvas-3d";
  canvas.style.width = "100%"; canvas.style.height = "100%";
  host.appendChild(canvas);
  let width = 1, height = 1, ratio = 1, disposed = false;
  let rasterWidth = 1, rasterHeight = 1, rasterScale = 1;
  let pixels = paint.createImageData(1, 1);
  let depthBuffer = new Float32Array(1);
  const caches = new Map<THREE.Mesh, MeshCache>();
  const queue: Triangle[] = [];
  const projection = new THREE.Matrix4();
  const normalsMatrix = new THREE.Matrix3();
  const cameraPosition = new THREE.Vector3();
  const color = new THREE.Color();
  const groundPoint = new THREE.Vector3();
  const edgePoint = new THREE.Vector3();

  function cacheMesh(mesh: THREE.Mesh): MeshCache | null {
    const geometry = mesh.geometry;
    const old = caches.get(mesh);
    if (old?.geometry === geometry) return old;
    const positions = geometry.getAttribute("position");
    if (!positions) return null;
    if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
    const normals = geometry.getAttribute("normal");
    const count = positions.count;
    const cache: MeshCache = {
      mesh, geometry, positions, normals,
      screen: new Float32Array(count * 3), world: new Float32Array(count * 3), normal: new Float32Array(count * 3),
      lights: new Float32Array(count * 4), triangles: [], surfaces: [], baseColors: [], shades: new Map(),
    };
    const indices = geometry.getIndex();
    const end = Math.min(indices?.count ?? count, geometry.drawRange.start + geometry.drawRange.count);
    let groupIndex = 0;
    for (let i = geometry.drawRange.start; i + 2 < end; i += 3) {
      while (groupIndex + 1 < geometry.groups.length && i >= geometry.groups[groupIndex].start + geometry.groups[groupIndex].count) groupIndex++;
      cache.triangles.push({
        a: indices ? indices.getX(i) : i,
        b: indices ? indices.getX(i + 1) : i + 1,
        c: indices ? indices.getX(i + 2) : i + 2,
        material: geometry.groups[groupIndex]?.materialIndex ?? 0,
        depth: 0, back: false, cache,
      });
    }
    caches.set(mesh, cache);
    return cache;
  }

  function makeBackdrop() {
    background!.setTransform(ratio, 0, 0, ratio, 0, 0);
    const vertical = background!.createLinearGradient(0, 0, 0, height);
    vertical.addColorStop(0, "#15131e"); vertical.addColorStop(.65, "#252031"); vertical.addColorStop(1, "#100f18");
    background!.fillStyle = vertical; background!.fillRect(0, 0, width, height);
    const glow = background!.createRadialGradient(width * .42, height * .28, 0, width * .46, height * .32, width * .68);
    glow.addColorStop(0, "rgba(150,118,184,.19)"); glow.addColorStop(.52, "rgba(85,67,109,.07)"); glow.addColorStop(1, "rgba(30,25,41,0)");
    background!.fillStyle = glow; background!.fillRect(0, 0, width, height);
    // Broad light from above, without particle effects or fake image assets.
    const beam = background!.createLinearGradient(0, 0, width * .55, height * .7);
    beam.addColorStop(0, "rgba(233,220,255,.08)"); beam.addColorStop(1, "rgba(233,220,255,0)");
    background!.fillStyle = beam;
    background!.beginPath(); background!.moveTo(width * .15, 0); background!.lineTo(width * .34, 0);
    background!.lineTo(width * .92, height); background!.lineTo(width * .1, height); background!.closePath(); background!.fill();
  }

  const setSize = (nextWidth: number, nextHeight: number, dpr: number) => {
    if (disposed) return;
    width = Math.max(1, nextWidth); height = Math.max(1, nextHeight); ratio = clamp(dpr, 1, 1.5);
    for (const surface of [canvas, backdrop]) {
      surface.width = Math.max(1, Math.round(width * ratio)); surface.height = Math.max(1, Math.round(height * ratio));
    }
    rasterScale = Math.min(1, 560 / Math.max(width, height));
    rasterWidth = Math.max(1, Math.round(width * rasterScale)); rasterHeight = Math.max(1, Math.round(height * rasterScale));
    layer.width = rasterWidth; layer.height = rasterHeight;
    pixels = paint!.createImageData(rasterWidth, rasterHeight); depthBuffer = new Float32Array(rasterWidth * rasterHeight);
    makeBackdrop();
  };

  function project(cache: MeshCache) {
    const { mesh, positions, normals, screen, world, normal, lights } = cache;
    projection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse).multiply(mesh.matrixWorld);
    const p = projection.elements, m = mesh.matrixWorld.elements;
    normalsMatrix.getNormalMatrix(mesh.matrixWorld);
    const n = normalsMatrix.elements;
    cache.surfaces = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) as Surface[];
    cache.baseColors.length = 0;
    cache.shades.clear();
    for (const surface of cache.surfaces) {
      color.copy(surface.color ?? new THREE.Color("#b8adcb")).convertLinearToSRGB();
      cache.baseColors.push([color.r, color.g, color.b]);
    }
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i), o = i * 3;
      const w = p[3] * x + p[7] * y + p[11] * z + p[15];
      screen[o] = ((p[0] * x + p[4] * y + p[8] * z + p[12]) / w * .5 + .5) * width;
      screen[o + 1] = (-(p[1] * x + p[5] * y + p[9] * z + p[13]) / w * .5 + .5) * height;
      screen[o + 2] = (p[2] * x + p[6] * y + p[10] * z + p[14]) / w;
      const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
      const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
      const wz = m[2] * x + m[6] * y + m[10] * z + m[14];
      world[o] = wx; world[o + 1] = wy; world[o + 2] = wz;
      const ax = normals.getX(i), ay = normals.getY(i), az = normals.getZ(i);
      let nx = n[0] * ax + n[3] * ay + n[6] * az;
      let ny = n[1] * ax + n[4] * ay + n[7] * az;
      let nz = n[2] * ax + n[5] * ay + n[8] * az;
      const length = Math.hypot(nx, ny, nz) || 1;
      nx /= length; ny /= length; nz /= length;
      normal[o] = nx; normal[o + 1] = ny; normal[o + 2] = nz;
      let vx = cameraPosition.x - wx, vy = cameraPosition.y - wy, vz = cameraPosition.z - wz;
      const distance = Math.hypot(vx, vy, vz) || 1; vx /= distance; vy /= distance; vz /= distance;
      const viewDot = Math.abs(nx * vx + ny * vy + nz * vz);
      const reflectionDot = 2 * (nx * vx + ny * vy + nz * vz);
      const rx = reflectionDot * nx - vx, ry = reflectionDot * ny - vy, rz = reflectionDot * nz - vz;
      const diffuse = .19 + Math.max(0, nx * light.x + ny * light.y + nz * light.z) * .73 + Math.max(0, nx * fillLight.x + ny * fillLight.y + nz * fillLight.z) * .23;
      const primary = Math.max(0, rx * softbox.x + ry * softbox.y + rz * softbox.z);
      const secondary = Math.max(0, rx * secondaryBox.x + ry * secondaryBox.y + rz * secondaryBox.z);
      lights[i * 4] = diffuse;
      lights[i * 4 + 1] = primary;
      lights[i * 4 + 2] = secondary;
      lights[i * 4 + 3] = Math.pow(1 - clamp(viewDot), 3);
    }
    for (const triangle of cache.triangles) {
      const a = triangle.a * 3, b = triangle.b * 3, c = triangle.c * 3;
      if (screen[a + 2] < -1 || screen[b + 2] < -1 || screen[c + 2] < -1) continue;
      const area = (screen[b] - screen[a]) * (screen[c + 1] - screen[a + 1]) - (screen[b + 1] - screen[a + 1]) * (screen[c] - screen[a]);
      if (Math.abs(area) < .1) continue;
      const surface = cache.surfaces[triangle.material] ?? cache.surfaces[0];
      if (!surface || !surface.visible) continue;
      triangle.back = area > 0;
      if (triangle.back && surface.side !== THREE.DoubleSide && surface.side !== THREE.BackSide) continue;
      if (!triangle.back && surface.side === THREE.BackSide) continue;
      if (Math.max(screen[a], screen[b], screen[c]) < 0 || Math.min(screen[a], screen[b], screen[c]) > width || Math.max(screen[a + 1], screen[b + 1], screen[c + 1]) < 0 || Math.min(screen[a + 1], screen[b + 1], screen[c + 1]) > height) continue;
      triangle.depth = (screen[a + 2] + screen[b + 2] + screen[c + 2]) / 3;
      queue.push(triangle);
    }
  }

  function vertexColor(cache: MeshCache, index: number, materialIndex: number, back: boolean) {
    const key = (materialIndex * cache.positions.count + index) * 2 + Number(back);
    const cached = cache.shades.get(key); if (cached) return cached;
    const material = cache.surfaces[materialIndex] ?? cache.surfaces[0];
    const base = cache.baseColors[materialIndex] ?? cache.baseColors[0];
    const o = index * 4;
    const metal = material.metalness ?? 0;
    const roughness = Math.max(.07, material.roughness ?? .6);
    const transmission = material.transmission ?? 0;
    const fresnel = cache.lights[o + 3];
    const power = 10 + (1 - roughness) * 75;
    const sharp = Math.pow(cache.lights[o + 1], power) * 1.1 + Math.pow(cache.lights[o + 2], power * .72) * .48;
    const broad = Math.pow(cache.lights[o + 1], 7) * .24;
    const reflected = sharp * (.28 + metal * .95 + transmission * .7) + broad + fresnel * (.1 + metal * .14 + transmission * .5);
    const diffuse = cache.lights[o] * (1 - metal * .42) + metal * .1;
    const red = clamp(base[0] * diffuse + reflected * (metal > .7 ? .86 : 1));
    const green = clamp(base[1] * diffuse + reflected * (metal > .7 ? .9 : 1));
    const blue = clamp(base[2] * diffuse + reflected);
    const alpha = clamp(material.opacity * (transmission > .01 ? .46 + fresnel * .39 + reflected * .17 - transmission * .12 : 1) * (back && transmission > .01 ? .55 : 1), .08, 1);
    const shade = { r: red * 255, g: green * 255, b: blue * 255, a: alpha };
    cache.shades.set(key, shade); return shade;
  }

  function paintTriangle(triangle: Triangle) {
    const { cache, a, b, c } = triangle, { screen } = cache;
    const ax = screen[a * 3] * rasterScale, ay = screen[a * 3 + 1] * rasterScale;
    const bx = screen[b * 3] * rasterScale, by = screen[b * 3 + 1] * rasterScale;
    const cx = screen[c * 3] * rasterScale, cy = screen[c * 3 + 1] * rasterScale;
    const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx))), maxX = Math.min(rasterWidth - 1, Math.ceil(Math.max(ax, bx, cx)));
    const minY = Math.max(0, Math.floor(Math.min(ay, by, cy))), maxY = Math.min(rasterHeight - 1, Math.ceil(Math.max(ay, by, cy)));
    const denominator = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    if (Math.abs(denominator) < .00001) return;
    const inverse = 1 / denominator;
    const dx0 = (by - cy) * inverse, dy0 = (cx - bx) * inverse;
    const dx1 = (cy - ay) * inverse, dy1 = (ax - cx) * inverse;
    const s0 = vertexColor(cache, a, triangle.material, triangle.back), s1 = vertexColor(cache, b, triangle.material, triangle.back), s2 = vertexColor(cache, c, triangle.material, triangle.back);
    const opaque = s0.a > .995 && s1.a > .995 && s2.a > .995;
    const z0 = screen[a * 3 + 2], z1 = screen[b * 3 + 2], z2 = screen[c * 3 + 2];
    let row0 = ((by - cy) * (minX + .5 - cx) + (cx - bx) * (minY + .5 - cy)) * inverse;
    let row1 = ((cy - ay) * (minX + .5 - cx) + (ax - cx) * (minY + .5 - cy)) * inverse;
    const data = pixels.data;
    for (let y = minY; y <= maxY; y++, row0 += dy0, row1 += dy1) {
      let w0 = row0, w1 = row1;
      let pixel = y * rasterWidth + minX;
      for (let x = minX; x <= maxX; x++, pixel++, w0 += dx0, w1 += dx1) {
        const w2 = 1 - w0 - w1;
        if (w0 < -.0001 || w1 < -.0001 || w2 < -.0001) continue;
        const z = w0 * z0 + w1 * z1 + w2 * z2;
        if (z > depthBuffer[pixel] + .000001) continue;
        const offset = pixel * 4;
        const red = w0 * s0.r + w1 * s1.r + w2 * s2.r;
        const green = w0 * s0.g + w1 * s1.g + w2 * s2.g;
        const blue = w0 * s0.b + w1 * s1.b + w2 * s2.b;
        if (opaque) {
          depthBuffer[pixel] = z;
          data[offset] = red; data[offset + 1] = green; data[offset + 2] = blue; data[offset + 3] = 255;
        } else {
          const alpha = clamp(w0 * s0.a + w1 * s1.a + w2 * s2.a);
          const existing = data[offset + 3] / 255 * (1 - alpha);
          const total = alpha + existing;
          data[offset] = (red * alpha + data[offset] * existing) / total;
          data[offset + 1] = (green * alpha + data[offset + 1] * existing) / total;
          data[offset + 2] = (blue * alpha + data[offset + 2] * existing) / total;
          data[offset + 3] = total * 255;
        }
      }
    }
  }

  const render = () => {
    if (disposed) return;
    scene.updateMatrixWorld(true); camera.updateMatrixWorld(true); camera.getWorldPosition(cameraPosition);
    queue.length = 0;
    root.traverseVisible(object => { if ((object as THREE.Mesh).isMesh) { const cache = cacheMesh(object as THREE.Mesh); if (cache) project(cache); } });
    queue.sort((a, b) => b.depth - a.depth);
    pixels.data.fill(0); depthBuffer.fill(Infinity);
    for (const triangle of queue) paintTriangle(triangle);
    paint!.putImageData(pixels, 0, 0);
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx!.drawImage(backdrop, 0, 0, width, height);
    groundPoint.set(0, .04, 0).applyMatrix4(root.matrixWorld).project(camera);
    edgePoint.set(1.8, .04, 0).applyMatrix4(root.matrixWorld).project(camera);
    const groundX = (groundPoint.x * .5 + .5) * width;
    const groundY = clamp((-groundPoint.y * .5 + .5) * height, height * .35, height * .96);
    const footprint = Math.max(width * .2, Math.hypot((edgePoint.x - groundPoint.x) * width * .5, (edgePoint.y - groundPoint.y) * height * .5));
    // A subdued, softened reflection anchors the sculpture to its gallery floor.
    ctx!.save(); ctx!.beginPath(); ctx!.rect(0, groundY, width, height - groundY); ctx!.clip();
    ctx!.globalAlpha = .16; ctx!.translate(0, groundY * 1.38); ctx!.scale(1, -.38);
    ctx!.drawImage(layer, 0, 0, width, height); ctx!.restore();
    const fade = ctx!.createLinearGradient(0, groundY, 0, Math.min(height, groundY + height * .3));
    fade.addColorStop(0, "rgba(16,15,24,0)"); fade.addColorStop(1, "rgba(16,15,24,.92)");
    ctx!.fillStyle = fade; ctx!.fillRect(0, groundY, width, height - groundY);
    ctx!.save(); ctx!.translate(groundX, groundY + 5); ctx!.scale(1, .24);
    const shadow = ctx!.createRadialGradient(0, 0, footprint * .08, 0, 0, footprint * 1.03);
    shadow.addColorStop(0, "rgba(0,0,0,.5)"); shadow.addColorStop(1, "rgba(0,0,0,0)");
    ctx!.fillStyle = shadow; ctx!.fillRect(-footprint * 1.1, -footprint * 1.1, footprint * 2.2, footprint * 2.2); ctx!.restore();
    ctx!.drawImage(layer, 0, 0, width, height);
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true; caches.clear(); queue.length = 0; canvas.remove();
    canvas.width = canvas.height = layer.width = layer.height = backdrop.width = backdrop.height = 1;
    pixels = paint!.createImageData(1, 1); depthBuffer = new Float32Array(1);
  };
  setSize(Math.max(1, host.clientWidth), Math.max(1, host.clientHeight), Math.min(window.devicePixelRatio || 1, 1.5));
  return { domElement: canvas, setSize, render, dispose };
}
