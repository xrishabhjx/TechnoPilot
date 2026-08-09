import { PHASE_CAPTION } from "@/data/demoScenario";
import { nodeState, PIPELINE_NODES } from "@/lib/pipeline";
import { Phase } from "@/types";

interface PipelineStatusProps {
  phase: Phase;
}

export default function PipelineStatus({ phase }: PipelineStatusProps) {
  return (
    <div className="tc-pipeline">
      <div className="tc-pipeline-row">
        {PIPELINE_NODES.map((name, i) => {
          const state = nodeState(name, phase);
          return (
            <div key={name} style={{ display: "contents" }}>
              <div className={`tc-pipe-node tc-pipe-${state}`}>
                <span className="tc-pipe-ring" />
                <span className="tc-pipe-label">{name}</span>
              </div>
              {i < PIPELINE_NODES.length - 1 && (
                <div
                  className={`tc-pipe-connector ${
                    state === "done" || state === "active" ? "tc-pipe-connector-lit" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="tc-pipeline-caption">{PHASE_CAPTION[phase]}</div>
    </div>
  );
}
