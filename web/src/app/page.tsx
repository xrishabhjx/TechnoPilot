"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import EquipmentCard from "@/components/EquipmentCard";
import PipelineStatus from "@/components/PipelineStatus";
import ConversationPanel from "@/components/ConversationPanel";
import RetrievalPanel from "@/components/RetrievalPanel";
import SessionSummary from "@/components/SessionSummary";
import MachineHistoryDrawer from "@/components/MachineHistoryDrawer";
import ArchitectureModal from "@/components/ArchitectureModal";
import Toast from "@/components/Toast";
import { useDemoEngine } from "@/lib/demoEngine";

export default function Page() {
  const engine = useDemoEngine();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [archOpen, setArchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleMicClick = () => {
    if (engine.phase === "idle") engine.start();
    else if (engine.phase === "waiting_for_input") engine.advance();
  };

  const handleReset = () => {
    engine.reset();
    setHistoryOpen(false);
    setArchOpen(false);
  };

  const handleLogObservation = () => setToast("Observation logged ✓");

  return (
    <div className="tc-shell">
      <TopBar
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenArchitecture={() => setArchOpen(true)}
        onReset={handleReset}
      />

      <EquipmentCard phase={engine.phase} />

      <PipelineStatus phase={engine.phase} />

      <div className="tc-main">
        <ConversationPanel
          phase={engine.phase}
          messages={engine.messages}
          busy={engine.busy}
          onMicClick={handleMicClick}
        />
        <RetrievalPanel
          phase={engine.phase}
          evidence={engine.evidence}
          evidenceNote={engine.evidenceNote}
          hasMessages={engine.messages.length > 0}
          onLogObservation={handleLogObservation}
        />
      </div>

      {engine.phase === "complete" && <SessionSummary />}

      <MachineHistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        highlight={engine.currentTurn ? engine.currentTurn.highlight : null}
      />
      <ArchitectureModal open={archOpen} onClose={() => setArchOpen(false)} />
      <Toast message={toast} />
    </div>
  );
}
