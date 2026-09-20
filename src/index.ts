import { ContentArtifact, World } from "./types.js";
import { AIAgentGatherer } from "./gatherer.js";
import { MeshGeneratorAgent } from "./mesh.js";
import { ModalGridAgent } from "./grid.js";
import { build3DWorld, transmuteToHeightfield } from "./world.js";

export const ALGORITHM_VERSION = "1";
export function generateWorld(artifact: ContentArtifact, seed: string, generatedAt = new Date().toISOString()): World {
  const gatherer = new AIAgentGatherer(seed);
  const context = gatherer.gather(artifact);
  const mesh = new MeshGeneratorAgent(seed).compose(context);
  const grid = new ModalGridAgent(seed).classify(mesh, context, [64, 64]);
  const heightfield = transmuteToHeightfield(grid);
  return build3DWorld(grid, heightfield, mesh, {
    source_artifact: artifact.id,
    seed,
    algorithm_version: ALGORITHM_VERSION,
    grid_resolution: "64x64",
    generated_at: generatedAt,
    generator: "Transmutation World"
  });
}

export { InMemoryContentStore } from "./cms.js";
export * from "./types.js";
export { AIAgentGatherer } from "./gatherer.js";
export { MeshGeneratorAgent } from "./mesh.js";
export { ModalGridAgent } from "./grid.js";
export * from "./render.js";
