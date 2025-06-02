import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { api } from '../services/api';
// Assuma que você tem um contexto de autenticação ou uma forma de pegar o ID do usuário


// Tipos baseados no seu schema.prisma
interface Notificacao {
    id: number;
    mensagem: string;
    lida: boolean;
    tipo: 'AGENDAMENTO_CRIADO' | 'AGENDAMENTO_CANCELADO' | 'LEMBRETE_ANIVERSARIO';
    dataCriacao: string;
    remetente?: { nome: string };
}

interface NotificationContextData {
    notificacoes: Notificacao[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (notificationId: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextData | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // IMPORTANTE: Obtenha o ID do usuário logado aqui.
    // Pode ser de um AuthContext, AsyncStorage, etc.
    // const { user } = useAuth();
    // const userId = user?.id;
    const userId = 1; // SUBSTITUA ESTE VALOR FIXO!

    const fetchNotifications = async () => {
        if (!userId) return; // Não faz nada se não houver usuário logado

        setIsLoading(true);
        try {
            const response = await api.get(`/notificacoes/usuario/${userId}`);
            const data: Notificacao[] = response.data.data;
            setNotificacoes(data);
            setUnreadCount(data.filter(n => !n.lida).length);
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId: number) => {
        // Atualização otimista para UI mais rápida
        setNotificacoes(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, lida: true } : n))
        );
        setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));

        try {
            await api.patch(`/notificacoes/${notificationId}/ler`);
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
            fetchNotifications(); // Reverte em caso de erro
        }
    };

    const markAllAsRead = async () => {
        if (!userId) return;
        setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
        setUnreadCount(0);

        try {
            await api.patch(`/notificacoes/usuario/${userId}/ler-todas`);
        } catch (error) {
            console.error('Erro ao marcar todas como lidas:', error);
            fetchNotifications(); // Reverte em caso de erro
        }
    };

    useEffect(() => {
        if (userId) {
            fetchNotifications(); // Busca inicial
            const intervalId = setInterval(fetchNotifications, 30000); // Polling a cada 30 segundos
            return () => clearInterval(intervalId); // Limpeza
        }
    }, [userId]);

    return (
        <NotificationContext.Provider
            value={{ notificacoes, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};