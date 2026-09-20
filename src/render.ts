import { World } from "./types.js";

/** A renderer-neutral vertex/index packet suitable for browser or native adapters. */
export interface RenderPacket {
  positions: Float32Array;
  indices: Uint32Array;
  materials: Uint8Array;
  width: number;
  depth: number;
  provenance: World["provenance"];
}

/**
 * Converts generated world data into a stable rendering ABI.
 * Adapters can upload the returned typed arrays to WebGL, WebGPU, or another API.
 */
export function createRenderPacket(world: World): RenderPacket {
  if (world.mesh.vertices.length % 3 !== 0) {
    throw new Error("Mesh vertices must contain complete XYZ triplets");
  }

  const positions = Float32Array.from(world.mesh.vertices);
  const indices = Uint32Array.from(world.mesh.indices);
  const materials = new Uint8Array(world.materials);

  return {
    positions,
    indices,
    materials,
    width: world.mesh.width,
    depth: world.mesh.depth,
    provenance: world.provenance
  };
}

/** Minimal adapter contract for browser and native rendering integrations. */
export interface RenderAdapter<THandle = unknown> {
  upload(packet: RenderPacket): THandle;
  dispose(handle: THandle): void;
}
