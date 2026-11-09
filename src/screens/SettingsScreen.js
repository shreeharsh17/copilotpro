import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../components/Header';
import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import { storage } from '../storage/storage';

function SettingRow({ icon, title, subtitle, colors, onPress, trailing }) {
  return (
    <Pressable onPress={onPress} style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: colors.primarySoft }]}><Icon name={icon} color={colors.primary} size={17} /></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.settingSubtitle, { color: colors.secondary }]}>{subtitle}</Text>
      </View>
      {trailing || <Icon name="chevron-forward" color={colors.muted} size={17} />}
    </Pressable>
  );
}

function SettingGroup({ title, children, colors }) {
  return (
    <View style={styles.group}>
      <Text style={[styles.groupTitle, { color: colors.secondary }]}>{title}</Text>
      <View style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>{children}</View>
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const { theme, setTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState({ announcements: true, reminders: true });

  useEffect(() => {
    storage.loadSettings().then((settings) => {
      if (settings?.notifications) setNotifications(settings.notifications);
    }).catch((error) => console.error('Unable to load notification settings:', error));
  }, []);

  const updateNotification = async (key, value) => {
    const next = { ...notifications, [key]: value };
    setNotifications(next);
    try {
      const settings = (await storage.loadSettings()) || {};
      await storage.saveSettings({ ...settings, notifications: next });
    } catch (error) {
      console.error('Unable to save notification settings:', error);
      Alert.alert('Could not save setting', 'Please try changing this preference again.');
    }
  };

  const toggle = (key) => (
    <Switch
      value={notifications[key]}
      onValueChange={(value) => updateNotification(key, value)}
      trackColor={{ false: theme.dark ? '#45495B' : '#E5E7EF', true: '#B9B0FF' }}
      thumbColor={notifications[key] ? theme.colors.primary : '#FFFFFF'}
    />
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header title="Settings" subtitle="MAKE IT YOURS" />
        <SettingGroup title="ACCOUNT" colors={theme.colors}>
          <SettingRow icon="person-outline" title="Account details" subtitle="Your profile and personal info" colors={theme.colors} onPress={() => navigation.setParams({ tab: 'Profile' })} />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <SettingRow icon="lock-closed-outline" title="Privacy & security" subtitle="Your data stays on this device" colors={theme.colors} onPress={() => Alert.alert('Privacy & security', 'Your student directory and profile are stored locally on this device.') } />
        </SettingGroup>

        <SettingGroup title="NOTIFICATIONS" colors={theme.colors}>
          <SettingRow icon="megaphone-outline" title="Campus announcements" subtitle="News and important updates" colors={theme.colors} trailing={toggle('announcements')} />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <SettingRow icon="calendar-outline" title="Study reminders" subtitle="A gentle nudge to stay on track" colors={theme.colors} trailing={toggle('reminders')} />
        </SettingGroup>

        <SettingGroup title="APPEARANCE" colors={theme.colors}>
          <SettingRow icon={theme.dark ? 'moon-outline' : 'sunny-outline'} title="Dark appearance" subtitle={theme.dark ? 'Easy on the eyes, day or night' : 'A little more comfortable at night'} colors={theme.colors} trailing={
            <Switch value={theme.dark} onValueChange={(enabled) => setTheme(enabled ? 'dark' : 'light')} trackColor={{ false: '#E5E7EF', true: '#B9B0FF' }} thumbColor={theme.dark ? theme.colors.primary : '#FFFFFF'} />
          } />
        </SettingGroup>

        <SettingGroup title="ABOUT" colors={theme.colors}>
          <SettingRow icon="information-circle-outline" title="About Campus" subtitle="A thoughtful home for student life" colors={theme.colors} onPress={() => Alert.alert('Campus', 'Student Management · Version 1.0.0\n\nMade for your next chapter.') } />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <SettingRow icon="code-slash-outline" title="Application version" subtitle="Campus · 1.0.0" colors={theme.colors} trailing={<Text style={[styles.version, { color: theme.colors.secondary }]}>1.0.0</Text>} />
        </SettingGroup>

        <Pressable onPress={() => Alert.alert('Sign out', 'You are using Campus in local demo mode. Your saved student data will remain on this device.', [{ text: 'Stay here', style: 'cancel' }, { text: 'Got it', onPress: () => navigation.setParams({ tab: 'Home' }) }])} style={[styles.logout, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Icon name="log-out-outline" color={theme.colors.error} size={18} />
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>Sign out</Text>
        </Pressable>
        <Text style={[styles.footer, { color: theme.colors.muted }]}>CAMPUS · MADE WITH CARE</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 30 },
  group: { marginBottom: 19 },
  groupTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 8, marginLeft: 3 },
  groupCard: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 13 },
  settingRow: { minHeight: 69, flexDirection: 'row', alignItems: 'center', gap: 11 },
  settingIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontSize: 12, fontWeight: '700' },
  settingSubtitle: { fontSize: 10, marginTop: 4 },
  divider: { height: 1, marginLeft: 45 },
  version: { fontSize: 11, fontWeight: '600' },
  logout: { height: 50, borderRadius: 15, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  logoutText: { fontSize: 13, fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 9, fontWeight: '700', letterSpacing: 1.3, marginTop: 19 },
});
