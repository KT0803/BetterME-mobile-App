import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import client from '../../api/client';

const CATEGORIES = ['Health', 'Study', 'Work', 'Personal'];
const TARGET_TYPES = ['count', 'time'];

const AddHabitScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Personal');
    const [targetType, setTargetType] = useState('count');
    const [targetValue, setTargetValue] = useState('1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!name) {
            setError('Please enter a habit name');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await client.post('/habits', {
                name,
                category,
                targetType,
                targetValue: parseInt(targetValue) || 1
            });
            navigation.goBack();
        } catch (err) {
            setError('Failed to create habit');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text style={[styles.title, { color: theme.text }]}>New Habit</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {error ? <Text style={[styles.error, { color: theme.error }]}>{error}</Text> : null}

                <Input
                    label="Habit Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g., Drink Water"
                />

                <Text style={[styles.label, { color: theme.text }]}>Category</Text>
                <View style={styles.row}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: category === cat ? theme.primary : theme.surface,
                                    borderColor: theme.border
                                }
                            ]}
                            onPress={() => setCategory(cat)}
                        >
                            <Text style={{ color: category === cat ? '#FFF' : theme.text }}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.label, { color: theme.text }]}>Target Type</Text>
                <View style={styles.row}>
                    {TARGET_TYPES.map(type => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: targetType === type ? theme.primary : theme.surface,
                                    borderColor: theme.border
                                }
                            ]}
                            onPress={() => setTargetType(type)}
                        >
                            <Text style={{ color: targetType === type ? '#FFF' : theme.text }}>
                                {type === 'time' ? 'Time (min)' : 'Count'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Input
                    label={targetType === 'time' ? 'Minutes per day' : 'Times per day'}
                    value={targetValue}
                    onChangeText={setTargetValue}
                    keyboardType="numeric"
                />

                <Button
                    title="Create Habit"
                    onPress={handleCreate}
                    loading={loading}
                    style={{ marginTop: 20 }}
                />
            </ScrollView>
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
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    error: {
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default AddHabitScreen;
