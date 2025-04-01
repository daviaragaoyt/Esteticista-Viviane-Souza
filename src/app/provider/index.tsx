// app/provider/appointments.tsx
import { api } from "@/src/services/api";
import { colors, fontFamily } from "@/src/styles/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { TabBar } from "../components/tabbar";
import { FloatingActionButton } from "../components/floatinActionButton";

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
            ToastAndroid.show("Não foi possível carregar os agendamentos.", 2000);
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
                ToastAndroid.show("Sucesso", 2000);
                fetchAppointments();
            }
        } catch (error) {
            ToastAndroid.show("Não foi possível cancelar o agendamento.", 2000);
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
    console.log('Aqui:', handleCancel)

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
            <TabBar />
            <FloatingActionButton />
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
        marginBottom: 8,
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
