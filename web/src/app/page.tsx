"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import EquipmentCard from "@/components/EquipmentCard";
import PipelineStatus from "@/components/PipelineStatus";
import ConversationPanel from "@/components/ConversationPanel";
import RetrievalPanel from "@/components/RetrievalPanel";
import SessionSummary from "@/components/SessionSummary";
import MachineHistoryDrawer from "@/components/MachineHistoryDrawer";
import Toast from "@/components/Toast";
import { useDemoEngine } from "@/lib/demoEngine";

export default function Page() {
  const engine = useDemoEngine();
  const { phase, start, advance, reset, messages, evidence, evidenceNote, busy, currentTurn } = engine;
  const [isRecording, setIsRecording] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!isRecording || phase !== "idle") return;
    const delay = setTimeout(() => {
      start();
    }, 3500);
    return () => clearTimeout(delay);
  }, [isRecording, phase, start]);

  // Auto-advance to the next turn shortly after the copilot reply finishes.
  useEffect(() => {
    let timer: any = null;
    if (isRecording && phase === "waiting_for_input" && !busy && messages.length > 0) {
      console.log('[auto:web] scheduling advance in 4000ms');
      timer = setTimeout(() => {
        console.log('[auto:web] advancing now');
        advance();
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRecording, phase, busy, messages.length, advance]);

  const handleMicClick = () => {
    if (isRecording) {
      setIsRecording(false);
      engine.stop();
      return;
    }

    if (phase === "complete") {
      return;
    }

    setIsRecording(true);
  };

  const handleReset = () => {
    engine.reset();
    setHistoryOpen(false);
  };

  const handleLogObservation = () => setToast("Observation logged ✓");

  return (
    <div className="tc-shell">
      <TopBar onOpenHistory={() => setHistoryOpen(true)} onReset={handleReset} />

      <EquipmentCard phase={engine.phase} />

      <PipelineStatus phase={engine.phase} />

      <div className="tc-main">
        <ConversationPanel
          phase={engine.phase}
          messages={engine.messages}
          busy={engine.busy}
          isRecording={isRecording}
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
        highlight={currentTurn ? currentTurn.highlight : null}
      />
      
      <Toast message={toast} />
    </div>
  );
}
