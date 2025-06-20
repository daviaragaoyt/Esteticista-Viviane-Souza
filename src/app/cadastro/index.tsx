// components/Register.tsx
import { Button } from "@/src/app/components/button";
import { api } from "@/src/services/api";
import { colors } from "@/src/styles/colors";

import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, ToastAndroid, View } from "react-native";

export default function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");

    const handleRegister = async () => {
        if (!nome || !email || !password || !dataNascimento) {
            ToastAndroid.show("Preencha todos os campos obrigatórios!", 2000);
            return;
        }
        try {
            const response = await api.post('/pessoa', {
                nome,
                email,
                senha: password,
                dataNascimento,
                telefone,
                endereco,
            });

            if (response.status === 201) {
                ToastAndroid.show("Cadastro realizado com sucesso!", 2000);
                router.push('/home'); // Redireciona para a tela de login
            }
        } catch (error) {
            ToastAndroid.show("Não foi possível realizar o cadastro.", 2000);
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
            <Text style={{ fontSize: 32, color: colors.purple[100] }}>
                Cadastro
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
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                />
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
                <TextInput
                    style={{
                        backgroundColor: colors.gray[100],
                        borderWidth: 1,
                        borderColor: colors.gray[300],
                        borderRadius: 8,
                        padding: 10,

                    }}
                    placeholder="Data de Nascimento (DD/MM/AAAA)"
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                />
                <TextInput
                    style={{
                        backgroundColor: colors.gray[100],
                        borderWidth: 1,
                        borderColor: colors.gray[300],
                        borderRadius: 8,
                        padding: 10,

                    }}
                    placeholder="Telefone"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={{
                        backgroundColor: colors.gray[100],
                        borderWidth: 1,
                        borderColor: colors.gray[300],
                        borderRadius: 8,
                        padding: 10,

                    }}
                    placeholder="Endereço"
                    value={endereco}
                    onChangeText={setEndereco}
                />
            </View>
            <Text onPress={() => router.push('/')} style={{ color: colors.purple[100], fontSize: 20, }}>
                Já possui conta? Entre já
            </Text>
            <Button style={{ width: 280, marginTop: 20 }} onPress={handleRegister}>
                <Text style={{ color: colors.gray[100], fontSize: 18, }}>Cadastrar</Text>
            </Button>
        </View>
    );
}