export type DocType =
  | "Manual"
  | "Specification"
  | "Service Report"
  | "Machine History"
  | "Troubleshooting Guide";

export interface EvidenceDoc {
  id: string;
  title: string;
  type: DocType;
  excerpt: string;
  date: string | null;
}

export interface HistoryEvent {
  date: string;
  issue: string;
  diagnosis: string;
  resolution: string;
  component: string;
  key: string;
}

export interface DemoTurn {
  id: number;
  technician: string;
  evidence: string[];
  note: string | null;
  assistant: string;
  highlight: string | null;
}

export type Phase =
  | "idle"
  | "listening"
  | "transcribing"
  | "retrieving"
  | "reasoning"
  | "speaking"
  | "waiting_for_input"
  | "complete";

export interface TranscriptMessage {
  role: "technician" | "copilot";
  text: string;
}

export type PipelineNodeName = "STT" | "AGENT" | "QDRANT" | "RIME";
export type PipelineNodeState = "pending" | "active" | "done";
