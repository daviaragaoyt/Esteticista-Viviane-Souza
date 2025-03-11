import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Button } from "@/src/app/components/button";
import { IconEye, IconEyeOff } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { colors } from "@/src/styles/colors";
import { fontFamily } from "@/src/styles/font-family";
import { api } from "@/src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios"; // Importe AxiosError para tipar o erro

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos!");
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/login', {
                email,
                senha: password,
            });

            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data.data;

                // Armazena os tokens no AsyncStorage
                await AsyncStorage.setItem('accessToken', accessToken);
                await AsyncStorage.setItem('refreshToken', refreshToken);

                Alert.alert("Sucesso", `Login efetuado para: ${email}`);
                router.push('/home'); // Redireciona para a tela inicial
            }
        } catch (error) {
            // Tipagem do erro
            const axiosError = error as AxiosError<{
                message?: string;
                status?: string;
            }>;

            if (axiosError.response) {
                // Erro retornado pelo backend
                if (axiosError.response.status === 404) {
                    Alert.alert("Erro", "Usuário não encontrado.");
                } else if (axiosError.response.status === 401) {
                    Alert.alert("Erro", "Senha incorreta.");
                } else {
                    Alert.alert("Erro", "Ocorreu um erro ao fazer login.");
                }
            } else if (axiosError.request) {
                // Erro de rede (requisição não chegou ao backend)
                Alert.alert("Erro", "Sem resposta do servidor. Verifique sua conexão.");
            } else {
                // Outros erros
                Alert.alert("Erro", "Ocorreu um erro inesperado.");
            }
            console.error(axiosError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 24, color: colors.purple[100] }}>
                Estiticista Viviane Souza
            </Text>
            <Text style={{ fontFamily: fontFamily.regular, fontSize: 16, color: colors.gray[600] }}>
                Faça login ou crie sua conta aqui
            </Text>

            <View style={{ width: "90%", gap: 10, backgroundColor: colors.purple[100], borderRadius: 8, padding: 32 }}>
                <TextInput
                    style={{
                        backgroundColor: colors.gray[100],
                        borderWidth: 1,
                        borderColor: colors.gray[300],
                        borderRadius: 8,
                        padding: 10,
                        fontFamily: fontFamily.regular,
                    }}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={{
                        backgroundColor: colors.gray[100],
                        borderWidth: 1,
                        borderColor: colors.gray[300],
                        borderRadius: 8,
                        padding: 10,
                        fontFamily: fontFamily.regular,
                    }}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />



            </View>

            <Button style={{ width: 280, marginTop: 20 }} onPress={handleLogin} disabled={isLoading}>
                <Text style={{ color: colors.gray[100], fontSize: 20, fontFamily: fontFamily.bold }}>
                    {isLoading ? "Carregando..." : " Entrar "}
                </Text>
            </Button>

            <Button style={{ width: 280, marginTop: 10 }} onPress={() => router.push('/components/cadastro')}>
                <Text style={{ color: colors.gray[100], fontSize: 20, fontFamily: fontFamily.bold }}> Criar Conta </Text>
            </Button>
        </View>
    );
}