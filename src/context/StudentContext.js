import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { initialStudents } from '../data/students';
import { storage } from '../storage/storage';

const defaultProfile = {
  name: 'Alex Morgan',
  rollNumber: 'STU-2024-001',
  course: 'Computer Science',
  department: 'School of Computing',
  email: 'alex.morgan@campus.edu',
  phone: '+1 (415) 555-0100',
  year: 'Year 2',
  initials: 'AM',
};

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [students, setStudents] = useState(initialStudents);
  const [profile, setProfile] = useState(defaultProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([storage.loadStudents(), storage.loadProfile()])
      .then(([savedStudents, savedProfile]) => {
        if (savedStudents) setStudents(savedStudents);
        if (savedProfile) setProfile(savedProfile);
      })
      .catch((error) => {
        console.error('Unable to load saved student data:', error);
        Alert.alert('Storage unavailable', 'Saved data could not be loaded. Your current session will still work.');
      })
      .finally(() => setReady(true));
  }, []);

  const persistStudents = useCallback(async (nextStudents) => {
    setStudents(nextStudents);
    try {
      await storage.saveStudents(nextStudents);
    } catch (error) {
      console.error('Unable to save students:', error);
      Alert.alert('Could not save changes', 'Please check your device storage and try again.');
    }
  }, []);

  const addStudent = useCallback((student) => {
    const initials = student.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
    const nextStudent = {
      ...student,
      id: `s-${Date.now()}`,
      initials,
      color: '#E9E5FF',
      attendance: Number(student.attendance) || 100,
      status: 'Active',
      joined: new Date().toISOString().slice(0, 10),
    };
    void persistStudents([nextStudent, ...students]);
    return nextStudent;
  }, [persistStudents, students]);

  const updateStudent = useCallback((id, updates) => {
    const nextStudents = students.map((student) => student.id === id
      ? { ...student, ...updates, initials: updates.name ? updates.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') : student.initials }
      : student);
    void persistStudents(nextStudents);
  }, [persistStudents, students]);

  const deleteStudent = useCallback((id) => {
    void persistStudents(students.filter((student) => student.id !== id));
  }, [persistStudents, students]);

  const updateProfile = useCallback(async (updates) => {
    const nextProfile = { ...profile, ...updates };
    setProfile(nextProfile);
    try {
      await storage.saveProfile(nextProfile);
    } catch (error) {
      console.error('Unable to save profile:', error);
      Alert.alert('Could not save profile', 'Please check your device storage and try again.');
    }
  }, [profile]);

  const value = useMemo(() => ({
    students,
    profile,
    ready,
    addStudent,
    updateStudent,
    deleteStudent,
    updateProfile,
  }), [students, profile, ready, addStudent, updateStudent, deleteStudent, updateProfile]);

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudents() {
  const value = useContext(StudentContext);
  if (!value) throw new Error('useStudents must be used within StudentProvider');
  return value;
}
