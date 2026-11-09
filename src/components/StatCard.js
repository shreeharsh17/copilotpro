import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../context/ThemeContext';

export default function StatCard({ label, value, detail, icon, accent = 'purple', style }) {
  const { theme } = useTheme();
  const accents = {
    purple: [theme.colors.primarySoft, theme.colors.primary],
    green: [theme.colors.successSoft, theme.colors.success],
    amber: [theme.colors.warningSoft, theme.colors.warning],
    blue: [theme.colors.blueSoft, theme.colors.blue],
  };
  const [soft, strong] = accents[accent] || accents.purple;
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }, style]}>
      <View style={[styles.icon, { backgroundColor: soft }]}><Icon name={icon} size={18} color={strong} /></View>
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.colors.secondary }]}>{label}</Text>
      {detail ? <Text style={[styles.detail, { color: strong }]}>{detail}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 145, borderWidth: 1, borderRadius: 20, padding: 16 },
  icon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  value: { fontSize: 26, fontWeight: '700', letterSpacing: -0.7 },
  label: { fontSize: 12, fontWeight: '500', marginTop: 4 },
  detail: { fontSize: 11, fontWeight: '700', marginTop: 10 },
});
