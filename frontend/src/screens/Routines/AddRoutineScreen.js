import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import client from '../../api/client';

const AddRoutineScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [habits, setHabits] = useState([]);
    const [selectedHabits, setSelectedHabits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHabits();
    }, []);

    const fetchHabits = async () => {
        try {
            const res = await client.get('/habits');
            setHabits(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const toggleHabit = (id) => {
        if (selectedHabits.includes(id)) {
            setSelectedHabits(selectedHabits.filter(h => h !== id));
        } else {
            setSelectedHabits([...selectedHabits, id]);
        }
    };

    const handleCreate = async () => {
        if (!name) {
            setError('Please enter a routine name');
            return;
        }

        if (selectedHabits.length === 0) {
            setError('Please select at least one habit');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await client.post('/routines', {
                name,
                habits: selectedHabits
            });
            navigation.goBack();
        } catch (err) {
            setError('Failed to create routine');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text style={[styles.title, { color: theme.text }]}>New Routine</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

                <Input
                    label="Routine Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Morning Routine"
                />

                <Text style={[styles.label, { color: theme.text }]}>Select Habits</Text>
                <FlatList
                    data={habits}
                    keyExtractor={item => item._id}
                    style={styles.list}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.habitItem,
                                {
                                    backgroundColor: theme.surface,
                                    borderColor: selectedHabits.includes(item._id) ? theme.primary : theme.border
                                }
                            ]}
                            onPress={() => toggleHabit(item._id)}
                        >
                            <Text style={{ color: theme.text }}>{item.name}</Text>
                            {selectedHabits.includes(item._id) && (
                                <View style={[styles.check, { backgroundColor: theme.primary }]} />
                            )}
                        </TouchableOpacity>
                    )}
                />

                <Button
                    title="Create Routine"
                    onPress={handleCreate}
                    loading={loading}
                    style={{ marginTop: 20 }}
                />
            </View>
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
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
        flex: 1,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    list: {
        flex: 1,
        marginBottom: 20,
    },
    habitItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 8,
    },
    check: {
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    error: {
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default AddRoutineScreen;
