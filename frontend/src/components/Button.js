import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Button = ({ title, onPress, loading, type = 'primary', style }) => {
    const { theme } = useTheme();

    const backgroundColor = type === 'primary' ? theme.primary : 'transparent';
    const textColor = type === 'primary' ? '#FFFFFF' : theme.primary;
    const borderColor = type === 'outline' ? theme.primary : 'transparent';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor, borderColor, borderWidth: type === 'outline' ? 1 : 0 },
                style
            ]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Button;
