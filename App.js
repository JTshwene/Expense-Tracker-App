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
import TabBar from './src/components/TabBar';
import HomeScreen from './src/screens/HomeScreen';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/theme';

function Root() {
  const [tab, setTab] = useState('home');
  const { loading } = useExpenses();

  const navigate = (target) => setTab(target);

  let screen;
  if (tab === 'add') screen = <AddExpenseScreen navigate={navigate} />;
  else if (tab === 'stats') screen = <StatsScreen navigate={navigate} />;
  else if (tab === 'settings') screen = <SettingsScreen navigate={navigate} />;
  else screen = <HomeScreen navigate={navigate} />;

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          screen
        )}
      </View>
      <TabBar active={tab} onChange={setTab} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ExpenseProvider>
      <Root />
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
