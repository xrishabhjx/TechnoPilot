"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import VoiceControl from "./VoiceControl";
import { Phase, TranscriptMessage } from "@/types";
import { PHASE_CAPTION, TAGLINE } from "@/data/demoScenario";

interface ConversationPanelProps {
  phase: Phase;
  messages: TranscriptMessage[];
  busy: boolean;
  onMicClick: () => void;
}

function LiveStatusRow({ phase }: { phase: Phase }) {
  if (phase === "idle" || phase === "waiting_for_input" || phase === "complete") {
    return null;
  }
  return (
    <div className="tc-live-row">
      <div className="tc-live-icon">
        <span className="tc-wave-bar" />
        <span className="tc-wave-bar" />
        <span className="tc-wave-bar" />
      </div>
      <span className="tc-live-text">{PHASE_CAPTION[phase]}</span>
    </div>
  );
}

export default function ConversationPanel({
  phase,
  messages,
  busy,
  onMicClick,
}: ConversationPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, phase]);

  return (
    <div className="tc-panel">
      <div className="tc-panel-head">
        <span className="tc-panel-title">CONVERSATION</span>
        <span className="tc-equip-meta">
          Synthetic Pump A17 data · Prototype demonstration
        </span>
      </div>
      <div className="tc-transcript" ref={scrollRef}>
        {messages.length === 0 && <div className="tc-empty">{TAGLINE} Press Start Troubleshooting to begin the demo scenario.</div>}
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} />
        ))}
        <LiveStatusRow phase={phase} />
      </div>
      <VoiceControl phase={phase} busy={busy} onClick={onMicClick} />
    </div>
  );
}
