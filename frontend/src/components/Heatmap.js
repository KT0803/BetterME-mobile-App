import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

const Heatmap = ({ data }) => {
    const { theme } = useTheme();

    // Generate last 12 weeks of dates
    const today = new Date();
    const startDate = subDays(today, 84); // 12 weeks
    const dates = eachDayOfInterval({ start: startDate, end: today });

    const getColor = (count) => {
        if (!count) return theme.surface;
        if (count === 1) return 'rgba(74, 144, 226, 0.4)';
        if (count === 2) return 'rgba(74, 144, 226, 0.6)';
        if (count === 3) return 'rgba(74, 144, 226, 0.8)';
        return theme.primary;
    };

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {dates.map((date, index) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const count = data[dateStr] || 0;

                    return (
                        <View
                            key={dateStr}
                            style={[
                                styles.cell,
                                {
                                    backgroundColor: getColor(count),
                                    borderColor: theme.background
                                }
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: 12,
        height: 12,
        borderRadius: 2,
        margin: 2,
        borderWidth: 1,
    },
});

export default Heatmap;
