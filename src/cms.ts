import { ContentArtifact } from "./types.js";

export class InMemoryContentStore {
  private readonly artifacts = new Map<string, ContentArtifact>();
  add(artifact: ContentArtifact): ContentArtifact { this.artifacts.set(artifact.id, artifact); return artifact; }
  query(query = ""): ContentArtifact[] {
    const q = query.toLowerCase();
    return [...this.artifacts.values()].filter(a => !q || `${a.title} ${a.body} ${a.tags.join(" ")}`.toLowerCase().includes(q));
  }
}
