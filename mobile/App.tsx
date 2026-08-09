import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { PHASE_CAPTION, TURNS, type Phase } from './src/demoData';

export default function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [turnIndex, setTurnIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const currentTurn = TURNS[turnIndex];
  const caption = useMemo(() => PHASE_CAPTION[phase], [phase]);

  const advance = () => {
    if (phase === 'idle') {
      setPhase('listening');
      return;
    }

    if (turnIndex < TURNS.length - 1) {
      setTurnIndex((value) => value + 1);
      setPhase('waiting_for_input');
      return;
    }

    setPhase('complete');
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setPhase('waiting_for_input');
      return;
    }

    setIsRecording(true);
    setPhase('listening');
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

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>TECHNICIAN COPILOT</Text>
            <Text style={styles.title}>Pump A17</Text>
            <Text style={styles.subtitle}>Hands-free support with live capture</Text>
          </View>
          <View style={styles.badge}><Text style={styles.badgeText}>ONLINE</Text></View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session state</Text>
          <Text style={styles.cardText}>{caption}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current turn</Text>
          <Text style={styles.cardText}>{currentTurn.technician}</Text>
          <Text style={styles.cardText}>{currentTurn.assistant}</Text>
          {currentTurn.note ? <Text style={styles.note}>{currentTurn.note}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Capture tools</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={toggleRecording}>
              <Text style={styles.primaryButtonText}>{isRecording ? 'Stop mic' : 'Start mic'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={openCamera}>
              <Text style={styles.secondaryButtonText}>Open camera</Text>
            </TouchableOpacity>
          </View>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>Captured video or photo will appear here.</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended next step</Text>
          <Text style={styles.cardText}>Inspect the bearing housing and confirm the temperature trend before restarting the pump.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Actions</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={advance}>
            <Text style={styles.primaryButtonText}>{phase === 'idle' ? 'Start session' : phase === 'complete' ? 'Restart flow' : 'Advance step'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => { setPhase('idle'); setTurnIndex(0); setImageUri(null); setIsRecording(false); }}>
            <Text style={styles.secondaryButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
});
