import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme';

export default function MachineCard({ equipment }: { equipment: any }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Machine</Text>
          <Text style={styles.title}>{equipment.name}</Text>
          <Text style={styles.subtitle}>{equipment.type}</Text>
        </View>
        <View style={styles.statusBubble}><Text style={styles.statusText}>ONLINE</Text></View>
      </View>
      <Text style={styles.meta}>Last service: {equipment.lastService}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.medium,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.medium,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#8b98a6', fontWeight: '700', fontSize: 12 },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.primary },
  subtitle: { color: '#516575' },
  meta: { marginTop: 8, color: '#6b7b88' },
  statusBubble: { backgroundColor: '#eef2f7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  statusText: { color: theme.colors.success, fontWeight: '700' },
});
