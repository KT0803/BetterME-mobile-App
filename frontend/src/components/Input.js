import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Input = ({ label, error, ...props }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.surface,
                        color: theme.text,
                        borderColor: error ? theme.error : theme.border
                    }
                ]}
                placeholderTextColor={theme.textSecondary}
                {...props}
            />
            {error && <Text style={[styles.error, { color: theme.error }]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    error: {
        marginTop: 4,
        fontSize: 12,
    },
});

export default Input;
