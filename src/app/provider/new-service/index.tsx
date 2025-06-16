import { Button } from '@/src/app/components/button';
import { TabBar } from "@/src/app/components/tabbar";
import { api } from "@/src/services/api";
import { colors } from "@/src/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";

interface Servico {
    id?: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    imagem: string;
    prestadorId: number;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export default function ProviderServiceForm() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const isEditMode = params.id !== undefined;

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [duracao, setDuracao] = useState("");
    const [imagem, setImagem] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userID, setUserID] = useState<string | null>()

    const prestadorId = 16; // Substitua pela lógica real de obtenção do ID

    useEffect(() => {
        (async () => {
            const result = await AsyncStorage.getItem('userId')
            if (result) setUserID(result)
        })()
    }, [])

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
                        if (servico.imagem) {
                            setImagem(servico.imagem);
                        }
                    }
                } catch (error) {
                    ToastAndroid.show("Não foi possível carregar os dados do serviço.", 2000);
                }
            };
            fetchService();
        }
    }, [isEditMode, params.id]);

    const pickImage = async () => {
        try {
            // Solicitar permissão para acessar a galeria
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar uma imagem.');
                return;
            }

            // Abrir a galeria de imagens
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];

                if (selectedImage.base64) {
                    // Verificar tamanho da imagem
                    const imageSize = (selectedImage.base64.length * 3) / 4; // Tamanho aproximado em bytes

                    if (imageSize > MAX_IMAGE_SIZE) {
                        ToastAndroid.show('Imagem muito grande. Escolha uma menor que 2MB.', 2000);
                        return;
                    }

                    setImagem(selectedImage.base64);
                }
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            ToastAndroid.show('Erro ao processar imagem', 2000);
        }
    };

    const handleSubmit = async () => {
        if (!nome || !preco || !duracao) {
            ToastAndroid.show("Preencha os campos obrigatórios: nome, preço e duração.", 2000);
            return;
        }

        setIsLoading(true);

        try {
            const serviceData = {
                nome,
                descricao: descricao || null,
                preco: parseFloat(preco),
                duracao: parseInt(duracao),
                imagem,
                prestadorId: userID,
            };

            const endpoint = isEditMode
                ? `/servico/${params.id}`
                : '/servico';

            const method = isEditMode ? 'put' : 'post';

            const response = await api[method](endpoint, serviceData);

            if (response.status === 200 || response.status === 201) {
                ToastAndroid.show(
                    isEditMode ? "Serviço atualizado com sucesso!" : "Serviço criado com sucesso!",
                    2000
                );
                router.push("/provider/dashboard");
            }
        } catch (error: any) {
            console.error("Erro ao salvar serviço:", {
                message: error.message,
                response: error.response?.data,
            });

            ToastAndroid.show(
                error.response?.data?.message || "Erro ao salvar serviço. Tente novamente.",
                2000
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{isEditMode ? "Editar Serviço" : "Novo Serviço"}</Text>

            <TextInput
                placeholder="Nome *"
                value={nome}
                onChangeText={setNome}
                style={styles.input}
            />

            <TextInput
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
                style={styles.input}
                multiline
            />

            <TextInput
                placeholder="Preço *"
                value={preco}
                onChangeText={setPreco}
                style={styles.input}
                keyboardType="numeric"
            />

            <TextInput
                placeholder="Duração (minutos) *"
                value={duracao}
                onChangeText={setDuracao}
                style={styles.input}
                keyboardType="numeric"
            />

            <Button
                onPress={pickImage}
                style={styles.imageButton}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {imagem ? "Alterar Imagem" : "Adicionar Imagem"}
                </Text>
            </Button>

            {imagem && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${imagem}` }}
                        style={styles.previewImage}
                    />
                    <Button
                        onPress={() => setImagem(null)}
                        style={styles.removeImageButton}
                    >
                        <Text style={styles.buttonText}>Remover Imagem</Text>
                    </Button>
                </View>
            )}

            <Button
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={isLoading}
            >
                <Text style={styles.submitButtonText}>
                    {isLoading ? "Processando..." : isEditMode ? "Atualizar" : "Criar"}
                </Text>
            </Button>

            <TabBar />
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
        color: colors.purple[100]
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    imageButton: {
        backgroundColor: colors.purple[100],
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
    },
    imageContainer: {
        marginBottom: 12,
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    removeImageButton: {
        backgroundColor: colors.red.base,
        padding: 10,
        borderRadius: 8,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',

    },
    submitButton: {
        backgroundColor: colors.purple[100],
        padding: 12,
        borderRadius: 8,
        marginTop: 12
    },
    submitButtonText: {
        color: "#fff",

        textAlign: "center"
    },
});