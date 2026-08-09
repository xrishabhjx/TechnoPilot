import { DemoTurn, Phase } from "@/types";

export const TURNS: DemoTurn[] = [
  {
    id: 1,
    technician:
      "Pump A17 is vibrating heavily and the temperature is 88 degrees.",
    evidence: ["manual", "svc17", "specs"],
    note: null,
    assistant:
      "I found two previous incidents with similar symptoms. The most recent involved bearing degradation. The current temperature is also above the recommended operating range.",
    highlight: "bearing",
  },
  {
    id: 2,
    technician: "The bearing temperature is actually 94 degrees.",
    evidence: ["specs", "svc17", "history"],
    note: "Machine history recalled",
    assistant:
      "94 degrees is significantly above the normal operating range. Given the previous bearing issue, I recommend checking the bearing housing next.",
    highlight: "bearing",
  },
  {
    id: 3,
    technician: "No, the pump is already powered down.",
    evidence: ["troubleshoot"],
    note: "Correction acknowledged — restart step skipped",
    assistant:
      "Understood. Since it's already powered down, we'll skip that step. Let's check the bearing housing instead.",
    highlight: null,
  },
];

// Stage durations in ms — see PRD section 18 (Timing)
export const TIMING: Record<
  "listening" | "transcribing" | "retrieving" | "reasoning",
  number
> = {
  listening: 1300,
  transcribing: 700,
  retrieving: 1500,
  reasoning: 1000,
};

export const PHASE_CAPTION: Record<Phase, string> = {
  idle: "Ready — press Start Troubleshooting",
  listening: "Listening to technician…",
  transcribing: "Transcribing technician input…",
  retrieving: "Searching technical knowledge…",
  reasoning: "Analyzing retrieved evidence…",
  speaking: "Copilot is responding…",
  waiting_for_input: "Awaiting next technician input…",
  complete: "Session complete",
};

export const TAGLINE =
  "Keep your hands on the machine. Let the copilot find the answer.";
