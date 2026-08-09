import { Mic, Radio } from "lucide-react";
import { TranscriptMessage } from "@/types";

export default function MessageBubble({ role, text }: TranscriptMessage) {
  const isTech = role === "technician";
  return (
    <div className={`tc-msg ${isTech ? "tc-msg-tech" : "tc-msg-copilot"}`}>
      <div className="tc-msg-icon">
        {isTech ? <Mic size={13} /> : <Radio size={13} />}
      </div>
      <div className="tc-msg-body">
        <div className="tc-msg-label">
          {isTech ? "TECHNICIAN" : "TECHNICIAN COPILOT"}
        </div>
        <div className="tc-msg-text">{text}</div>
      </div>
    </div>
  );
}
