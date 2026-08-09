import { CheckCircle2, ClipboardCheck } from "lucide-react";
import { SourceCard, SourceCardSkeleton } from "./SourceCard";
import { EvidenceDoc, Phase } from "@/types";

interface RetrievalPanelProps {
  phase: Phase;
  evidence: EvidenceDoc[];
  evidenceNote: string | null;
  hasMessages: boolean;
  onLogObservation: () => void;
}

export default function RetrievalPanel({
  phase,
  evidence,
  evidenceNote,
  hasMessages,
  onLogObservation,
}: RetrievalPanelProps) {
  const showSkeleton = phase === "retrieving" && evidence.length === 0;
  const showEmpty = evidence.length === 0 && phase !== "retrieving";

  return (
    <div className="tc-panel">
      <div className="tc-panel-head">
        <span className="tc-panel-title">RETRIEVED EVIDENCE</span>
      </div>
      {evidenceNote && (
        <div className="tc-evidence-note">
          <CheckCircle2 size={12} /> {evidenceNote}
        </div>
      )}
      <div className="tc-evidence-list">
        {showSkeleton && <SourceCardSkeleton />}
        {showEmpty && (
          <div className="tc-evidence-empty">
            No evidence retrieved yet. Sources appear here as the copilot
            searches manuals, specifications, and service history.
          </div>
        )}
        {evidence.map((doc, i) => (
          <SourceCard doc={doc} index={i} key={doc.id} />
        ))}
      </div>
      <div className="tc-evidence-foot">
        <button className="tc-log-btn" onClick={onLogObservation} disabled={!hasMessages}>
          <ClipboardCheck size={13} /> Log observation
        </button>
      </div>
    </div>
  );
}
