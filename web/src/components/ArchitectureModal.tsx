import { ArrowRight, X } from "lucide-react";

interface ArchitectureModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS = [
  "Technician Voice",
  "STT",
  "AI Agent",
  "Qdrant + Tools",
  "Grounded Response",
  "Rime",
  "Technician Voice",
];

export default function ArchitectureModal({ open, onClose }: ArchitectureModalProps) {
  if (!open) return null;
  return (
    <>
      <div className="tc-backdrop tc-backdrop-show" onClick={onClose} />
      <div className="tc-modal" role="dialog" aria-label="Architecture">
        <div className="tc-drawer-head">
          <div>
            <div className="tc-drawer-eyebrow">PROPOSED ARCHITECTURE</div>
            <div className="tc-drawer-title">How this will run in production</div>
          </div>
          <button className="tc-icon-btn" onClick={onClose} aria-label="Close architecture view">
            <X size={16} />
          </button>
        </div>
        <div className="tc-arch-flow">
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div className="tc-arch-node">{s}</div>
              {i < STEPS.length - 1 && <ArrowRight size={14} className="tc-arch-arrow" />}
            </div>
          ))}
        </div>
        <div className="tc-arch-note">
          Prototype uses mocked retrieval/voice layers; these components are
          planned for the hackathon implementation.
        </div>
      </div>
    </>
  );
}
