import { Button } from "@/src/app/components/button";
import { api } from "@/src/services/api";
import { colors } from "@/src/styles/colors";
import { fontFamily } from "@/src/styles/font-family";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios"; // Importe AxiosError para tipar o erro
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, ToastAndroid, View } from "react-native";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

            if (response.status === 200) {
                const { accessToken, refreshToken, user } = response.data.data;

                // Armazena os tokens e o role no AsyncStorage
                await AsyncStorage.setItem('accessToken', accessToken);
                await AsyncStorage.setItem('refreshToken', refreshToken);
                await AsyncStorage.setItem('Role', user.role);

                ToastAndroid.show(`Login efetuado para: ${email}`, 2000);

                // Redireciona com base no role
                if (user.role === "CLIENTE") {
                    router.replace('/home'); // Tela do cliente
                } else if (user.role === "PRESTADOR") {
                    router.replace('/provider'); // Tela do prestador
                } else {
                    ToastAndroid.show("Tipo de usuário desconhecido.", 2000);
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError<{
                message?: string;
                status?: string;
            }>;

            if (axiosError.response) {
                if (axiosError.response.status === 404) {
                    ToastAndroid.show("Usuário não encontrado.", 2000);
                } else if (axiosError.response.status === 401) {
                    ToastAndroid.show("Senha incorreta.", 2000);
                } else {
                    ToastAndroid.show("Ocorreu um erro ao fazer login.", 2000);
                }
            } else if (axiosError.request) {
                ToastAndroid.show("Sem resposta do servidor. Verifique sua conexão.", 2000);
            } else {
                ToastAndroid.show("Ocorreu um erro inesperado.", 2000);
            }
            console.error(axiosError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 32, color: colors.purple[100] }}>
                Esteticista Viviane Souza
            </Text>
            <Text style={{ fontFamily: fontFamily.medium, fontSize: 18, color: colors.purple[100] }}>
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
            <Text onPress={() => router.push('/cadastro')} style={{ color: colors.purple[100], fontSize: 20, fontFamily: fontFamily.bold }}>
                Não possui conta? Crie já
            </Text>
            <Button style={{ width: 280, marginTop: 20 }} onPress={handleLogin} disabled={isLoading}>
                <Text style={{ color: colors.gray[100], fontSize: 20, fontFamily: fontFamily.bold }}>
                    {isLoading ? "Carregando..." : "Entrar"}
                </Text>
            </Button>
        </View>
    );
}