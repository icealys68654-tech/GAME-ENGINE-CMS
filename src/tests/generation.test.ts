import assert from "node:assert/strict";
import test from "node:test";
import { generateWorld } from "../index.js";
import { ContentArtifact } from "../types.js";

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
