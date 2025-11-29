import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import client from '../../api/client';
import Button from '../../components/Button';

const HabitsScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHabits = async () => {
        try {
            const res = await client.get('/habits');
            setHabits(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHabits();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Habit",
            "Are you sure you want to delete this habit?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await client.delete(`/habits/${id}`);
                            fetchHabits();
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={[styles.habitName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.habitCategory, { color: theme.textSecondary }]}>{item.category}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={{ color: theme.primary, fontSize: 12 }}>
                        {item.targetValue} {item.targetType === 'time' ? 'min' : 'times'}
                    </Text>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Text style={{ color: theme.error }}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>My Habits</Text>
                <Button
                    title="+ Add"
                    onPress={() => navigation.navigate('AddHabit')}
                    style={{ width: 80, height: 36 }}
                />
            </View>

            <FlatList
                data={habits}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchHabits} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.empty}>
                            <Text style={{ color: theme.textSecondary }}>No habits yet. Start by adding one!</Text>
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
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    list: {
        padding: 16,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    habitName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    habitCategory: {
        fontSize: 14,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        paddingTop: 12,
    },
    empty: {
        alignItems: 'center',
        marginTop: 40,
    },
});

export default HabitsScreen;
