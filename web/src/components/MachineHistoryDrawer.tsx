import { X } from "lucide-react";
import { HISTORY_EVENTS } from "@/data/pumpA17";

interface MachineHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  highlight: string | null;
}

export default function MachineHistoryDrawer({
  open,
  onClose,
  highlight,
}: MachineHistoryDrawerProps) {
  return (
    <>
      <div className={`tc-backdrop ${open ? "tc-backdrop-show" : ""}`} onClick={onClose} />
      <div
        className={`tc-drawer ${open ? "tc-drawer-open" : ""}`}
        role="dialog"
        aria-label="Machine history"
      >
        <div className="tc-drawer-head">
          <div>
            <div className="tc-drawer-eyebrow">PUMP-A17</div>
            <div className="tc-drawer-title">Machine history</div>
          </div>
          <button className="tc-icon-btn" onClick={onClose} aria-label="Close machine history">
            <X size={16} />
          </button>
        </div>
        <div className="tc-drawer-body">
          {HISTORY_EVENTS.map((ev) => (
            <div
              key={ev.date}
              className={`tc-history-row ${
                highlight === ev.key ? "tc-history-row-active" : ""
              }`}
            >
              <div className="tc-history-date">{ev.date}</div>
              <div className="tc-history-main">
                <div className="tc-history-issue">{ev.issue}</div>
                <div className="tc-history-meta">
                  <span>Diagnosis: {ev.diagnosis}</span>
                  <span>Resolution: {ev.resolution}</span>
                  <span>Component: {ev.component}</span>
                </div>
              </div>
              {highlight === ev.key && <span className="tc-history-tag">Referenced</span>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
