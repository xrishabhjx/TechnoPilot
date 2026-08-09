import { Mic, Volume2 } from "lucide-react";
import { PHASE_CAPTION } from "@/data/demoScenario";
import { Phase } from "@/types";

interface VoiceControlProps {
  phase: Phase;
  busy: boolean;
  onClick: () => void;
}

// The mic button's own label differs from the pipeline caption for a few
// phases (it speaks to "what do I do next", not "what's happening now").
const LABEL_OVERRIDES: Partial<Record<Phase, string>> = {
  idle: "Start Troubleshooting",
  waiting_for_input: "Tap to report next reading",
  complete: "Session complete",
};

export default function VoiceControl({ phase, busy, onClick }: VoiceControlProps) {
  const label = LABEL_OVERRIDES[phase] ?? PHASE_CAPTION[phase];
  const disabled = busy || phase === "complete";

  return (
    <div className="tc-control">
      <button
        className={`tc-mic-btn ${phase === "listening" ? "tc-mic-live" : ""}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
      >
        {phase === "speaking" ? <Volume2 size={22} /> : <Mic size={22} />}
      </button>
      <div className="tc-mic-label">{label}</div>
      {phase === "idle" && (
        <div className="tc-mic-hint">Voice-first · hands-free troubleshooting</div>
      )}
    </div>
  );
}
