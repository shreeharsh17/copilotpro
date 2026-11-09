import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from './Icon';
import CustomButton from './CustomButton';
import { useTheme } from '../context/ThemeContext';

const fields = [
  { key: 'name', label: 'Full name', placeholder: 'e.g. Jamie Parker' },
  { key: 'rollNumber', label: 'Roll number', placeholder: 'e.g. STU-2025-024' },
  { key: 'course', label: 'Course', placeholder: 'e.g. Computer Science' },
  { key: 'email', label: 'Email address', placeholder: 'name@campus.edu', keyboardType: 'email-address' },
  { key: 'phone', label: 'Phone number', placeholder: '+1 (415) 555-0100', keyboardType: 'phone-pad' },
  { key: 'year', label: 'Year of study', placeholder: 'Year 1' },
];

function StudentFormContent({ student, onClose, onSave }) {
  const { theme } = useTheme();
  const [values, setValues] = useState(() => student ? { ...student } : {});

  const save = () => {
    const form = Object.fromEntries(fields.map(({ key }) => [key, String(values[key] || '').trim()]));
    if (!form.name || !form.rollNumber || !form.course || !form.email) {
      Alert.alert('A few details are missing', 'Name, roll number, course, and email are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Alert.alert('Check the email address', 'Enter a valid email address to continue.');
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
      <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
        <View style={styles.handle} />
        <View style={styles.heading}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{student ? 'Edit student' : 'New student'}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>Add a few details to get started.</Text>
          </View>
          <Pressable onPress={onClose} style={[styles.close, { backgroundColor: theme.colors.surface }]}><Icon name="close" color={theme.colors.text} /></Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
          {fields.map((field) => (
            <View key={field.key} style={styles.field}>
              <Text style={[styles.label, { color: theme.colors.text }]}>{field.label}</Text>
              <TextInput
                value={values[field.key] || ''}
                onChangeText={(text) => setValues((current) => ({ ...current, [field.key]: text }))}
                placeholder={field.placeholder}
                placeholderTextColor={theme.colors.muted}
                keyboardType={field.keyboardType || 'default'}
                autoCapitalize={field.keyboardType === 'email-address' ? 'none' : 'words'}
                style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              />
            </View>
          ))}
        </ScrollView>
        <CustomButton title={student ? 'Save changes' : 'Add student'} onPress={save} style={{ marginTop: 10 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

export default function StudentFormModal({ visible, onClose, onSave, student }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close form" />
        {visible ? <StudentFormContent key={student?.id || 'new'} student={student} onClose={onClose} onSave={onSave} /> : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(17,19,34,0.42)', justifyContent: 'flex-end' },
  keyboard: { width: '100%' },
  sheet: { maxHeight: '92%', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingBottom: Platform.OS === 'ios' ? 30 : 20, paddingTop: 10 },
  handle: { width: 38, height: 4, borderRadius: 5, backgroundColor: '#D5D7E0', alignSelf: 'center', marginBottom: 18 },
  heading: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 21, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 5 },
  close: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  field: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 7 },
  input: { height: 48, borderWidth: 1, borderRadius: 13, paddingHorizontal: 13, fontSize: 14 },
});
