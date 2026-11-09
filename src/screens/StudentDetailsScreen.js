import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import Icon from '../components/Icon';
import StudentFormModal from '../components/StudentFormModal';
import { useStudents } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';

function InfoRow({ label, value, icon, colors }) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primarySoft }]}><Icon name={icon} size={17} color={colors.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: colors.secondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value || 'Not provided'}</Text>
      </View>
    </View>
  );
}

export default function StudentDetailsScreen({ navigation, route }) {
  const { theme } = useTheme();
  const { students, updateStudent, deleteStudent } = useStudents();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);
  const student = useMemo(() => students.find((item) => item.id === route.params?.studentId), [students, route.params?.studentId]);

  if (!student) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
        <View style={styles.content}><Header title="Student not found" onBack={() => navigation.goBack()} /><Text style={{ color: theme.colors.secondary }}>This student may have been removed.</Text></View>
      </View>
    );
  }

  const confirmDelete = () => Alert.alert('Remove student?', `${student.name} will be removed from your directory.`, [
    { text: 'Keep student', style: 'cancel' },
    { text: 'Remove', style: 'destructive', onPress: () => { deleteStudent(student.id); navigation.goBack(); } },
  ]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header title="Student details" onBack={() => navigation.goBack()} rightIcon="create-outline" onRightPress={() => setEditing(true)} />
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Avatar initials={student.initials} color={student.color} size={82} photo />
          <Text style={[styles.name, { color: theme.colors.text }]}>{student.name}</Text>
          <Text style={[styles.roll, { color: theme.colors.secondary }]}>{student.rollNumber}</Text>
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: theme.colors.primarySoft }]}><Text style={[styles.tagText, { color: theme.colors.primary }]}>{student.course}</Text></View>
            <View style={[styles.statusTag, { backgroundColor: theme.colors.successSoft }]}><View style={styles.dot} /><Text style={styles.statusText}>{student.status}</Text></View>
          </View>
        </View>

        <View style={[styles.attendanceCard, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.attendanceIcon}><Icon name="calendar" color="#FFFFFF" size={18} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.attendanceLabel}>ATTENDANCE</Text>
            <Text style={styles.attendanceValue}>{student.attendance}%</Text>
          </View>
          <View style={styles.ring}><Text style={styles.ringText}>{student.year}</Text></View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact information</Text>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <InfoRow label="Email address" value={student.email} icon="mail-outline" colors={theme.colors} />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <InfoRow label="Phone number" value={student.phone} icon="call-outline" colors={theme.colors} />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Academic information</Text>
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <InfoRow label="Course" value={student.course} icon="book-outline" colors={theme.colors} />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <InfoRow label="Year of study" value={student.year} icon="school-outline" colors={theme.colors} />
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <InfoRow label="Enrollment date" value={new Date(`${student.joined}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} icon="time-outline" colors={theme.colors} />
        </View>
        <CustomButton title="Delete student" variant="secondary" icon={<Icon name="trash-outline" color={theme.colors.error} size={17} />} onPress={confirmDelete} style={{ marginTop: 20, borderColor: theme.colors.border }} />
      </ScrollView>
      <StudentFormModal visible={editing} student={student} onClose={() => setEditing(false)} onSave={(updates) => updateStudent(student.id, updates)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  profileCard: { alignItems: 'center', borderWidth: 1, borderRadius: 22, padding: 21, marginBottom: 13 },
  name: { fontSize: 21, fontWeight: '700', letterSpacing: -0.4, marginTop: 13 },
  roll: { fontSize: 12, marginTop: 4 },
  tags: { flexDirection: 'row', gap: 7, marginTop: 12, alignItems: 'center' },
  tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  tagText: { fontSize: 10, fontWeight: '700' },
  statusTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 10 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#27A878' },
  statusText: { color: '#27A878', fontSize: 10, fontWeight: '700' },
  attendanceCard: { borderRadius: 19, minHeight: 103, padding: 17, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22, overflow: 'hidden' },
  attendanceIcon: { width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  attendanceLabel: { color: '#DBD8FF', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  attendanceValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', marginTop: 3 },
  ring: { minWidth: 66, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.16)', paddingVertical: 9, paddingHorizontal: 10, alignItems: 'center' },
  ringText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10, marginTop: 1 },
  infoCard: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 15, marginBottom: 20 },
  infoRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 10, marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: '600' },
  divider: { height: 1, marginLeft: 46 },
});
