import { EQUIPMENT } from "@/data/pumpA17";
import { Phase } from "@/types";

function StatusDot({ state }: { state: "active" | "pending" }) {
  return <span className={`tc-dot tc-dot-${state}`} />;
}

interface EquipmentCardProps {
  phase: Phase;
}

export default function EquipmentCard({ phase }: EquipmentCardProps) {
  const sessionActive = phase !== "idle";
  return (
    <div className="tc-equip">
      <div className="tc-equip-left">
        <div>
          <div className="tc-equip-name">{EQUIPMENT.name}</div>
          <div className="tc-equip-type">{EQUIPMENT.type}</div>
        </div>
        <div className="tc-equip-badges">
          <span className="tc-mode-pill">{EQUIPMENT.mode}</span>
          <span className="tc-equip-meta">Last service: {EQUIPMENT.lastService}</span>
        </div>
      </div>
      <div className="tc-status">
        <StatusDot state={sessionActive ? "active" : "pending"} />
        {sessionActive ? "Session active" : "Session ready"}
      </div>
    </div>
  );
}
