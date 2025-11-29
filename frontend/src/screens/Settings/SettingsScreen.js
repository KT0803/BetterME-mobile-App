import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, Alert, Clipboard } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import Button from '../../components/Button';

const SettingsScreen = () => {
    const { theme, isDark, toggleTheme } = useTheme();
    const { signOut, user } = useAuth();
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const [habits, routines, logs] = await Promise.all([
                client.get('/habits'),
                client.get('/routines'),
                client.get('/stats/heatmap') // Using heatmap as proxy for logs for now
            ]);

            const data = {
                user: user.username,
                exportedAt: new Date().toISOString(),
                habits: habits.data,
                routines: routines.data,
                activity: logs.data
            };

            const json = JSON.stringify(data, null, 2);

            Alert.alert(
                "Export Data",
                "Data ready. Copy to clipboard?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Copy",
                        onPress: () => {
                            Clipboard.setString(json);
                            Alert.alert("Success", "Data copied to clipboard");
                        }
                    }
                ]
            );
        } catch (err) {
            Alert.alert("Error", "Failed to export data");
        } finally {
            setExporting(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>
                <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: theme.primary }}
                        thumbColor={isDark ? '#fff' : '#f4f3f4'}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>
                <View style={[styles.row, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Username</Text>
                    <Text style={[styles.value, { color: theme.textSecondary }]}>{user?.username}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data</Text>
                <Button
                    title="Export Data (JSON)"
                    onPress={handleExport}
                    loading={exporting}
                    type="outline"
                />
            </View>

            <View style={styles.footer}>
                <Button
                    title="Sign Out"
                    onPress={signOut}
                    style={{ backgroundColor: theme.error, marginTop: 20 }}
                />
                <Text style={[styles.version, { color: theme.textSecondary }]}>BetterMe v1.0.0</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    label: {
        fontSize: 16,
    },
    value: {
        fontSize: 16,
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
    },
    version: {
        marginTop: 16,
        fontSize: 12,
    },
});

export default SettingsScreen;
