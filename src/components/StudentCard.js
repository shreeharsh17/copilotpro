import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Avatar from './Avatar';
import Icon from './Icon';
import { useTheme } from '../context/ThemeContext';

export default function StudentCard({ student, onPress }) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${student.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: pressed ? 0.8 : 1 }]}
    >
      <Avatar initials={student.initials} color={student.color} size={48} photo />
      <View style={styles.content}>
        <View style={styles.nameLine}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>{student.name}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{student.status || 'Active'}</Text></View>
        </View>
        <Text style={[styles.meta, { color: theme.colors.secondary }]} numberOfLines={1}>{student.course} · {student.rollNumber}</Text>
        <Text style={[styles.email, { color: theme.colors.muted }]} numberOfLines={1}>{student.email}</Text>
      </View>
      <Icon name="chevron-forward" size={17} color={theme.colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, borderWidth: 1 },
  content: { flex: 1, minWidth: 0 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  meta: { fontSize: 11, marginTop: 5 },
  email: { fontSize: 11, marginTop: 3 },
  badge: { backgroundColor: '#E8F7F0', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  badgeText: { color: '#27A878', fontSize: 9, fontWeight: '700' },
});
