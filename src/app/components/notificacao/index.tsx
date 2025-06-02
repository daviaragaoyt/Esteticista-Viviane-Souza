import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/src/styles/theme';
import { useNotifications } from '../../../contexts/NotificationContext';
import { useRouter } from 'expo-router';

export const NotificationIcon = () => {
    const { unreadCount } = useNotifications();
    const router = useRouter();

    const handlePress = () => {
        // Navega para a nova tela de notificações que criaremos a seguir
        router.push('../../notification');
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <Feather name="bell" size={28} color={colors.gray[400]} />
            {unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.red.base,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});