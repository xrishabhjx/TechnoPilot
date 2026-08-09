import { CheckCircle2 } from "lucide-react";

export default function SessionSummary() {
  return (
    <div className="tc-summary">
      <CheckCircle2 size={20} className="tc-summary-icon" />
      <div>
        <div className="tc-summary-title">Session summary</div>
        <div className="tc-summary-text">
          Three observations logged for Pump A17. Bearing degradation
          identified as the likely cause, corroborated by Service Report #17
          and the machine&apos;s maintenance history. Recommended next check:
          inspect the bearing housing for wear and confirm lubrication
          levels.
        </div>
      </div>
    </div>
  );
}
