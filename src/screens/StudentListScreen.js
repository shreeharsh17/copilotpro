import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import Icon from '../components/Icon';
import SearchBar from '../components/SearchBar';
import StudentCard from '../components/StudentCard';
import StudentFormModal from '../components/StudentFormModal';
import { useStudents } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';

export default function StudentListScreen({ navigation, addRequest, onAddRequestHandled }) {
  const { theme } = useTheme();
  const { students, addStudent } = useStudents();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [manualFormVisible, setManualFormVisible] = useState(false);
  const formVisible = manualFormVisible || Boolean(addRequest);
  const courses = useMemo(() => ['All', ...new Set(students.map((student) => student.course))], [students]);
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return students
      .filter((student) => courseFilter === 'All' || student.course === courseFilter)
      .filter((student) => !search || [student.name, student.rollNumber, student.course, student.email].some((value) => value.toLowerCase().includes(search)))
      .sort((a, b) => sort === 'Name A–Z' ? a.name.localeCompare(b.name) : b.joined.localeCompare(a.joined));
  }, [students, query, courseFilter, sort]);

  const closeForm = () => {
    setManualFormVisible(false);
    if (addRequest) onAddRequestHandled();
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Header title="Students" subtitle="YOUR DIRECTORY" rightIcon="options-outline" onRightPress={() => setSort((current) => current === 'Newest' ? 'Name A–Z' : 'Newest')} />
        <View style={styles.summary}>
          <View>
            <Text style={[styles.count, { color: theme.colors.text }]}>{students.length} students</Text>
            <Text style={[styles.countNote, { color: theme.colors.secondary }]}>{filtered.length} shown · Sorted by {sort.toLowerCase()}</Text>
          </View>
          <CustomButton title="Add" icon={<Icon name="add" size={18} color="#FFFFFF" />} onPress={() => setManualFormVisible(true)} style={styles.addButton} />
        </View>
        <SearchBar value={query} onChangeText={setQuery} />
        <View style={styles.filterHeader}>
          <Text style={[styles.filterLabel, { color: theme.colors.secondary }]}>COURSE</Text>
          <Pressable onPress={() => setSort((current) => current === 'Newest' ? 'Name A–Z' : 'Newest')} style={styles.sortButton}>
            <Icon name="swap-vertical" size={14} color={theme.colors.primary} />
            <Text style={[styles.sortText, { color: theme.colors.primary }]}>{sort}</Text>
          </Pressable>
        </View>
        <View style={styles.filters}>
          {courses.map((course) => {
            const selected = course === courseFilter;
            return (
              <Pressable key={course} onPress={() => setCourseFilter(course)} style={[styles.chip, { backgroundColor: selected ? theme.colors.primary : theme.colors.surface, borderColor: selected ? theme.colors.primary : theme.colors.border }]}>
                <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : theme.colors.secondary }]}>{course}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.list}>
          {filtered.map((student) => (
            <StudentCard key={student.id} student={student} onPress={() => navigation.navigate('StudentDetails', { studentId: student.id })} />
          ))}
          {!filtered.length ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primarySoft }]}><Icon name={students.length ? 'search' : 'people-outline'} size={25} color={theme.colors.primary} /></View>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>{students.length ? 'No matches found' : 'Your directory is ready'}</Text>
              <Text style={[styles.emptyText, { color: theme.colors.secondary }]}>{students.length ? 'Try another name, email, or course.' : 'Add your first student to start building your campus community.'}</Text>
              {!students.length ? <CustomButton title="Add your first student" onPress={() => setManualFormVisible(true)} style={{ marginTop: 17 }} /> : null}
            </View>
          ) : null}
        </View>
      </ScrollView>
      <StudentFormModal visible={formVisible} onClose={closeForm} onSave={addStudent} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 28 },
  summary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  count: { fontSize: 15, fontWeight: '700' },
  countNote: { fontSize: 11, marginTop: 4 },
  addButton: { minHeight: 42, borderRadius: 13, paddingHorizontal: 14 },
  filterHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 9 },
  filterLabel: { fontSize: 10, letterSpacing: 1.1, fontWeight: '800' },
  sortButton: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 },
  sortText: { fontSize: 11, fontWeight: '700' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 17 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 11, fontWeight: '600' },
  list: { gap: 9 },
  emptyCard: { borderWidth: 1, borderRadius: 21, alignItems: 'center', padding: 25, marginTop: 3 },
  emptyIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyTitle: { fontSize: 17, fontWeight: '700' },
  emptyText: { fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 7, maxWidth: 260 },
});
