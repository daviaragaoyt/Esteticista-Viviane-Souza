import { api } from "@/src/services/api";
import { colors, fontFamily } from "@/src/styles/theme";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, ScrollView } from "react-native";

interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    imagem: string | null;
}

const availability: Record<string, string[]> = {
    Segunda: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    Terça: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    Quarta: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    Quinta: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    Sexta: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
    Sábado: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
};

export default function ServiceDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [servico, setServico] = useState<Servico | null>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchServico = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/servico/${id}`);
            if (response.status === 200) {
                setServico(response.data.data);
            }
        } catch (error) {
            ToastAndroid.show("Não foi possível carregar os detalhes do serviço.", 2000);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchServico();
    }, [id]);

    const handleConfirm = async () => {
        if (selectedDay && selectedTime && servico) {
            try {
                // Criar data no formato correto
                const [hours, minutes] = selectedTime.split(':').map(Number);
                const dataHora = new Date();
                dataHora.setHours(hours, minutes, 0, 0);

                // Verificar se a data é válida
                if (isNaN(dataHora.getTime())) {
                    ToastAndroid.show("Horário selecionado é inválido", 2000);
                    return;
                }

                const agendamentoData = {
                    dataHora: dataHora.toISOString(), // Enviar como ISO string
                    clienteId: 1, // Substitua pelo ID do cliente logado
                    servicoId: servico.id,
                };

                const response = await api.post('/agendamento', agendamentoData);
                if (response.status === 201) {
                    ToastAndroid.show("Agendamento realizado com sucesso!", 2000);
                    router.push("/loading");
                }
            } catch (error) {
                if (error instanceof Error && 'response' in error) {
                    console.error('Erro detalhado:', (error.response as any)?.data || error.message);
                    ToastAndroid.show(
                        (error.response as any)?.data?.message || "Não foi possível confirmar o agendamento.",
                        2000
                    );
                } else {
                    console.error('Erro desconhecido:', error);
                    ToastAndroid.show("Erro desconhecido ao confirmar o agendamento.", 2000);
                }
            }
        } else {
            ToastAndroid.show("Por favor, selecione um dia e um horário.", 2000);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (!servico) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Serviço não encontrado.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <IconArrowLeft color={colors.gray[100]} size={24} />
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                {servico.imagem ? (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${servico.imagem}` }}
                        style={styles.serviceImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.serviceImage, styles.noImage]}>
                        <Text style={styles.noImageText}>Sem imagem</Text>
                    </View>
                )}
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{servico.nome}</Text>
                <Text style={styles.description}>{servico.descricao || "Sem descrição"}</Text>

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Preço:</Text>
                        <Text style={styles.infoValue}>{`R$ ${servico.preco.toFixed(2)}`}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Duração:</Text>
                        <Text style={styles.infoValue}>{`${servico.duracao} minutos`}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.availabilityContainer}>
                <Text style={styles.sectionTitle}>Escolha um dia:</Text>
                <View style={styles.gridContainer}>
                    {Object.keys(availability).map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[
                                styles.dayButton,
                                selectedDay === day && styles.selectedButton
                            ]}
                            onPress={() => {
                                setSelectedDay(day);
                                setSelectedTime(null);
                            }}
                        >
                            <Text style={styles.dayText}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedDay && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Horários disponíveis para {selectedDay}:
                        </Text>
                        <View style={styles.gridContainer}>
                            {availability[selectedDay].map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeButton,
                                        selectedTime === time && styles.selectedButton
                                    ]}
                                    onPress={() => setSelectedTime(time)}
                                >
                                    <Text style={styles.timeText}>{time}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {selectedDay && selectedTime && (
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleConfirm}
                    >
                        <Text style={styles.confirmButtonText}>
                            Confirmar Agendamento
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.gray[600],
    },
    errorText: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.gray[600],
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: colors.purple[100],
        padding: 8,
        borderRadius: 20,
        zIndex: 10,
    },
    imageContainer: {
        height: 250,
        width: '100%',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
    },
    noImage: {
        backgroundColor: colors.gray[200],
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.gray[500],
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        color: colors.purple[100],
        marginBottom: 10,
    },
    description: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: colors.gray[600],
        marginBottom: 20,
        lineHeight: 24,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoLabel: {
        fontFamily: fontFamily.medium,
        fontSize: 16,
        color: colors.gray[600],
        marginRight: 5,
    },
    infoValue: {
        fontFamily: fontFamily.bold,
        fontSize: 16,
        color: colors.purple[100],
    },
    availabilityContainer: {
        padding: 20,
        backgroundColor: '#fff',

        alignItems: 'center'
    },
    sectionTitle: {
        fontFamily: fontFamily.bold,
        fontSize: 18,
        color: colors.purple[100],
        marginBottom: 15,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    dayButton: {
        backgroundColor: colors.gray[400],
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    timeButton: {
        backgroundColor: colors.gray[400],
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    selectedButton: {
        backgroundColor: colors.purple[100],
    },
    dayText: {
        fontFamily: fontFamily.medium,
        fontSize: 16,
        color: 'white',
    },
    timeText: {
        fontFamily: fontFamily.medium,
        fontSize: 14,
        color: 'white',
    },
    confirmButton: {
        width: '110%',
        height: '20%',
        backgroundColor: colors.purple[100],
        padding: 16,
        borderRadius: 8,
        textAlign: 'center',
        alignItems: "center",
        marginTop: 10,
    },
    confirmButtonText: {
        fontFamily: fontFamily.bold,
        fontSize: 24,
        marginTop: 10,
        color: "#fff",
    },
});