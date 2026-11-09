import AsyncStorage from '@react-native-async-storage/async-storage';

const STUDENTS_KEY = '@campus/students';
const PROFILE_KEY = '@campus/profile';
const SETTINGS_KEY = '@campus/settings';

export const storage = {
  async loadStudents() {
    const data = await AsyncStorage.getItem(STUDENTS_KEY);
    return data ? JSON.parse(data) : null;
  },
  async saveStudents(students) {
    await AsyncStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  },
  async loadProfile() {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  },
  async saveProfile(profile) {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
  async loadSettings() {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  },
  async saveSettings(settings) {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
};
