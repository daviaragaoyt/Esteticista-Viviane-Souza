import { api } from "@/src/services/api";
import { colors, fontFamily } from "@/src/styles/theme";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";

// Atualizando a interface para utilizar o campo "foto"
interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
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
        if (selectedDay && selectedTime) {
            try {
                const dataHora = moment().set({
                    hour: parseInt(selectedTime.split(':')[0]),
                    minute: parseInt(selectedTime.split(':')[1]),
                    second: 0,
                }).format('DD/MM/YYYY:HH:mm');

                const agendamentoData = {
                    dataHora,
                    clienteId: 1, // Substitua pelo ID do cliente logado
                    servicoId: parseInt(id as string),
                };

                const response = await api.post('/agendamento', agendamentoData);
                if (response.status === 201) {
                    ToastAndroid.show("Sucesso", 2000);
                    router.back();
                }
            } catch (error) {
                ToastAndroid.show("Não foi possível confirmar o agendamento.", 2000);
                console.error(error);
            }
        } else {
            ToastAndroid.show("Por favor, selecione um dia e um horári,2000o.", 2000);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (!servico) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Serviço não encontrado.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <IconArrowLeft color={colors.gray[100]} />
            </TouchableOpacity>

            <Image
                source={{ uri: `data:image/jpeg;base64,${servico.imagem}` }}
                style={styles.serviceImage}
            />

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>{servico.nome}</Text>
                <Text style={styles.description}>{servico.descricao}</Text>
                <Text style={styles.price}>{`R$ ${servico.preco.toFixed(2)}`}</Text>
            </View>

            <View style={styles.availabilityContainer}>
                <Text style={styles.sectionTitle}>Escolha um dia:</Text>
                <View style={styles.gridContainer}>
                    {Object.keys(availability).map((day) => (
                        <TouchableOpacity
                            key={day}
                            style={[styles.dayButton, selectedDay === day && styles.selectedButton]}
                            onPress={() => { setSelectedDay(day); setSelectedTime(null); }}
                        >
                            <Text style={styles.dayText}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {selectedDay && (
                    <View style={styles.timesContainer}>
                        <Text style={styles.sectionTitle}>Horários disponíveis para {selectedDay}:</Text>
                        <View style={styles.gridContainer}>
                            {availability[selectedDay].map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[styles.timeButton, selectedTime === time && styles.selectedButton]}
                                    onPress={() => setSelectedTime(time)}
                                >
                                    <Text style={styles.timeText}>{time}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {selectedDay && selectedTime && (
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        paddingTop: 40,
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: colors.purple[100],
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
        zIndex: 10,
    },
    serviceImage: {
        position: 'absolute',
        width: '100%',
        height: '40%',
        resizeMode: "cover",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    detailsContainer: {
        gap: 10,
        padding: 30,
        width: "90%",
        marginTop: 280,
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 22,
        color: colors.purple[100],
        marginBottom: 0,
    },
    description: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: "#666",
        marginBottom: 0,
    },
    price: {
        fontFamily: fontFamily.bold,
        fontSize: 20,
        color: colors.purple[100],
        marginBottom: 0,
    },
    availabilityContainer: {
        flex: 1,
        width: "90%",
        marginTop: 20,
    },
    sectionTitle: {
        fontFamily: fontFamily.bold,
        fontSize: 18,
        color: colors.purple[100],
        marginBottom: 10,
        textAlign: "center",
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: 'center',
        justifyContent: "center",
    },
    dayButton: {
        backgroundColor: colors.purple[100],
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        margin: 5,
    },
    selectedButton: {
        backgroundColor: colors.purple[100],
    },
    dayText: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: "white",
    },
    timesContainer: {
        marginTop: 20,
    },
    timeButton: {
        backgroundColor: colors.purple[100],
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        margin: 5,
    },
    timeText: {
        fontFamily: fontFamily.regular,
        fontSize: 16,
        color: "white",
    },
    confirmButton: {
        backgroundColor: colors.purple[100],
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    confirmButtonText: {
        fontFamily: fontFamily.bold,
        fontSize: 18,
        color: "white",
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
});
