import { ContentArtifact, EvidenceContext, Element } from "./types.js";
import { clamp, SeededRandom } from "./random.js";

const ELEMENTS: Element[] = ["water", "fire", "earth", "air"];
const WORD_SIGNALS: Record<Element, string[]> = {
  water: ["water", "river", "lake", "rain", "ice", "ocean", "clear"],
  fire: ["fire", "lava", "warm", "volcanic", "ember", "heat", "ash"],
  earth: ["earth", "stone", "rock", "mountain", "basin", "crystal", "soil"],
  air: ["air", "wind", "sky", "cloud", "high", "open", "breeze"]
};

/** Converts all source evidence into stable numeric signals; it never uses time. */
export class AIAgentGatherer {
  constructor(private readonly seed: string) {}
  gather(artifact: ContentArtifact): EvidenceContext {
    const tokens = `${artifact.title} ${artifact.body}`.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    const signals = {} as Record<Element, number>;
    for (const element of ELEMENTS) {
      const hits = WORD_SIGNALS[element].reduce((n, word) => n + tokens.filter(t => t === word).length, 0);
      signals[element] = hits / Math.max(1, tokens.length);
    }
    const random = new SeededRandom(`${this.seed}:evidence`);
    const features = Array.from({ length: 8 }, (_, i) => clamp(
      (tokens[i % Math.max(1, tokens.length)]?.length ?? 0) / 14 + random.next() * 0.15
    ));
    return { artifactId: artifact.id, tokens, tags: [...artifact.tags].sort(), signals, features };
  }
}
