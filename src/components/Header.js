import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../context/ThemeContext';

export default function Header({ title, subtitle, rightIcon, onRightPress, onBack, backLabel }) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack} style={[styles.back, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Icon name="arrow-back" color={theme.colors.text} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        {subtitle ? <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>{subtitle}</Text> : null}
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{title}</Text>
      </View>
      {rightIcon ? (
        <Pressable accessibilityRole="button" onPress={onRightPress} style={[styles.action, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Icon name={rightIcon} color={theme.colors.text} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  copy: { flex: 1 },
  title: { fontSize: 23, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  action: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  back: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
