import React from 'react';
import { View, Text } from 'react-native';

const Placeholder = ({ name }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{name} Screen</Text>
    </View>
);

export const HomeScreen = () => <Placeholder name="Home" />;
export const HabitsScreen = () => <Placeholder name="Habits" />;
export const RoutinesScreen = () => <Placeholder name="Routines" />;
export const StatsScreen = () => <Placeholder name="Stats" />;
export const SettingsScreen = () => <Placeholder name="Settings" />;
export const SignInScreen = () => <Placeholder name="SignIn" />;
export const SignUpScreen = () => <Placeholder name="SignUp" />;
