import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

export default function EvidencePanel({ evidence }: { evidence: any[] }) {
  if (!evidence || evidence.length === 0) return null;
  return (
    <View style={styles.container}>
      {evidence.map((d) => (
        <View key={d.id} style={styles.row}>
          <Text style={styles.title}>{d.title}</Text>
          <Text style={styles.excerpt}>{d.excerpt}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eef6fb' },
  title: { fontWeight: '700', color: theme.colors.primary },
  excerpt: { color: '#475569', marginTop: 4 },
});
