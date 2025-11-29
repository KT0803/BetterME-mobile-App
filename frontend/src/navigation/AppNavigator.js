import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ActivityIndicator, View } from 'react-native';

// Screens
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import AddHabitScreen from '../screens/Habits/AddHabitScreen';
import HabitsScreen from '../screens/Habits/HabitsScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import RoutinesScreen from '../screens/Routines/RoutinesScreen';
import AddRoutineScreen from '../screens/Routines/AddRoutineScreen';
import StatsScreen from '../screens/Stats/StatsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
);

const AppTabs = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: theme.surface },
                headerTintColor: theme.text,
                tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Habits" component={HabitsScreen} />
            <Tab.Screen name="Routines" component={RoutinesScreen} />
            <Tab.Screen name="Stats" component={StatsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
};

const RootStack = createNativeStackNavigator();

const AppStack = () => (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Main" component={AppTabs} />
        <RootStack.Screen name="AddHabit" component={AddHabitScreen} options={{ presentation: 'modal' }} />
        <RootStack.Screen name="AddRoutine" component={AddRoutineScreen} options={{ presentation: 'modal' }} />
    </RootStack.Navigator>
);

export default function AppNavigator() {
    const { user, isLoading } = useAuth();
    const { theme } = useTheme();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    const navigationTheme = theme.mode === 'dark' ? DarkTheme : DefaultTheme;

    const myTheme = {
        ...navigationTheme,
        colors: {
            ...navigationTheme.colors,
            primary: theme.primary,
            background: theme.background,
            card: theme.surface,
            text: theme.text,
            border: theme.border,
            notification: theme.secondary,
        },
    };

    return (
        <NavigationContainer theme={myTheme}>
            {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
