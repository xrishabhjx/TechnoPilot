import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

export default function Transcript({ messages }: { messages: { role: string; text: string }[] }) {
  return (
    <View style={styles.container}>
      {messages.map((m, i) => (
        <View key={i} style={[styles.bubble, m.role === 'copilot' ? styles.bot : styles.user]}>
          <Text style={styles.text}>{m.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  bubble: {
    padding: 14,
    borderRadius: theme.radii.md,
    marginVertical: 6,
    maxWidth: '85%'
  },
  user: { backgroundColor: '#e6f0ff', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#cfe0ff' },
  bot: { backgroundColor: '#f1f5f9', alignSelf: 'flex-end', borderWidth: 1, borderColor: '#e6edf3' },
  text: { color: theme.colors.primary, fontSize: 15 },
});
