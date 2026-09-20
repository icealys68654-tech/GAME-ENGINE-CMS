import { EvidenceContext, Element, Mesh, ModalGrid } from "./types.js";
import { clamp, SeededRandom } from "./random.js";
const ELEMENTS: Element[] = ["water", "fire", "earth", "air"];

export class ModalGridAgent {
  constructor(private readonly seed: string) {}
  classify(mesh: Mesh, context: EvidenceContext, resolution: [number, number] = [64, 64]): ModalGrid {
    const [width, height] = resolution;
    const channels = Object.fromEntries(ELEMENTS.map(e => [e, new Float32Array(width * height)])) as Record<Element, Float32Array>;
    const random = new SeededRandom(`${this.seed}:grid`);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const nx = x / (width - 1), ny = y / (height - 1);
      const ridge = Math.abs(Math.sin(nx * 9 + context.features[1]) * Math.cos(ny * 7));
      channels.water[i] = clamp(context.signals.water * 12 + (1 - ny) * 0.28 + random.next() * 0.08);
      channels.fire[i] = clamp(context.signals.fire * 12 + ridge * 0.35);
      channels.earth[i] = clamp(context.signals.earth * 12 + ny * 0.32 + ridge * 0.2);
      channels.air[i] = clamp(context.signals.air * 12 + (1 - ridge) * 0.25);
    }
    return { width, height, channels };
  }
}
