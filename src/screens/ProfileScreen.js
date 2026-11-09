import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import Icon from '../components/Icon';
import StudentFormModal from '../components/StudentFormModal';
import { useStudents } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';

function ProfileInfo({ icon, label, value, colors }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primarySoft }]}><Icon name={icon} color={colors.primary} size={17} /></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: colors.secondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
      <Icon name="chevron-forward" size={16} color={colors.muted} />
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { theme } = useTheme();
  const { profile, updateProfile } = useStudents();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header title="My profile" subtitle="YOUR CAMPUS ID" rightIcon="settings-outline" onRightPress={() => navigation.setParams({ tab: 'Settings' })} />
        <View style={[styles.hero, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.avatarWrap}>
            <Avatar initials={profile.initials || 'AM'} size={94} color="#E9E5FF" />
            <View style={[styles.online, { borderColor: theme.colors.surface }]} />
          </View>
          <Text style={[styles.name, { color: theme.colors.text }]}>{profile.name}</Text>
          <Text style={[styles.course, { color: theme.colors.secondary }]}>{profile.course} · {profile.year}</Text>
          <View style={[styles.idBadge, { backgroundColor: theme.colors.primarySoft }]}><Icon name="card-outline" color={theme.colors.primary} size={14} /><Text style={[styles.idText, { color: theme.colors.primary }]}>{profile.rollNumber}</Text></View>
        </View>

        <View style={styles.aboutRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Personal details</Text>
          <Text style={[styles.privateNote, { color: theme.colors.secondary }]}>PRIVATE TO YOU</Text>
        </View>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <ProfileInfo icon="mail-outline" label="Email address" value={profile.email} colors={theme.colors} />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <ProfileInfo icon="call-outline" label="Phone number" value={profile.phone} colors={theme.colors} />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <ProfileInfo icon="school-outline" label="Department" value={profile.department} colors={theme.colors} />
        </View>

        <View style={[styles.memberCard, { backgroundColor: theme.colors.primarySoft }]}>
          <View style={[styles.memberIcon, { backgroundColor: theme.colors.surface }]}><Icon name="sparkles" color={theme.colors.primary} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.memberTitle, { color: theme.colors.text }]}>Your campus story</Text>
            <Text style={[styles.memberText, { color: theme.colors.secondary }]}>A little progress adds up to a lot.</Text>
          </View>
          <Icon name="arrow-forward" color={theme.colors.primary} size={17} />
        </View>
        <CustomButton title="Edit profile" icon={<Icon name="create-outline" color="#FFFFFF" size={17} />} onPress={() => setEditing(true)} style={{ marginTop: 21 }} />
      </ScrollView>
      <StudentFormModal
        visible={editing}
        student={{ ...profile, course: profile.course || '', rollNumber: profile.rollNumber || '', email: profile.email || '', phone: profile.phone || '', year: profile.year || '' }}
        onClose={() => setEditing(false)}
        onSave={(updates) => {
          const initials = updates.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
          void updateProfile({ ...updates, initials });
          Alert.alert('Profile updated', 'Your campus profile is up to date.');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 28 },
  hero: { borderWidth: 1, borderRadius: 23, alignItems: 'center', padding: 23, marginBottom: 23 },
  avatarWrap: { position: 'relative' },
  online: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: '#27A878', borderWidth: 3, right: 2, bottom: 1 },
  name: { fontSize: 21, fontWeight: '700', letterSpacing: -0.5, marginTop: 14 },
  course: { fontSize: 12, marginTop: 5 },
  idBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 11, marginTop: 14 },
  idText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  privateNote: { fontSize: 9, letterSpacing: 1, fontWeight: '700' },
  infoCard: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 15 },
  infoRow: { minHeight: 69, flexDirection: 'row', alignItems: 'center', gap: 11 },
  infoIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 10, marginBottom: 4 },
  infoValue: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, marginLeft: 45 },
  memberCard: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14, borderRadius: 18, marginTop: 20 },
  memberIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  memberTitle: { fontSize: 12, fontWeight: '700' },
  memberText: { fontSize: 10, marginTop: 3 },
});
