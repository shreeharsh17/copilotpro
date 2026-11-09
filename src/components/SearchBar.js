import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from './Icon';
import { useTheme } from '../context/ThemeContext';

export default function SearchBar({ value, onChangeText, placeholder = 'Search students...' }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Icon name="search" color={theme.colors.secondary} size={19} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.muted}
        style={[styles.input, { color: theme.colors.text }]}
        returnKeyType="search"
        autoCapitalize="none"
      />
      {value ? <Icon name="close-circle" color={theme.colors.muted} size={18} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 50, borderWidth: 1, borderRadius: 15, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, fontSize: 14, paddingVertical: 11 },
});
