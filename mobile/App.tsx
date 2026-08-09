import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, FlatList, Modal } from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { PHASE_CAPTION, TURNS } from './src/demoData';
import { useDemoEngine } from './src/demoEngine';
import { HISTORY_EVENTS } from './src/pumpA17';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const engine = useDemoEngine();
  const { phase, currentTurn, start, advance: engineAdvance, reset } = engine;
  const caption = useMemo(() => PHASE_CAPTION[phase], [phase]);

  const advance = () => {
    if (phase === 'idle') {
      start();
      return;
    }
    if (phase === 'complete') {
      reset();
      return;
    }
    engineAdvance();
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      engineAdvance();
      return;
    }

    setIsRecording(true);
    if (phase === 'idle') start();
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({ 
        quality: 0.8,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
        setPhase('reasoning');
      }
    } catch (error) {
      Alert.alert('Camera', 'Camera access unavailable or denied.');
    }
  };

  const [showEvidence, setShowEvidence] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
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

        <View style={styles.cardInline}>
          <Text style={styles.cardTitleSmall}>Session</Text>
          <Text style={styles.cardTextSmall}>{caption}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conversation</Text>
          <FlatList
            data={engine.messages}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <View style={[styles.message, item.role === 'copilot' ? styles.messageBot : styles.messageUser]}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.cardText}>No messages yet — start the session.</Text>}
          />

          <TouchableOpacity style={styles.link} onPress={() => setShowEvidence((v) => !v)}>
            <Text style={styles.linkText}>{showEvidence ? 'Hide evidence' : 'Show evidence'}</Text>
          </TouchableOpacity>
          {showEvidence && (
            <View style={styles.evidenceList}>
              {engine.evidence.map((doc) => (
                <View key={doc.id} style={styles.evidenceRow}>
                  <Text style={styles.evidenceTitle}>{doc.title}</Text>
                  <Text style={styles.evidenceExcerpt}>{doc.excerpt}</Text>
                </View>
              ))}
              {engine.evidenceNote ? <Text style={styles.note}>{engine.evidenceNote}</Text> : null}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Capture</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={toggleRecording} activeOpacity={0.85}>
              <Text style={styles.primaryButtonText}>{isRecording ? 'Stop mic' : 'Start mic'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostButton} onPress={openCamera} activeOpacity={0.85}>
              <Text style={styles.ghostButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>Capture appears here.</Text>
            </View>
          )}
        </View>

        <View style={styles.cardInline}>
          <Text style={styles.cardTitleSmall}>Next step</Text>
          <Text style={styles.cardTextSmall}>Inspect the bearing housing and confirm the temperature trend before restarting the pump.</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.bigButton} onPress={advance} activeOpacity={0.9}>
            <Text style={styles.bigButtonText}>{phase === 'idle' ? 'Start session' : phase === 'complete' ? 'Restart' : 'Next'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallButton} onPress={() => { reset(); setImageUri(null); setIsRecording(false); }}>
            <Text style={styles.smallButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>

    <Modal visible={showHistory} animationType="slide" onRequestClose={() => setShowHistory(false)}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Maintenance History</Text>
        <FlatList
          data={HISTORY_EVENTS}
          keyExtractor={(i) => i.date}
          renderItem={({ item }) => (
            <View style={styles.historyRow}>
              <Text style={styles.historyDate}>{item.date}</Text>
              <Text style={styles.historyIssue}>{item.issue}</Text>
              <Text style={styles.historyDetail}>{item.diagnosis} • {item.resolution}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.modalClose} onPress={() => setShowHistory(false)}>
          <Text style={styles.modalCloseText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    padding: 20,
    paddingTop: 48,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#64748b',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
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
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbe3ec',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginTop: 4,
  },
  note: {
    marginTop: 8,
    fontSize: 12,
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
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#eef2f7',
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  previewBox: {
    marginTop: 12,
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#c2cedb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  previewText: {
    color: '#64748b',
    textAlign: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleSmall: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardTextSmall: {
    color: '#475569',
  },
  message: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    maxWidth: '85%'
  },
  messageUser: {
    backgroundColor: '#eef2f7',
    alignSelf: 'flex-start',
  },
  messageBot: {
    backgroundColor: '#0f172a',
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff'
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: '#2563eb',
    fontWeight: '700',
  },
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
    gap: 12,
    marginTop: 10,
  },
  bigButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bigButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  smallButton: {
    marginLeft: 10,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6eef6',
    justifyContent: 'center'
  },
  smallButtonText: {
    color: '#0f172a',
    fontWeight: '700'
  },
});
