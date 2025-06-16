import { Button } from "@/src/app/components/button";
import { api } from "@/src/services/api";
import { colors } from "@/src/styles/colors";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios"; // Importe AxiosError para tipar o erro
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, ToastAndroid, View } from "react-native";
import { ForgotPasswordModal } from "./components/passwordModal";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            ToastAndroid.show("Preencha todos os campos!", 2000);
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/login', {
                email,
                senha: password,
            });

            console.log('Resposta da API:', response.data); // Adicione para debug

            // Verifique a estrutura real da resposta
            const userData = response.data.data?.pessoa || response.data.pessoa || response.data;

            if (!userData) {
                throw new Error('Estrutura de resposta inesperada');
            }

            // Armazena as informações
            await AsyncStorage.multiSet([
                ['userEmail', userData.email],
                ['userRole', userData.role],
                ['userId', userData.id.toString()]
            ]);

            ToastAndroid.show(`Bem-vindo(a), ${userData.email}`, 2000);

            // Redirecionamento
            switch (userData.role) {
                case "CLIENTE":
                    router.replace('/home');
                    break;
                case "PRESTADOR":
                    router.replace('/provider');
                    break;
                default:
                    ToastAndroid.show("Tipo de usuário desconhecido.", 2000);
                    await AsyncStorage.multiRemove(['userEmail', 'userRole', 'userId']);
            }
        } catch (error) {
            console.error('Erro no login:', error);

            if ((error as AxiosError).response) {
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    ToastAndroid.show("Email ou senha incorretos", 2000);
                } else if (axiosError.response?.status === 404) {
                    ToastAndroid.show("Usuário não encontrado", 2000);
                } else {
                    ToastAndroid.show("Erro ao conectar com o servidor", 2000);
                }
            } else {
                ToastAndroid.show("Erro ao fazer login", 2000);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Adicione esta função em seu componente ou em um arquivo de serviços
    // const handleLogout = async () => {
    //     try {
    //         // Limpa todos os dados de autenticação
    //         await AsyncStorage.multiRemove(['userEmail', 'userRole', 'userId']);

    //         ToastAndroid.show('Logout realizado com sucesso', 2000);
    //         router.replace('/'); // Redireciona para a tela de login
    //     } catch (error) {
    //         ToastAndroid.show('Erro ao fazer logout', 2000);
    //         console.error('Logout error:', error);
    //     }
    // };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
            <Text style={{ fontSize: 32, color: colors.purple[100] }}>
                Esteticista Viviane Souza
            </Text>
            <Text style={{ fontSize: 18, color: colors.purple[100] }}>
                Acesse sua conta !
            </Text>

            <View style={{ width: "90%", gap: 10, backgroundColor: colors.purple[100], borderRadius: 8, padding: 32 }}>
                <TextInput
                    style={{
                        backgroundColor: colors.gray[100],
                        borderWidth: 1,
                        borderColor: colors.gray[300],
                        borderRadius: 8,
                        padding: 10,

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

                    }}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <Text onPress={() => router.push('/cadastro')} style={{ color: colors.purple[100], fontSize: 20, marginTop: 10 }}>
                Crie uma conta!
            </Text>
            <Text
                onPress={() => setShowForgotPasswordModal(true)}
                style={{ color: colors.purple[100], fontSize: 20, }}
            >
                Esqueceu sua senha?
            </Text>
            <ForgotPasswordModal
                visible={showForgotPasswordModal}
                onClose={() => setShowForgotPasswordModal(false)}
            />
            <Button style={{ width: 280, marginTop: 20 }} onPress={handleLogin} disabled={isLoading}>
                <Text style={{ color: colors.gray[100], fontSize: 20, }}>
                    {isLoading ? "Carregando..." : "Entrar"}
                </Text>
            </Button>
        </View>
    );
}