import { api } from "@/src/services/api";
import { colors } from "@/src/styles/theme";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { TabBar } from "../../components/tabbar";
import { FloatingActionButton } from "../../components/floatinActionButton";

interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    imagem: string | null;
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
    const [refreshing, setRefreshing] = useState(false);

    const providerId = 1; // Substitua pela lógica real de obtenção do ID

    const fetchServices = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/servico");
            console.log('Resposta da API:', response.data); // Para debug
            if (response.status === 200) {
                setServicos(response.data.data);
            }
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            ToastAndroid.show("Não foi possível carregar os serviços.", 2000);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchServices();
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await api.delete(`/servico/${id}`);
            if (response.status === 200) {
                ToastAndroid.show("Serviço removido com sucesso", 2000);
                fetchServices();
            }
        } catch (error) {
            ToastAndroid.show("Não foi possível deletar o serviço.", 2000);
            console.error(error);
        }
    };

    const renderItem = ({ item }: { item: Servico }) => (
        <View style={styles.itemContainer}>
            {item.imagem ? (
                <Image
                    source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
                    style={styles.itemImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={[styles.itemImage, styles.noImage]}>
                    <Text style={styles.noImageText}>Sem imagem</Text>
                </View>
            )}
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                    {item.descricao || "Sem descrição"}
                </Text>
                <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>{`R$ ${item.preco.toFixed(2)}`}</Text>
                    <Text style={styles.itemDuration}>{`${item.duracao} min`}</Text>
                </View>
            </View>
            <View style={styles.itemButtons}>
                <TouchableOpacity
                    onPress={() => router.push(`/provider/edit-service/${item.id}` as any)}
                    style={styles.editButton}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.deleteButton}
                >
                    <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Meus Serviços</Text>

            {isLoading && !refreshing ? (
                <Text style={styles.loadingText}>Carregando...</Text>
            ) : servicos.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum serviço cadastrado</Text>
            ) : (
                <FlatList
                    data={servicos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    contentContainerStyle={styles.listContent}
                />
            )}

            <TabBar />
            <FloatingActionButton onPress={() => router.push("/provider/new-service")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff"
    },
    header: {

        fontSize: 24,
        marginBottom: 30,
        textAlign: 'center',
        marginTop: 30,
        color: colors.purple[100],
    },
    listContent: {
        paddingBottom: 80,
    },
    loadingText: {

        textAlign: "center",
        marginTop: 20,
    },
    emptyText: {

        textAlign: "center",
        marginTop: 20,
        color: colors.gray[500],
    },
    itemContainer: {
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    noImage: {
        backgroundColor: colors.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {

        fontSize: 12,
        color: colors.gray[500],
    },
    itemContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemTitle: {

        fontSize: 16,
        color: colors.purple[100],
        marginBottom: 4,
    },
    itemDescription: {

        fontSize: 14,
        color: colors.gray[600],
        marginBottom: 8,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemPrice: {

        fontSize: 16,
        color: colors.purple[100],
    },
    itemDuration: {

        fontSize: 14,
        color: colors.gray[500],
    },
    itemButtons: {
        flexDirection: "column",
        marginLeft: 8,
    },
    editButton: {
        backgroundColor: colors.purple[100],
        padding: 8,
        borderRadius: 6,
        marginBottom: 6,
        minWidth: 70,
    },
    deleteButton: {
        backgroundColor: colors.red.base,
        padding: 8,
        borderRadius: 6,
        minWidth: 70,
    },
    buttonText: {
        color: "#fff",

        fontSize: 14,
        textAlign: 'center',
    },
});