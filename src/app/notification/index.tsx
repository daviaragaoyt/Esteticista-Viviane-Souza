import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNotifications } from '@/src/contexts/NotificationContext';
import { colors, fontFamily } from '@/src/styles/theme';
import { Feather } from '@expo/vector-icons';
import { Stack } from 'expo-router';

// Helper para escolher o ícone certo
const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
        case 'AGENDAMENTO_CRIADO':
            return <Feather name="calendar" size={24} color={colors.purple[100]} />;
        case 'AGENDAMENTO_CANCELADO':
            return <Feather name="x-circle" size={24} color={colors.red.base} />;
        case 'LEMBRETE_ANIVERSARIO':
            return <Feather name="gift" size={24} color={colors.purple[100]} />;
        default:
            return <Feather name="bell" size={24} color={colors.gray[500]} />;
    }
};

export default function NotificationsScreen() {
    const { notificacoes, isLoading, markAllAsRead, unreadCount } = useNotifications();

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.itemContainer, !item.lida && styles.unreadItem]}>
            <View style={styles.iconContainer}>
                {getNotificationIcon(item.tipo)}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.message}>{item.mensagem}</Text>
                <Text style={styles.date}>
                    {new Date(item.dataCriacao).toLocaleString('pt-BR')}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Notificações',
                    headerRight: () => (
                        unreadCount > 0 && (
                            <TouchableOpacity onPress={markAllAsRead} style={{ marginRight: 15 }}>
                                <Text style={{ color: colors.purple[100], fontFamily: fontFamily.medium }}>
                                    Marcar todas como lidas
                                </Text>
                            </TouchableOpacity>
                        )
                    ),
                }}
            />
            {isLoading && notificacoes.length === 0 ? (
                <ActivityIndicator size="large" color={colors.purple[100]} />
            ) : notificacoes.length === 0 ? (
                <Text style={styles.emptyText}>Você não tem nenhuma notificação.</Text>
            ) : (
                <FlatList
                    data={notificacoes}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    itemContainer: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[200],
        alignItems: 'center',
    },
    unreadItem: { backgroundColor: colors.purple[100] },
    iconContainer: { marginRight: 16 },
    textContainer: { flex: 1 },
    message: { fontFamily: fontFamily.regular, fontSize: 16, color: colors.gray[600] },
    date: { fontFamily: fontFamily.bold, fontSize: 12, color: colors.gray[500], marginTop: 4 },
    emptyText: { textAlign: 'center', marginTop: 50, fontFamily: fontFamily.regular, color: colors.gray[500] },
});