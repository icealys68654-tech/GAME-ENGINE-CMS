# Game Engine CMS

A deterministic content-management and world-generation engine based on the **Prismatic Emergence** design. CMS artifacts are gathered as evidence, transformed into a seeded elemental field, and exposed as reproducible world data for a rendering adapter.

## Status to completion

- **Implemented:** deterministic artifact storage, filtering/gathering, mesh generation, 64×64 modal grids, seeded world generation, provenance contracts, reproducibility tests, and a renderer-neutral output adapter.
- **CI workflow:** configured and green. GitHub Actions runs the real build and test commands on pushes to `main` and on pull requests.
- **Current best next step:** add a concrete browser or native rendering adapter behind the exported `RenderAdapter` contract.

The current verification gates are:

```text
npm run build
npm test
```

Latest CI workflow: https://github.com/icealys68654-tech/GAME-ENGINE-CMS/actions/workflows/ci.yml

## Pipeline

```text
CMS artifact -> FilterPipeline -> AIAgentGatherer -> MeshGeneratorAgent
             -> ModalGridAgent (64x64) -> height/material fields -> world
```

The implementation is intentionally dependency-free at runtime. The core can run on Node, in a worker, or behind a browser adapter. Rendering is represented by an ABI so WebGL, OpenGL, and Vulkan adapters can be added without changing generation logic.

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

## Development

```bash
npm install
npm run build
npm test
```

The test command compiles TypeScript and runs the compiled Node test files. GitHub Actions executes the same commands as the repository's CI gates.
