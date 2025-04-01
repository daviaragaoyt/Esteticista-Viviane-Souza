import { useState } from "react";
import { Modal, View, Text, TextInput, ToastAndroid, TouchableOpacity } from "react-native";
import { api } from "@/src/services/api";
import { colors } from "@/src/styles/theme";
import { fontFamily } from "@/src/styles/font-family";
import { Button } from "@/src/app/components/button";

interface ForgotPasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

export function ForgotPasswordModal({ visible, onClose }: ForgotPasswordModalProps) {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState<"email" | "password">("email");
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyEmail = async () => {
        if (!email) {
            ToastAndroid.show("Por favor, informe seu email", 2000);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/pessoa/verify-email-for-reset', { email });

            if (response.data.status === 'success') {
                setStep("password");
                ToastAndroid.show("Email verificado com sucesso", 2000);
            } else {
                ToastAndroid.show(response.data.message || "Email não encontrado", 2000);
            }
        } catch (error) {
            ToastAndroid.show("Erro ao verificar email", 2000);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword) {
            ToastAndroid.show("Por favor, informe a nova senha", 2000);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/pessoa/update-password', {
                email,
                newPassword
            });

            if (response.data.status === 'success') {
                ToastAndroid.show("Senha atualizada com sucesso!", 2000);
                onClose();
            } else {
                ToastAndroid.show(response.data.message || "Erro ao atualizar senha", 2000);
            }
        } catch (error) {
            ToastAndroid.show("Erro ao atualizar senha", 2000);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.8)'
            }}>
                <View style={{
                    width: '90%',
                    height: "35%",
                    backgroundColor: 'white',
                    borderRadius: 10,
                    padding: 30
                }}>
                    <Text style={{
                        fontFamily: fontFamily.bold,
                        fontSize: 25,
                        color: colors.purple[100],
                        marginBottom: 30,
                        textAlign: 'center'
                    }}>
                        {step === "email" ? "Recuperação de Senha" : "Criar Nova Senha"}
                    </Text>

                    {step === "email" ? (
                        <>
                            <Text style={{
                                fontFamily: fontFamily.bold,
                                marginBottom: 20,
                                color: colors.purple[100]
                            }}>
                                Informe seu email cadastrado:
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: colors.gray[100],
                                    borderWidth: 1,
                                    borderColor: colors.gray[300],
                                    borderRadius: 8,
                                    padding: 10,
                                    fontFamily: fontFamily.regular,
                                    marginBottom: 30
                                }}
                                placeholder="Seu email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </>
                    ) : (
                        <>
                            <Text style={{
                                fontFamily: fontFamily.regular,
                                marginBottom: 10,
                                color: colors.gray[500]
                            }}>
                                Crie uma nova senha:
                            </Text>
                            <TextInput
                                style={{
                                    backgroundColor: colors.gray[100],
                                    borderWidth: 1,
                                    borderColor: colors.gray[300],
                                    borderRadius: 8,
                                    padding: 10,
                                    fontFamily: fontFamily.regular,
                                    marginBottom: 20
                                }}
                                placeholder="Nova senha"
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                            />
                        </>
                    )}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button
                            style={{ flex: 1, marginRight: 10, backgroundColor: 'red' }}
                            onPress={onClose}

                        >
                            <Text style={{ color: colors.gray[100], fontFamily: fontFamily.bold }}>
                                Cancelar
                            </Text>

                        </Button>

                        <Button
                            style={{ backgroundColor: colors.purple[100], flex: 1 }}
                            onPress={step === "email" ? handleVerifyEmail : handleResetPassword}
                            disabled={isLoading}
                        >
                            <Text style={{ color: colors.gray[100], fontFamily: fontFamily.bold }}>
                                {isLoading ? "Carregando..." : step === "email" ? "Continuar" : "Redefinir Senha"}
                            </Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}