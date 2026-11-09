import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CustomButton({ title, onPress, icon, variant = 'primary', style, disabled, loading }) {
  const { theme } = useTheme();
  const filled = variant === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: filled ? theme.colors.primary : theme.colors.surface,
          borderColor: filled ? theme.colors.primary : theme.colors.border,
          opacity: pressed || disabled ? 0.78 : 1,
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={filled ? '#FFFFFF' : theme.colors.primary} /> : (
        <>
          {icon}
          <Text style={[styles.label, { color: filled ? '#FFFFFF' : theme.colors.text }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  label: { fontSize: 14, fontWeight: '700' },
});
