import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import client from '../../api/client';
import Button from '../../components/Button';

const RoutinesScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRoutines = async () => {
        try {
            const res = await client.get('/routines');
            setRoutines(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRoutines();
        }, [])
    );

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Routine",
            "Are you sure you want to delete this routine?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await client.delete(`/routines/${id}`);
                            fetchRoutines();
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
                <Text style={[styles.routineName, { color: theme.text }]}>{item.name}</Text>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Text style={{ color: theme.error }}>Delete</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.habitsList}>
                {item.habits.map(habit => (
                    <View key={habit._id} style={[styles.habitChip, { backgroundColor: theme.background }]}>
                        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>{habit.name}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Routines</Text>
                <Button
                    title="+ Add"
                    onPress={() => navigation.navigate('AddRoutine')}
                    style={{ width: 80, height: 36 }}
                />
            </View>

            <FlatList
                data={routines}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchRoutines} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.empty}>
                            <Text style={{ color: theme.textSecondary }}>No routines yet.</Text>
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
        alignItems: 'center',
        marginBottom: 12,
    },
    routineName: {
        fontSize: 18,
        fontWeight: '600',
    },
    habitsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    habitChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    empty: {
        alignItems: 'center',
        marginTop: 40,
    },
});

export default RoutinesScreen;
