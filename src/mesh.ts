import { EvidenceContext, Mesh } from "./types.js";
import { SeededRandom } from "./random.js";

export class MeshGeneratorAgent {
  constructor(private readonly seed: string) {}
  compose(context: EvidenceContext, size = 12): Mesh {
    const random = new SeededRandom(`${this.seed}:mesh`);
    const vertices: number[] = [];
    const indices: number[] = [];
    for (let z = 0; z <= size; z++) for (let x = 0; x <= size; x++) {
      const signal = context.signals.earth + context.signals.fire;
      const y = (Math.sin(x * 0.8 + context.features[0]) + Math.cos(z * 0.6)) * signal * 2 + random.range(-0.08, 0.08);
      vertices.push(x / size, y, z / size);
    }
    for (let z = 0; z < size; z++) for (let x = 0; x < size; x++) {
      const a = z * (size + 1) + x, b = a + 1, c = a + size + 1, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
    return { vertices, indices, width: size + 1, depth: size + 1 };
  }
}
