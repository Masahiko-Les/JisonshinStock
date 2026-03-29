import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './src/hooks/useAuth';
import { TabNavigator } from './src/navigation/TabNavigator';
import { AuthScreen } from './src/screens/AuthScreen';
import { colors } from './src/theme/colors';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {user ? (
          <NavigationContainer>
            <TabNavigator user={user} />
          </NavigationContainer>
        ) : (
          <SafeAreaView style={styles.container}>
            <AuthScreen />
          </SafeAreaView>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});