// app/provider/appointments.tsx
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/src/services/api";
import { fontFamily, colors } from "@/src/styles/theme";

interface Agendamento {
    id: number;
    dataHora: string;
    servico: {
        nome: string;
    };
}

export default function ProviderAppointments() {
    const router = useRouter();
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/agendamento");
            if (response.status === 200) {
                setAgendamentos(response.data.data);
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar os agendamentos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancel = async (id: number) => {
        try {
            const response = await api.delete(`/agendamento/${id}`);
            if (response.status === 200) {
                Alert.alert("Sucesso", "Agendamento cancelado.");
                fetchAppointments();
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível cancelar o agendamento.");
        }
    };

    const renderAppointmentItem = ({ item }: { item: Agendamento }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.servico.nome}</Text>
            <Text style={styles.itemText}>{new Date(item.dataHora).toLocaleString()}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel(item.id)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Meus Agendamentos</Text>
            {isLoading ? (
                <Text style={styles.loadingText}>Carregando...</Text>
            ) : (
                <FlatList
                    data={agendamentos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAppointmentItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    header: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        color: colors.purple[100],
        marginBottom: 16,
    },
    loadingText: {
        fontFamily: fontFamily.regular,
        textAlign: "center",
    },
    item: {
        backgroundColor: "#f5f5f5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    itemText: {
        fontFamily: fontFamily.regular,
    },
    cancelButton: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 8,
        marginTop: 8,
    },
    cancelButtonText: {
        color: "#fff",
        fontFamily: fontFamily.bold,
        textAlign: "center",
    },
});
