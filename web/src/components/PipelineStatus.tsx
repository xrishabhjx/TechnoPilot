import { PHASE_CAPTION } from "@/data/demoScenario";
import { Phase } from "@/types";

interface PipelineStatusProps {
  phase: Phase;
}

export default function PipelineStatus({ phase }: PipelineStatusProps) {
  return (
    <div className="tc-pipeline">
      <div className="tc-pipeline-caption">{PHASE_CAPTION[phase]}</div>
    </div>
  );
}
