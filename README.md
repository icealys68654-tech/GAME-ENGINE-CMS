# Game Engine CMS

A deterministic content-management and world-generation engine based on the **Prismatic Emergence** design. CMS artifacts are gathered as evidence, transformed into a seeded elemental field, and exposed as a renderer-independent 3D world.

## Pipeline

```text
CMS artifact -> FilterPipeline -> AIAgentGatherer -> MeshGeneratorAgent
             -> ModalGridAgent (64x64) -> height/material fields -> world
```

The implementation is intentionally dependency-free. The core can run on Node, in a worker, or behind a browser adapter. Rendering is represented by an ABI so WebGL, OpenGL, and Vulkan adapters can be added without changing generation.

## Usage

```ts
import { generateWorld, InMemoryContentStore } from "./src/index.js";

const store = new InMemoryContentStore();
const artifact = store.add({
  id: "crystal-01",
  title: "Crystal Basin",
  body: "A warm volcanic basin surrounded by clear water and high stone ridges.",
  tags: ["volcanic", "water", "crystal"],
  metadata: { biome: "basin" }
});

const world = generateWorld(artifact, "question-42");
console.log(world.provenance, world.heightfield.length);
```

`generateWorld(artifact, seed)` is deterministic. `generatedAt` is provenance only and is never read by the generator.

## Contracts

Every generated world includes:

- `sourceArtifact`
- `seed`
- `algorithmVersion`
- `gridResolution`
- `generatedAt`
- `generator`

Run `npm test` to verify same-seed reproducibility and different-seed divergence.
