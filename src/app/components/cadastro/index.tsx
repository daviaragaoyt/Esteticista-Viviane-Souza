// components/Register.tsx
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Button } from "@/src/app/components/button";
import { router } from "expo-router";
import { colors } from "@/src/styles/colors";
import { fontFamily } from "@/src/styles/font-family";
import { api } from "@/src/services/api";

export default function Register() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");

    const handleRegister = async () => {
        if (!nome || !email || !password || !dataNascimento) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
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
                role: 'CLIENTE', // Define a role padrão como CLIENTE
            });

            if (response.status === 201) {
                Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
                router.push('/home'); // Redireciona para a tela de login
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível realizar o cadastro.");
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: 32, color: colors.purple[100] }}>
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
                        fontFamily: fontFamily.regular,
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
                <TextInput
                    style={{
                        backgroundColor: colors.gray[100],
                        borderWidth: 1,
                        borderColor: colors.gray[300],
                        borderRadius: 8,
                        padding: 10,
                        fontFamily: fontFamily.regular,
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
                        fontFamily: fontFamily.regular,
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
                        fontFamily: fontFamily.regular,
                    }}
                    placeholder="Endereço"
                    value={endereco}
                    onChangeText={setEndereco}
                />
            </View>

            <Button style={{ width: 280, marginTop: 20 }} onPress={handleRegister}>
                <Text style={{ color: colors.gray[100], fontSize: 18, fontFamily: fontFamily.bold }}>Cadastrar</Text>
            </Button>

            <Button style={{ width: 280, marginTop: 10 }} onPress={() => router.push('../components/login')}>
                <Text style={{ color: colors.gray[100], fontSize: 20, fontFamily: fontFamily.bold }}>Voltar para Login</Text>
            </Button>
        </View>
    );
}