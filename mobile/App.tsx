import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { PHASE_CAPTION } from './src/demoData';
import { useDemoEngine } from './src/demoEngine';
import { HISTORY_EVENTS } from './src/pumpA17';
import { DOCS, EQUIPMENT } from './src/pumpA17';
import MachineCard from './src/components/MachineCard';
import Transcript from './src/components/Transcript';
import EvidencePanel from './src/components/EvidencePanel';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const spokenRef = useRef<string | null>(null);
  const engine = useDemoEngine();
  const { phase, start, advance: engineAdvance, reset, busy } = engine;
  const caption = useMemo(
    () => {
      if (isRecording) {
        if (phase === 'complete') {
          return 'Session complete — press Stop mic to finish.';
        }
        return phase === 'waiting_for_input'
          ? 'Speak your next question, then press Stop mic.'
          : 'Listening to technician…';
      }
      return PHASE_CAPTION[phase];
    },
    [phase, isRecording]
  );

  const toggleRecording = () => {
    if (isRecording) {
      console.log('[mic] Stop requested — phase:', phase, 'busy:', busy);
      Speech.stop();
      setIsRecording(false);
      if (phase === 'waiting_for_input') {
        console.log('[mic] Advancing engine from turnIndex', engine.turnIndex);
        engineAdvance();
      }
      return;
    }

    if (phase === 'complete') {
      return;
    }

    setIsRecording(true);
  };

  useEffect(() => {
    console.log('[engine] phase=', phase, 'busy=', busy, 'messages=', engine.messages.length, 'turnIndex=', engine.turnIndex);
  }, [phase, busy, engine.messages.length, engine.turnIndex]);

  // Auto-advance to the next turn shortly after the copilot reply finishes.
  useEffect(() => {
    let timer: any = null;
    if (phase === 'waiting_for_input' && !busy && engine.messages.length > 0) {
      console.log('[auto] scheduling advance in 4000ms');
      timer = setTimeout(() => {
        console.log('[auto] advancing now');
        engineAdvance();
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, busy, engine.messages.length, engineAdvance]);

  useEffect(() => {
    if (!isRecording || phase !== 'idle') {
      return;
    }
    start();
  }, [isRecording, phase, start]);

  useEffect(() => {
    const lastMessage = engine.messages[engine.messages.length - 1];
    console.log('[speech] engine.messages changed, last=', lastMessage);
    if (!lastMessage || lastMessage.role !== 'copilot' || lastMessage.text === spokenRef.current) {
      return;
    }

    spokenRef.current = lastMessage.text;
    console.log('[speech] speaking:', lastMessage.text.slice(0, 80));
    Speech.stop();
    Speech.speak(lastMessage.text, {
      pitch: 1,
      rate: 0.95,
    });
  }, [engine.messages]);

  useEffect(() => {
    if (phase === 'speaking' && isRecording) {
      Speech.stop();
      setIsRecording(false);
    }
  }, [phase, isRecording]);

  const [showEvidence, setShowEvidence] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Removed auto-resume: the user must explicitly start the mic for the next question.

  return (
    <>
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brand}>TECHNICIAN COPILOT</Text>
            <Text style={styles.title}>Pump A17</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowHistory(true)}>
            <Text style={styles.iconButtonText}>History</Text>
          </TouchableOpacity>
        </View>

        <MachineCard equipment={EQUIPMENT} />

        <View style={styles.cardInline}>
          <Text style={styles.cardTitleSmall}>Session</Text>
          <View style={styles.recordingRow}>
            <View style={[styles.recordingDot, isRecording && styles.recordingDotActive]} />
            <Text style={styles.cardTextSmall}>{caption}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conversation</Text>
          <TouchableOpacity style={styles.link} onPress={() => setShowEvidence((v) => !v)}>
            <Text style={styles.linkText}>{showEvidence ? 'Hide evidence' : 'Show evidence'}</Text>
          </TouchableOpacity>

          {showEvidence && <EvidencePanel evidence={engine.evidence} />}

          {/* Messages rendered inside the Conversation card */}
          {engine.messages.length === 0 ? (
            <Text style={styles.cardText}>No messages yet — start the session.</Text>
          ) : (
            <Transcript messages={engine.messages} />
          )}
        </View>

        {engine.messages.length > 0 && (
          <View style={styles.cardInline}>
            <Text style={styles.cardTitleSmall}>Next step</Text>
            <Text style={styles.cardTextSmall}>Inspect the bearing housing and confirm the temperature trend before restarting the pump.</Text>
          </View>
        )}

        <View style={styles.actionsRowSmall}>
          <TouchableOpacity
            accessibilityLabel="Toggle mic recording"
            style={[
              styles.primaryButton,
              !busy && isRecording && styles.primaryButtonRecording,
              busy && styles.primaryButtonBusy,
            ]}
            onPress={toggleRecording}
            activeOpacity={0.9}
            disabled={busy}
          >
            <Text style={[styles.primaryButtonText, busy && styles.primaryButtonTextBusy]}>{busy ? 'Copilot responding…' : isRecording ? 'Stop mic' : 'Start mic'}</Text>
          </TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Reset session" style={styles.smallButton} onPress={() => { Speech.stop(); reset(); setIsRecording(false); }}>
            <Text style={styles.smallButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.helperText}>
          {isRecording
            ? 'Mic is live: keep speaking while it listens and answers. Press Stop mic when you want to end the session.'
            : 'Press Start mic to open the conversation, then keep talking until you press Stop mic.'}
        </Text>

        {/* debug panel removed */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </View>

    <Modal visible={showHistory} animationType="slide" onRequestClose={() => setShowHistory(false)}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Maintenance History</Text>
        {HISTORY_EVENTS.map((item) => (
          <View key={item.date} style={styles.historyRow}>
            <Text style={styles.historyDate}>{item.date}</Text>
            <Text style={styles.historyIssue}>{item.issue}</Text>
            <Text style={styles.historyDetail}>{item.diagnosis} • {item.resolution}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.modalClose} onPress={() => setShowHistory(false)}>
          <Text style={styles.modalCloseText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f9',
  },
  content: {
    padding: 20,
    paddingTop: 48,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#8b98a6',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0b1220',
  },
  subtitle: {
    fontSize: 13,
    color: '#516575',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#eef2f7',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16a34a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e9f0f6',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0b1220',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginTop: 4,
  },
  note: {
    marginTop: 8,
    fontSize: 13,
    color: '#b45309',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0b1220',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
  },
  primaryButtonRecording: {
    backgroundColor: '#b91c1c',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonBusy: {
    backgroundColor: '#f3f4f6',
  },
  primaryButtonTextBusy: {
    color: '#0b1220',
  },
  primaryButtonRecording: {
    backgroundColor: '#b91c1c',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  ghostButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e9f0f6',
  },
  ghostButtonText: {
    color: '#0b1220',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  previewBox: {
    marginTop: 12,
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#dce7f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fbfdff',
  },
  previewText: {
    color: '#6b7b88',
    textAlign: 'center',
    fontSize: 14,
  },
  previewImage: {
    marginTop: 12,
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  historyRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e6eef6',
  },
  historyDate: {
    color: '#64748b',
    fontSize: 12,
  },
  historyIssue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  historyDetail: {
    color: '#475569',
    marginTop: 6,
  },
  modalClose: {
    marginTop: 16,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalCloseText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#94a3b8',
  },
  cardInline: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6eef6',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  cardTitleSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardTextSmall: {
    color: '#475569',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  message: {
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
    maxWidth: '85%',
  },
  messageUser: {
    backgroundColor: '#e6f0ff',
    alignSelf: 'flex-start',
    borderColor: '#cfe0ff',
    borderWidth: 1,
  },
  messageBot: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-end',
    borderColor: '#e6edf3',
    borderWidth: 1,
  },
  messageText: {
    color: '#0b1220',
    fontSize: 15,
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: '#0b5fff',
    fontWeight: '700',
    fontSize: 15,
  },
  // debug styles removed
  evidenceList: {
    marginTop: 8,
  },
  evidenceRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eef6fb',
  },
  evidenceTitle: {
    fontWeight: '700',
    color: '#0f172a',
  },
  evidenceExcerpt: {
    color: '#475569',
    marginTop: 4,
  },
  iconButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  iconButtonText: {
    color: '#0f172a',
    fontWeight: '700'
  },
  ghostButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e6eef6',
  },
  ghostButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  actionsRowSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    gap: 12,
  },
  bigButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 12,
  },
  bigButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  smallButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6eef6',
    justifyContent: 'center',
    minWidth: 90,
  },
  smallButtonText: {
    color: '#0f172a',
    fontWeight: '700',
    textAlign: 'center'
  },
  helperText: {
    marginTop: 12,
    color: '#6b7b88',
    fontSize: 13,
    textAlign: 'center'
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#cbd5e1',
  },
  recordingDotActive: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
});
