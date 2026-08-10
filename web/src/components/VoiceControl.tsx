import { Mic, Volume2 } from "lucide-react";
import { PHASE_CAPTION } from "@/data/demoScenario";
import { Phase } from "@/types";

interface VoiceControlProps {
  phase: Phase;
  busy: boolean;
  isRecording: boolean;
  onClick: () => void;
}

// The mic button's own label differs from the pipeline caption for a few
// phases, but when recording it should stay live until stopped.
const LABEL_OVERRIDES: Partial<Record<Phase, string>> = {
  idle: "Start Troubleshooting",
  complete: "Session complete",
};

export default function VoiceControl({ phase, busy, isRecording, onClick }: VoiceControlProps) {
  const buttonLabel = busy ? "Copilot responding…" : isRecording ? "Stop mic" : LABEL_OVERRIDES[phase] ?? PHASE_CAPTION[phase];
  const statusText = isRecording
    ? phase === "waiting_for_input"
      ? "Listening for the next question…"
      : "Listening to technician…"
    : "";
  const disabled = phase === "complete" && !isRecording;

  return (
    <div className="tc-control">
      <button
        className={`tc-mic-btn ${isRecording ? "tc-mic-live" : ""} ${busy ? "tc-mic-busy" : ""}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={buttonLabel}
      >
        <Mic size={22} />
      </button>
      <div className="tc-mic-label">{buttonLabel}</div>
      {statusText ? <div className="tc-mic-status">{statusText}</div> : null}
      {!isRecording && phase === "idle" && (
        <div className="tc-mic-hint">Voice-first · hands-free troubleshooting</div>
      )}
    </div>
  );
}
