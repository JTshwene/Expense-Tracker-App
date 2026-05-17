import React, { useState } from 'react';
import {
  View,
  StatusBar,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { ExpenseProvider, useExpenses } from './src/context/ExpenseContext';
import { ToastProvider } from './src/context/ToastContext';
import TabBar from './src/components/TabBar';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import { colors } from './src/theme';

function Root() {
  const [screen, setScreen] = useState('home');
  const { loading } = useExpenses();

  const navigate = (target) => setScreen(target);

  let content;
  if (screen === 'add') content = <AddExpenseScreen navigate={navigate} />;
  else if (screen === 'stats') content = <StatsScreen navigate={navigate} />;
  else if (screen === 'settings') content = <SettingsScreen navigate={navigate} />;
  else if (screen === 'categories') content = <CategoriesScreen navigate={navigate} />;
  else content = <HomeScreen navigate={navigate} />;

  const activeTab = screen === 'categories' ? 'settings' : screen;

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          content
        )}
      </View>
      <TabBar active={activeTab} onChange={navigate} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <ToastProvider>
        <Root />
      </ToastProvider>
    </ExpenseProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
