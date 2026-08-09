export type Phase =
  | 'idle'
  | 'listening'
  | 'transcribing'
  | 'retrieving'
  | 'reasoning'
  | 'speaking'
  | 'waiting_for_input'
  | 'complete';

export interface DemoTurn {
  id: number;
  technician: string;
  evidence: string[];
  note: string | null;
  assistant: string;
  highlight: string | null;
}

export const TURNS: DemoTurn[] = [
  {
    id: 1,
    technician: 'Pump A17 is vibrating heavily and the temperature is 88 degrees.',
    evidence: ['manual', 'svc17', 'specs'],
    note: null,
    assistant:
      'I found two previous incidents with similar symptoms. The most recent involved bearing degradation. The current temperature is also above the recommended operating range.',
    highlight: 'bearing',
  },
  {
    id: 2,
    technician: 'The bearing temperature is actually 94 degrees.',
    evidence: ['specs', 'svc17', 'history'],
    note: 'Machine history recalled',
    assistant:
      '94 degrees is significantly above the normal operating range. Given the previous bearing issue, I recommend checking the bearing housing next.',
    highlight: 'bearing',
  },
  {
    id: 3,
    technician: 'No, the pump is already powered down.',
    evidence: ['troubleshoot'],
    note: 'Correction acknowledged — restart step skipped',
    assistant:
      'Understood. Since it\'s already powered down, we\'ll skip that step. Let\'s check the bearing housing instead.',
    highlight: null,
  },
];

export const PHASE_CAPTION: Record<Phase, string> = {
  idle: 'Ready — press Start Troubleshooting',
  listening: 'Listening to technician…',
  transcribing: 'Transcribing technician input…',
  retrieving: 'Searching technical knowledge…',
  reasoning: 'Analyzing retrieved evidence…',
  speaking: 'Copilot is responding…',
  waiting_for_input: 'Awaiting next technician input…',
  complete: 'Session complete',
};
