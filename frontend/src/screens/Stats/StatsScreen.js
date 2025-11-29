import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import client from '../../api/client';
import Heatmap from '../../components/Heatmap';

const StatsScreen = () => {
    const { theme } = useTheme();
    const [heatmapData, setHeatmapData] = useState({});
    const [streakData, setStreakData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [heatmapRes, streakRes] = await Promise.all([
                client.get('/stats/heatmap'),
                client.get('/stats/streaks')
            ]);
            setHeatmapData(heatmapRes.data);
            setStreakData(streakRes.data);
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

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchData} />
            }
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Progress</Text>
            </View>

            <View style={[styles.card, { backgroundColor: theme.surface }]}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Activity Heatmap</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Last 3 months</Text>
                <Heatmap data={heatmapData} />
            </View>

            {/* Streaks Section */}
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
                <Text style={[styles.cardTitle, { color: theme.text, marginBottom: 12 }]}>Streaks</Text>
                {streakData.length > 0 ? (
                    streakData.map((streak) => (
                        <View key={streak.habitId} style={styles.streakRow}>
                            <Text style={[styles.streakHabit, { color: theme.text }]}>{streak.name}</Text>
                            <View style={styles.streakInfo}>
                                <View style={styles.streakItem}>
                                    <Text style={[styles.streakValue, { color: theme.primary }]}>
                                        {streak.currentStreak}
                                    </Text>
                                    <Text style={[styles.streakLabel, { color: theme.textSecondary }]}>
                                        Current
                                    </Text>
                                </View>
                                <View style={styles.streakDivider} />
                                <View style={styles.streakItem}>
                                    <Text style={[styles.streakValue, { color: theme.secondary }]}>
                                        {streak.longestStreak}
                                    </Text>
                                    <Text style={[styles.streakLabel, { color: theme.textSecondary }]}>
                                        Best
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={{ color: theme.textSecondary }}>
                        Start completing habits to build streaks!
                    </Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    card: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        marginTop: 0,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 8,
    },
    streakRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    streakHabit: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    streakInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    streakItem: {
        alignItems: 'center',
        minWidth: 50,
    },
    streakValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    streakLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
    },
    streakDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#ccc',
        marginHorizontal: 12,
    },
});

export default StatsScreen;
