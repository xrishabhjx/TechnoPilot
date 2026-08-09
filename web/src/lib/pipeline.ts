import { Phase, PipelineNodeName, PipelineNodeState } from "@/types";

const ACTIVE_DURING: Record<PipelineNodeName, Phase[]> = {
  STT: ["transcribing"],
  AGENT: ["retrieving", "reasoning"],
  QDRANT: ["retrieving"],
  RIME: ["speaking"],
};

const DONE_AFTER: Record<PipelineNodeName, Phase[]> = {
  STT: ["retrieving", "reasoning", "speaking", "waiting_for_input", "complete"],
  AGENT: ["speaking", "waiting_for_input", "complete"],
  QDRANT: ["reasoning", "speaking", "waiting_for_input", "complete"],
  RIME: ["waiting_for_input", "complete"],
};

/**
 * Maps the demo engine's current phase onto a visual state for each node in
 * the STT -> AGENT -> QDRANT -> RIME pipeline indicator.
 */
export function nodeState(name: PipelineNodeName, phase: Phase): PipelineNodeState {
  if (ACTIVE_DURING[name].includes(phase)) return "active";
  if (DONE_AFTER[name].includes(phase)) return "done";
  return "pending";
}

export const PIPELINE_NODES: PipelineNodeName[] = ["STT", "AGENT", "QDRANT", "RIME"];
