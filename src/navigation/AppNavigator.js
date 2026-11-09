import React, { useState } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../components/Icon';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StudentDetailsScreen from '../screens/StudentDetailsScreen';
import StudentListScreen from '../screens/StudentListScreen';

const Stack = createNativeStackNavigator();
const tabs = [
  { key: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'Students', label: 'Students', icon: 'people-outline', activeIcon: 'people' },
  { key: 'Profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  { key: 'Settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
];

function BottomNavigation({ activeTab, onSelect, colors, bottomInset }) {
  return (
    <View style={[styles.tabbar, { backgroundColor: colors.surface, borderColor: colors.border, paddingBottom: Math.max(bottomInset, 4) }]}>
      {tabs.map((tab) => {
        const selected = tab.key === activeTab;
        return (
          <Pressable key={tab.key} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => onSelect(tab.key)} style={styles.tab}>
            <View style={[styles.tabIcon, selected && { backgroundColor: colors.primarySoft }]}>
              <Icon name={selected ? tab.activeIcon : tab.icon} size={19} color={selected ? colors.primary : colors.secondary} />
            </View>
            <Text style={[styles.tabLabel, { color: selected ? colors.primary : colors.secondary }, selected && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedTab, setSelectedTab] = useState('Home');
  const requestedTab = tabs.some((tab) => tab.key === route.params?.tab) ? route.params.tab : null;
  const activeTab = requestedTab || selectedTab;

  const Screen = activeTab === 'Students' ? StudentListScreen
    : activeTab === 'Profile' ? ProfileScreen
      : activeTab === 'Settings' ? SettingsScreen : HomeScreen;
  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
    navigation.setParams({ tab: undefined, addStudent: false });
  };
  const requestHandled = () => navigation.setParams({ addStudent: false });

  return (
    <View style={[styles.main, { backgroundColor: theme.colors.background }]}>
      <View style={styles.screen}><Screen navigation={navigation} addRequest={route.params?.addStudent} onAddRequestHandled={requestHandled} /></View>
      <BottomNavigation activeTab={activeTab} onSelect={handleTabSelect} colors={theme.colors} bottomInset={insets.bottom} />
    </View>
  );
}

export default function AppNavigator() {
  const { theme } = useTheme();
  return (
    <NavigationContainer theme={{
      dark: theme.dark,
      colors: {
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.error,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' },
      },
    }}>
      <Stack.Navigator initialRouteName="MainTabs" screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: theme.colors.background } }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1 },
  screen: { flex: 1 },
  tabbar: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 7, paddingBottom: 4, paddingHorizontal: 8 },
  tab: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabIcon: { width: 40, height: 29, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 9, fontWeight: '600' },
  activeLabel: { fontWeight: '800' },
});
