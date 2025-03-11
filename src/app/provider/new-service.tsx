// app/provider/new-service.tsx ou app/provider/edit-service/[id].tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "@/src/services/api";
import { fontFamily, colors } from "@/src/styles/theme";

interface Servico {
    id?: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    imagem: string;
    prestadorId: number;
}

export default function ProviderServiceForm() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEditMode = params.id !== undefined;

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [duracao, setDuracao] = useState("");
    const [imagem, setImagem] = useState("");

    // Supondo que o prestador autenticado tenha id 1
    const prestadorId = 1;

    useEffect(() => {
        if (isEditMode) {
            const fetchService = async () => {
                try {
                    const response = await api.get(`/servico/${params.id}`);
                    if (response.status === 200) {
                        const servico: Servico = response.data.data;
                        setNome(servico.nome);
                        setDescricao(servico.descricao || "");
                        setPreco(servico.preco.toString());
                        setDuracao(servico.duracao.toString());
                        setImagem(servico.imagem || "");
                    }
                } catch (error) {
                    Alert.alert("Erro", "Não foi possível carregar os dados do serviço.");
                }
            };
            fetchService();
        }
    }, [isEditMode, params.id]);

    const handleSubmit = async () => {
        if (!nome || !preco || !duracao) {
            Alert.alert("Erro", "Preencha os campos obrigatórios: nome, preço e duração.");
            return;
        }
        const serviceData = {
            nome,
            descricao,
            preco,
            duracao,
            imagem,
            prestadorId,
        };
        try {
            if (isEditMode) {
                const response = await api.put(`/servico/${params.id}`, serviceData);
                if (response.status === 200) {
                    Alert.alert("Sucesso", "Serviço atualizado com sucesso.");
                    router.push("/provider/dashboard");
                }
            } else {
                const response = await api.post("/servico", serviceData);
                if (response.status === 201) {
                    Alert.alert("Sucesso", "Serviço criado com sucesso.");
                    router.push("/provider/dashboard");
                }
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao salvar o serviço.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{isEditMode ? "Editar Serviço" : "Novo Serviço"}</Text>
            <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
            <TextInput placeholder="Descrição" value={descricao} onChangeText={setDescricao} style={styles.input} />
            <TextInput placeholder="Preço" value={preco} onChangeText={setPreco} style={styles.input} keyboardType="numeric" />
            <TextInput
                placeholder="Duração (minutos)"
                value={duracao}
                onChangeText={setDuracao}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput placeholder="Imagem (base64)" value={imagem} onChangeText={setImagem} style={styles.input} />
            {imagem ? (
                <Image source={{ uri: `data:image/jpeg;base64,${imagem}` }} style={styles.previewImage} />
            ) : null}
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>{isEditMode ? "Atualizar" : "Criar"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    header: { fontFamily: fontFamily.bold, fontSize: 24, marginBottom: 16, color: colors.purple[100] },
    input: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    submitButton: { backgroundColor: colors.purple[100], padding: 12, borderRadius: 8, marginTop: 12 },
    submitButtonText: { color: "#fff", fontFamily: fontFamily.bold, textAlign: "center" },
    previewImage: { width: 100, height: 100, marginBottom: 12 },
});
