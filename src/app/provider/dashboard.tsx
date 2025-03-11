// app/provider/dashboard.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/src/services/api";
import { fontFamily, colors } from "@/src/styles/theme";

interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    imagem: string;
    prestadorId: number;
    prestador: {
        id: number;
        nome: string;
    };
}

export default function ProviderDashboard() {
    const router = useRouter();
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Supondo que o prestador autenticado tenha id 1 (substitua pelo valor real do seu contexto)
    const providerId = 1;

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/servico");
            if (response.status === 200) {
                // Filtra somente os serviços do prestador autenticado
                const allServices: Servico[] = response.data.data;
                const myServices = allServices.filter(
                    (service) => service.prestador && service.prestador.id === providerId
                );
                setServicos(myServices);
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar os serviços.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await api.delete(`/servico/${id}`);
            if (response.status === 200) {
                Alert.alert("Sucesso", "Serviço deletado com sucesso.");
                fetchServices();
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível deletar o serviço.");
        }
    };

    const renderItem = ({ item }: { item: Servico }) => (
        <View style={styles.itemContainer}>
            {item.imagem ? (
                <Image source={{ uri: `data:image/jpeg;base64,${item.imagem}` }} style={styles.itemImage} />
            ) : null}
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text style={styles.itemDescription}>{item.descricao}</Text>
                <Text style={styles.itemPrice}>{`R$ ${item.preco.toFixed(2)}`}</Text>
            </View>
            <View style={styles.itemButtons}>
                <TouchableOpacity
                    onPress={() => router.push(`/provider/edit-service/${item.id}` as any)}
                    style={styles.editButton}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Meus Serviços</Text>
            <TouchableOpacity onPress={() => router.push("/provider/new-service")} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Novo Serviço</Text>
            </TouchableOpacity>
            {isLoading ? (
                <Text style={styles.loadingText}>Carregando...</Text>
            ) : (
                <FlatList data={servicos} keyExtractor={(item) => item.id.toString()} renderItem={renderItem} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    header: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        marginBottom: 16,
        color: colors.purple[100],
    },
    addButton: {
        backgroundColor: colors.purple[100],
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    addButtonText: { color: "#fff", fontFamily: fontFamily.bold, textAlign: "center" },
    loadingText: { fontFamily: fontFamily.regular, textAlign: "center" },
    itemContainer: {
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 8 },
    itemContent: { flex: 1 },
    itemTitle: { fontFamily: fontFamily.bold, fontSize: 18, color: colors.purple[100] },
    itemDescription: { fontFamily: fontFamily.regular, fontSize: 14, color: "#666" },
    itemPrice: { fontFamily: fontFamily.bold, fontSize: 16, color: colors.purple[100] },
    itemButtons: { flexDirection: "column" },
    editButton: { backgroundColor: "blue", padding: 8, borderRadius: 8, marginBottom: 4 },
    deleteButton: { backgroundColor: "red", padding: 8, borderRadius: 8 },
    buttonText: { color: "#fff", fontFamily: fontFamily.bold },
});
