import React, { useState, useEffect, createContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import ResultScreen from './screens/ResultScreen';
import RewardsScreen from './screens/RewardsScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

export const PointsContext = createContext();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PlaceholderScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      <Text style={{ fontSize: 18, color: '#9E9E9E', fontWeight: '600' }}>{route.name}</Text>
      <Text style={{ fontSize: 14, color: '#BDBDBD', marginTop: 4 }}>Coming Soon</Text>
    </View>
  );
}

function TabIcon({ label, icon, focused, badge }) {
  return (
    <View style={tabStyles.iconWrap}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{icon}</Text>
      {badge && <View style={tabStyles.badge} />}
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

function ScanButton({ onPress }) {
  return (
    <TouchableOpacity style={tabStyles.scanBtn} onPress={onPress} activeOpacity={0.85}>
      <View style={tabStyles.scanInner}>
        <View style={tabStyles.lensBody}>
          <View style={tabStyles.lensCircle} />
        </View>
        <View style={tabStyles.lensFlash} />
      </View>
    </TouchableOpacity>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: tabStyles.tabBar,
      }}
    >
      <Tab.Screen
        name="Discover"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" icon={'\u2302'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Rewards"
        component={RewardsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Rewards" icon={'\u2606'} focused={focused} badge />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={PlaceholderScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate('Camera');
          },
        })}
        options={{
          tabBarButton: (props) => <ScanButton {...props} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="History" icon={'\u29D6'} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Account" icon={'\u2699'} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    height: 88,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  icon: {
    fontSize: 22,
    color: '#BDBDBD',
    marginBottom: 2,
  },
  iconActive: {
    color: '#4CAF50',
  },
  label: {
    fontSize: 10,
    color: '#BDBDBD',
    fontWeight: '600',
  },
  labelActive: {
    color: '#4CAF50',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC107',
  },
  scanBtn: {
    top: -20,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  scanInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lensBody: {
    width: 24,
    height: 18,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lensCircle: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  lensFlash: {
    position: 'absolute',
    top: -4,
    width: 8,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});

export default function App() {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalRedeemed, setTotalRedeemed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  // Load data on mount
  useEffect(() => {
    (async () => {
      try {
        const [savedPoints, savedHistory, savedEarned, savedRedeemed, onboarded] = await Promise.all([
          AsyncStorage.getItem('@resibo_points'),
          AsyncStorage.getItem('@resibo_history'),
          AsyncStorage.getItem('@resibo_total_earned'),
          AsyncStorage.getItem('@resibo_total_redeemed'),
          AsyncStorage.getItem('@resibo_onboarded'),
        ]);
        if (savedPoints) setPoints(parseInt(savedPoints, 10));
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        if (savedEarned) setTotalEarned(parseInt(savedEarned, 10));
        if (savedRedeemed) setTotalRedeemed(parseInt(savedRedeemed, 10));
        if (onboarded === 'true') setHasOnboarded(true);
      } catch (e) {
        // ignore load errors
      }
      setIsLoading(false);
    })();
  }, []);

  // Save whenever data changes (skip initial load)
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem('@resibo_points', points.toString());
    }
  }, [points]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem('@resibo_history', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem('@resibo_total_earned', totalEarned.toString());
    }
  }, [totalEarned]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem('@resibo_total_redeemed', totalRedeemed.toString());
    }
  }, [totalRedeemed]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
          <View style={{ width: 30, height: 24, borderRadius: 7, borderWidth: 3, borderColor: '#4CAF50' }} />
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#4CAF50', marginBottom: 8 }}>ResiboCash</Text>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  }

  return (
    <PointsContext.Provider value={{ points, setPoints, history, setHistory, totalEarned, setTotalEarned, totalRedeemed, setTotalRedeemed, hasOnboarded, setHasOnboarded }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={hasOnboarded ? 'MainTabs' : 'Onboarding'}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="MainTabs" component={HomeTabs} />
          <Stack.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#FFFFFF' },
              headerTintColor: '#212121',
              headerTitleStyle: { fontWeight: '700' },
              headerShadowVisible: false,
              title: 'Scan Receipt',
            }}
          />
          <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PointsContext.Provider>
  );
}
