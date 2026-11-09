import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { StudentProvider, useStudents } from './src/context/StudentContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

function Application() {
  const { theme } = useTheme();
  const { ready } = useStudents();
  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      {ready ? <AppNavigator /> : (
        <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.mark, { backgroundColor: theme.colors.primary }]}><Text style={styles.markText}>C</Text></View>
          <Text style={[styles.brand, { color: theme.colors.text }]}>Campus</Text>
          <Text style={[styles.caption, { color: theme.colors.secondary }]}>Your campus, thoughtfully organized.</Text>
          <ActivityIndicator color={theme.colors.primary} style={styles.spinner} />
        </View>
      )}
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StudentProvider>
            <Application />
          </StudentProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mark: { width: 58, height: 58, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  markText: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  brand: { fontSize: 25, fontWeight: '700', letterSpacing: -0.8, marginTop: 16 },
  caption: { fontSize: 12, marginTop: 6 },
  spinner: { marginTop: 25 },
});
