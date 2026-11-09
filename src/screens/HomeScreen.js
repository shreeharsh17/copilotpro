import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import Icon from '../components/Icon';
import StatCard from '../components/StatCard';
import { useStudents } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';

function SectionTitle({ title, action, onPress, colors }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.sectionHeading, { color: colors.text }]}>{title}</Text>
      {action ? <Pressable onPress={onPress}><Text style={[styles.actionText, { color: colors.primary }]}>{action}</Text></Pressable> : null}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const { students, profile } = useStudents();
  const insets = useSafeAreaInsets();
  const date = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  const average = students.length ? Math.round(students.reduce((sum, student) => sum + Number(student.attendance || 0), 0) / students.length) : 0;
  const courses = new Set(students.map((student) => student.course)).size;
  const recent = [...students].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 3);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topbar}>
          <View>
            <Text style={[styles.date, { color: theme.colors.secondary }]}>{date}</Text>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>Good morning,</Text>
            <Text style={[styles.student, { color: theme.colors.text }]}>Student <Text style={{ color: theme.colors.primary }}>✦</Text></Text>
          </View>
          <Pressable onPress={() => navigation.setParams({ tab: 'Profile' })} accessibilityRole="button" accessibilityLabel="Open profile">
            <Avatar initials={profile.initials || 'AM'} size={48} color="#E9E5FF" />
          </Pressable>
        </View>

        <View style={[styles.welcome, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.welcomeCopy}>
            <Text style={styles.eyebrow}>YOUR CAMPUS AT A GLANCE</Text>
            <Text style={styles.welcomeTitle}>A great day to{'\n'}make progress.</Text>
            <Pressable style={styles.welcomeLink} onPress={() => navigation.setParams({ tab: 'Students' })}>
              <Text style={styles.welcomeLinkText}>Explore students</Text>
              <Icon name="arrow-forward" size={15} color="#FFFFFF" />
            </Pressable>
          </View>
          <View style={styles.orb}><Icon name="school" size={34} color="#FFFFFF" /></View>
          <View style={styles.orbSmall} />
        </View>

        <SectionTitle title="Your overview" colors={theme.colors} />
        <View style={styles.stats}>
          <StatCard label="Total students" value={students.length} detail="Across all years" icon="people" accent="purple" />
          <StatCard label="Active students" value={students.filter((item) => item.status === 'Active').length} detail="↑ 8% this term" icon="trending-up" accent="green" />
          <StatCard label="Courses" value={courses} detail="Learning pathways" icon="book" accent="blue" />
          <StatCard label="Avg. attendance" value={`${average}%`} detail="Looking good" icon="checkmark-circle" accent="amber" />
        </View>

        <SectionTitle title="Attendance" action="This week" colors={theme.colors} />
        <View style={[styles.attendanceCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.attendanceTop}>
            <View>
              <Text style={[styles.attendancePercent, { color: theme.colors.text }]}>{average}%</Text>
              <Text style={[styles.attendanceCaption, { color: theme.colors.secondary }]}>Average attendance</Text>
            </View>
            <View style={styles.trend}><Icon name="trending-up" size={14} color={theme.colors.success} /><Text style={styles.trendText}>4.2%</Text></View>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.dark ? '#34384B' : '#F0EFF8' }]}>
            <View style={[styles.progressFill, { width: `${Math.min(average, 100)}%` }]} />
          </View>
          <View style={styles.progressLabels}><Text style={[styles.progressLabel, { color: theme.colors.secondary }]}>0%</Text><Text style={[styles.progressLabel, { color: theme.colors.secondary }]}>Target 85%</Text><Text style={[styles.progressLabel, { color: theme.colors.secondary }]}>100%</Text></View>
        </View>

        <SectionTitle title="Recently enrolled" action="View all" onPress={() => navigation.setParams({ tab: 'Students' })} colors={theme.colors} />
        <View style={[styles.recentCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          {recent.length ? recent.map((student, index) => (
            <Pressable key={student.id} onPress={() => navigation.navigate('StudentDetails', { studentId: student.id })} style={[styles.recentRow, index < recent.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.colors.border }]}>
              <Avatar initials={student.initials} color={student.color} size={40} photo />
              <View style={{ flex: 1 }}>
                <Text style={[styles.recentName, { color: theme.colors.text }]}>{student.name}</Text>
                <Text style={[styles.recentCourse, { color: theme.colors.secondary }]}>{student.course}</Text>
              </View>
              <Icon name="chevron-forward" size={17} color={theme.colors.muted} />
            </Pressable>
          )) : <Text style={[styles.empty, { color: theme.colors.secondary }]}>Your new students will show up here.</Text>}
        </View>

        <SectionTitle title="Quick actions" colors={theme.colors} />
        <View style={styles.quickActions}>
          <Pressable onPress={() => navigation.setParams({ tab: 'Students', addStudent: true })} style={[styles.quick, { backgroundColor: theme.colors.primarySoft }]}>
            <View style={[styles.quickIcon, { backgroundColor: theme.colors.surface }]}><Icon name="person-add" color={theme.colors.primary} /></View>
            <Text style={[styles.quickTitle, { color: theme.colors.text }]}>Add student</Text>
            <Text style={[styles.quickSubtitle, { color: theme.colors.secondary }]}>Create a new record</Text>
          </Pressable>
          <Pressable onPress={() => navigation.setParams({ tab: 'Settings' })} style={[styles.quick, { backgroundColor: theme.colors.successSoft }]}>
            <View style={[styles.quickIcon, { backgroundColor: theme.colors.surface }]}><Icon name="options" color={theme.colors.success} /></View>
            <Text style={[styles.quickTitle, { color: theme.colors.text }]}>Preferences</Text>
            <Text style={[styles.quickSubtitle, { color: theme.colors.secondary }]}>Make it yours</Text>
          </Pressable>
        </View>
        <Text style={[styles.footer, { color: theme.colors.muted }]}>MADE FOR YOUR NEXT CHAPTER</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  topbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  date: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, marginBottom: 9 },
  greeting: { fontSize: 17, fontWeight: '500' },
  student: { fontSize: 27, fontWeight: '700', letterSpacing: -0.8, marginTop: 1 },
  welcome: { minHeight: 174, borderRadius: 24, padding: 21, overflow: 'hidden', flexDirection: 'row', marginBottom: 26 },
  welcomeCopy: { zIndex: 1, flex: 1 },
  eyebrow: { color: '#D5D0FF', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  welcomeTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '700', lineHeight: 29, letterSpacing: -0.45, marginTop: 10 },
  welcomeLink: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 14 },
  welcomeLinkText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  orb: { width: 76, height: 76, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.17)', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '9deg' }], alignSelf: 'center', marginRight: 6 },
  orbSmall: { position: 'absolute', width: 110, height: 110, borderRadius: 60, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', right: -37, top: -34 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 1 },
  sectionHeading: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  actionText: { fontSize: 12, fontWeight: '700' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  attendanceCard: { borderWidth: 1, borderRadius: 19, padding: 17, marginBottom: 25 },
  attendanceTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  attendancePercent: { fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  attendanceCaption: { fontSize: 11, marginTop: 4 },
  trend: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: '#E8F7F0', borderRadius: 10 },
  trendText: { color: '#27A878', fontSize: 11, fontWeight: '700' },
  progressTrack: { height: 8, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#5546E8', borderRadius: 5 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  progressLabel: { fontSize: 10 },
  recentCard: { borderWidth: 1, borderRadius: 19, paddingHorizontal: 14, marginBottom: 25 },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 12 },
  recentName: { fontSize: 13, fontWeight: '700' },
  recentCourse: { fontSize: 11, marginTop: 3 },
  empty: { fontSize: 13, paddingVertical: 16 },
  quickActions: { flexDirection: 'row', gap: 10 },
  quick: { flex: 1, minHeight: 128, borderRadius: 18, padding: 14 },
  quickIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  quickTitle: { fontSize: 13, fontWeight: '700' },
  quickSubtitle: { fontSize: 10, marginTop: 4 },
  footer: { textAlign: 'center', letterSpacing: 1.6, fontSize: 9, fontWeight: '700', marginTop: 24, marginBottom: 8 },
});
