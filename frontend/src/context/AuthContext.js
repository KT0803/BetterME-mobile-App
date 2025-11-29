import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.log('Failed to load user', e);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (username, password) => {
        try {
            const res = await client.post('/auth/signin', { username, password });
            const { token, user } = res.data;

            setToken(token);
            setUser(user);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            return true;
        } catch (e) {
            console.log('Sign in error', e);
            throw e;
        }
    };

    const signUp = async (username, password) => {
        try {
            const res = await client.post('/auth/signup', { username, password });
            const { token, user } = res.data;

            setToken(token);
            setUser(user);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            return true;
        } catch (e) {
            console.log('Sign up error', e);
            throw e;
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setToken(null);
            setUser(null);
        } catch (e) {
            console.log('Sign out error', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
