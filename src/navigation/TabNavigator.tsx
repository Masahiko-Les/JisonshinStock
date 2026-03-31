import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { User } from 'firebase/auth';
import React from 'react';
import { AccountScreen } from '../screens/AccountScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { StockScreen } from '../screens/StockScreen';
import { colors } from '../theme/colors';

type Props = {
  user: User;
};

const Tab = createBottomTabNavigator();

export const TabNavigator = ({ user }: Props) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      >
        {() => <HomeScreen user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Stock"
        options={{
          title: 'ストック',
          tabBarIcon: ({ color, size }) => <Ionicons name="albums" size={size} color={color} />,
        }}
      >
        {() => <StockScreen user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Account"
        options={{
          title: 'アカウント',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      >
        {() => <AccountScreen user={user} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
