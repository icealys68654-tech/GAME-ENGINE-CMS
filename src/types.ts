export type Element = "water" | "fire" | "earth" | "air";

export interface ContentArtifact {
  id: string;
  title: string;
  body: string;
  tags: string[];
  metadata: Record<string, string | number | boolean>;
}

export interface EvidenceContext {
  artifactId: string;
  tokens: string[];
  tags: string[];
  signals: Record<Element, number>;
  features: number[];
}

export interface Mesh {
  vertices: number[];
  indices: number[];
  width: number;
  depth: number;
}

export interface ModalGrid {
  width: number;
  height: number;
  channels: Record<Element, Float32Array>;
}

export interface Provenance {
  source_artifact: string;
  seed: string;
  algorithm_version: string;
  grid_resolution: string;
  generated_at: string;
  generator: "Transmutation World";
}

export interface World {
  provenance: Provenance;
  grid: ModalGrid;
  heightfield: Float32Array;
  materials: Uint8Array;
  mesh: Mesh;
}
