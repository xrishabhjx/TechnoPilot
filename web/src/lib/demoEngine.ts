"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DOCS } from "@/data/pumpA17";
import { TIMING, TURNS } from "@/data/demoScenario";
import { EvidenceDoc, Phase, TranscriptMessage } from "@/types";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface DemoEngineState {
  phase: Phase;
  messages: TranscriptMessage[];
  evidence: EvidenceDoc[];
  evidenceNote: string | null;
  turnIndex: number;
  busy: boolean;
}

export interface DemoEngine extends DemoEngineState {
  start: () => void;
  advance: () => void;
  reset: () => void;
  currentTurn: (typeof TURNS)[number] | null;
}

/**
 * Deterministic, replayable state machine for the Technician Copilot demo.
 *
 * idle -> listening -> transcribing -> retrieving -> reasoning -> speaking
 *   -> waiting_for_input -> (repeat) -> complete
 *
 * No network calls. All retrieval/voice behavior is simulated with local
 * data and fixed delays so the demo is safe to record and replay.
 */
export function useDemoEngine(): DemoEngine {
  const [phase, setPhase] = useState<Phase>("idle");
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [evidence, setEvidence] = useState<EvidenceDoc[]>([]);
  const [evidenceNote, setEvidenceNote] = useState<string | null>(null);
  const [turnIndex, setTurnIndex] = useState(-1);
  const [busy, setBusy] = useState(false);

  // Guards against overlapping playback if the component re-renders mid-turn.
  const runIdRef = useRef(0);

  const playTurn = useCallback(async (idx: number) => {
    const runId = ++runIdRef.current;
    const turn = TURNS[idx];
    const stillCurrent = () => runIdRef.current === runId;

    setBusy(true);

    setPhase("listening");
    await sleep(TIMING.listening);
    if (!stillCurrent()) return;

    setPhase("transcribing");
    await sleep(TIMING.transcribing);
    if (!stillCurrent()) return;
    setMessages((m) => [...m, { role: "technician", text: turn.technician }]);

    setPhase("retrieving");
    setEvidence([]);
    setEvidenceNote(null);
    await sleep(TIMING.retrieving);
    if (!stillCurrent()) return;
    setEvidence(turn.evidence.map((id) => DOCS[id]));
    if (turn.note) setEvidenceNote(turn.note);

    setPhase("reasoning");
    await sleep(TIMING.reasoning);
    if (!stillCurrent()) return;

    setPhase("speaking");
    const speakMs = Math.min(4000, Math.max(2000, turn.assistant.length * 28));
    await sleep(speakMs);
    if (!stillCurrent()) return;
    setMessages((m) => [...m, { role: "copilot", text: turn.assistant }]);
    setTurnIndex(idx);

    setPhase(idx === TURNS.length - 1 ? "complete" : "waiting_for_input");
    setBusy(false);
  }, []);

  const start = useCallback(() => {
    if (phase !== "idle" || busy) return;
    playTurn(0);
  }, [phase, busy, playTurn]);

  const advance = useCallback(() => {
    if (busy) return;
    if (turnIndex >= TURNS.length - 1) return;
    playTurn(turnIndex + 1);
  }, [busy, turnIndex, playTurn]);

  const reset = useCallback(() => {
    runIdRef.current += 1; // invalidate any in-flight playTurn
    setPhase("idle");
    setMessages([]);
    setEvidence([]);
    setEvidenceNote(null);
    setTurnIndex(-1);
    setBusy(false);
  }, []);

  // Safety net: if the tab is hidden mid-animation there's nothing to clean
  // up (timeouts are cheap), but this keeps the hook's surface area obvious
  // for future extension (e.g. cancel on unmount).
  useEffect(() => {
    return () => {
      runIdRef.current += 1;
    };
  }, []);

  return {
    phase,
    messages,
    evidence,
    evidenceNote,
    turnIndex,
    busy,
    start,
    advance,
    reset,
    currentTurn: turnIndex >= 0 ? TURNS[turnIndex] : null,
  };
}
