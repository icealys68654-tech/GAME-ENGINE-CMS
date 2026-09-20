import assert from "node:assert/strict";
import test from "node:test";
import { createRenderPacket, generateWorld } from "../index.js";
import { ContentArtifact, World } from "../types.js";

const artifact: ContentArtifact = { id: "a", title: "Volcanic basin", body: "Water surrounds warm crystal stone.", tags: ["volcanic"], metadata: {} };

 test("same seed produces the same world", () => {
  const a = generateWorld(artifact, "alpha", "2026-01-01T00:00:00.000Z");
  const b = generateWorld(artifact, "alpha", "2099-01-01T00:00:00.000Z");
  assert.deepEqual([...a.heightfield], [...b.heightfield]);
  assert.deepEqual([...a.materials], [...b.materials]);
  assert.equal(a.provenance.generated_at, "2026-01-01T00:00:00.000Z");
  assert.equal(b.provenance.generated_at, "2099-01-01T00:00:00.000Z");
});

test("different seeds produce different fields", () => {
  const a = generateWorld(artifact, "alpha");
  const b = generateWorld(artifact, "beta");
  assert.notDeepEqual([...a.heightfield], [...b.heightfield]);
});

test("world has the required 64 by 64 elemental grid", () => {
  const world = generateWorld(artifact, "grid");
  assert.equal(world.grid.width, 64);
  assert.equal(world.grid.height, 64);
  for (const field of Object.values(world.grid.channels)) assert.equal(field.length, 4096);
});

test("render packet preserves world data in typed buffers", () => {
  const world = generateWorld(artifact, "render", "2026-01-01T00:00:00.000Z");
  const packet = createRenderPacket(world);

  assert.ok(packet.positions instanceof Float32Array);
  assert.ok(packet.indices instanceof Uint32Array);
  assert.ok(packet.materials instanceof Uint8Array);
  assert.equal(packet.positions.length, world.mesh.vertices.length);
  assert.equal(packet.indices.length, world.mesh.indices.length);
  assert.deepEqual([...packet.materials], [...world.materials]);
  assert.equal(packet.width, world.mesh.width);
  assert.equal(packet.depth, world.mesh.depth);
  assert.deepEqual(packet.provenance, world.provenance);

  packet.positions[0] = packet.positions[0] + 1;
  packet.materials[0] = packet.materials[0] + 1;
  assert.notEqual(packet.positions[0], world.mesh.vertices[0]);
  assert.notEqual(packet.materials[0], world.materials[0]);
});

test("render packet rejects incomplete vertex triplets", () => {
  const world = generateWorld(artifact, "invalid-render");
  const invalidWorld: World = {
    ...world,
    mesh: { ...world.mesh, vertices: [...world.mesh.vertices, 1] }
  };

  assert.throws(() => createRenderPacket(invalidWorld), /complete XYZ triplets/);
});
