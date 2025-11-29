import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { format } from 'date-fns';

const HomeScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState({});
    const [loading, setLoading] = useState(true);

    const today = format(new Date(), 'yyyy-MM-dd');

    const fetchData = async () => {
        try {
            const [habitsRes, logsRes] = await Promise.all([
                client.get('/habits'),
                client.get(`/habits/logs/${today}`)
            ]);

            setHabits(habitsRes.data.filter(h => h.isActive));

            const logsMap = {};
            logsRes.data.forEach(log => {
                logsMap[log.habit] = log;
            });
            setLogs(logsMap);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const toggleHabit = async (habit) => {
        const log = logs[habit._id];
        const isCompleted = log ? !log.completed : true;
        const progress = isCompleted ? habit.targetValue : 0;

        // Optimistic update
        setLogs(prev => ({
            ...prev,
            [habit._id]: { ...prev[habit._id], completed: isCompleted, progress }
        }));

        try {
            await client.post('/habits/log', {
                habitId: habit._id,
                date: today,
                completed: isCompleted,
                progress
            });
        } catch (err) {
            console.log(err);
            // Revert on error
            fetchData();
        }
    };

    const renderItem = ({ item }) => {
        const log = logs[item._id];
        const isCompleted = log?.completed;

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        backgroundColor: isCompleted ? theme.primary : theme.surface,
                        borderColor: isCompleted ? theme.primary : theme.border
                    }
                ]}
                onPress={() => toggleHabit(item)}
            >
                <View style={styles.cardContent}>
                    <Text style={[
                        styles.habitName,
                        { color: isCompleted ? '#FFF' : theme.text }
                    ]}>
                        {item.name}
                    </Text>
                    <Text style={[
                        styles.habitTarget,
                        { color: isCompleted ? 'rgba(255,255,255,0.8)' : theme.textSecondary }
                    ]}>
                        {item.targetValue} {item.targetType === 'time' ? 'min' : 'times'}
                    </Text>
                </View>

                <View style={[
                    styles.checkbox,
                    {
                        borderColor: isCompleted ? '#FFF' : theme.border,
                        backgroundColor: isCompleted ? '#FFF' : 'transparent'
                    }
                ]}>
                    {isCompleted && <View style={[styles.checkInner, { backgroundColor: theme.primary }]} />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: theme.textSecondary }]}>Hello, {user?.username}</Text>
                    <Text style={[styles.title, { color: theme.text }]}>Today's Habits</Text>
                </View>
                <Text style={[styles.date, { color: theme.primary }]}>{format(new Date(), 'MMM d')}</Text>
            </View>

            <FlatList
                data={habits}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchData} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.empty}>
                            <Text style={{ color: theme.textSecondary }}>No active habits for today.</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Habits')}>
                                <Text style={{ color: theme.primary, marginTop: 8 }}>Manage Habits</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60, // For status bar
    },
    greeting: {
        fontSize: 16,
        marginBottom: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 18,
        fontWeight: '600',
    },
    list: {
        padding: 16,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
    },
    habitName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    habitTarget: {
        fontSize: 14,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    checkInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    empty: {
        alignItems: 'center',
        marginTop: 60,
    },
});

export default HomeScreen;
