import { Element, ModalGrid, Mesh, World } from "./types.js";
import { clamp } from "./random.js";
const ELEMENTS: Element[] = ["water", "fire", "earth", "air"];

export function transmuteToHeightfield(grid: ModalGrid): Float32Array {
  const result = new Float32Array(grid.width * grid.height);
  for (let i = 0; i < result.length; i++) {
    result[i] = clamp(grid.channels.earth[i] * 0.65 + grid.channels.fire[i] * 0.3 + grid.channels.air[i] * 0.1 - grid.channels.water[i] * 0.45);
  }
  return result;
}

export function build3DWorld(grid: ModalGrid, heightfield: Float32Array, mesh: Mesh, provenance: World["provenance"]): World {
  const materials = new Uint8Array(heightfield.length);
  for (let i = 0; i < materials.length; i++) {
    let best: Element = "earth";
    for (const element of ELEMENTS) if (grid.channels[element][i] > grid.channels[best][i]) best = element;
    materials[i] = ELEMENTS.indexOf(best);
  }
  return { provenance, grid, heightfield, materials, mesh };
}
