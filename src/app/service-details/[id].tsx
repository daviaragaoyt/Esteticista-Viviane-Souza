import { api } from "@/src/services/api";
import { colors } from "@/src/styles/theme";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import 'moment/locale/pt-br';  // Importa localização em português
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

moment.locale('pt-br'); // Define o locale para português

interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    imagem: string | null;
}

const availability: Record<string, string[]> = {
    'Segunda': ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    'Terça': ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    'Quarta': ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    'Quinta': ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    'Sexta': ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    'Sábado': ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
};

const dayMap: { [key: number]: string } = {
    0: 'Domingo',
    1: 'Segunda',
    2: 'Terça',
    3: 'Quarta',
    4: 'Quinta',
    5: 'Sexta',
    6: 'Sábado'
};

const getAvailableTimes = (day: string | null): string[] => {
    if (!day) return [];
    const times = availability[day];
    return Array.isArray(times) ? times : [];
};

export default function ServiceDetails() {
    const router = useRouter();
    const { id: itemID } = useLocalSearchParams();
    const [servico, setServico] = useState<Servico | null>(null);
    const [selectedDate, setSelectedDate] = useState<DateData>();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userID, setUserID] = useState<string | null>();

    useEffect(() => {
        (async () => {
            const result = await AsyncStorage.getItem('userId')
            if (result) setUserID(result)
        })()
    }, []);

    const fetchServico = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/servico/${itemID}`);
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
    }, [itemID]);

    const handleDayPress = (day: DateData) => {
        const date = moment(day.dateString);
        const dayOfWeek = date.day();
        const weekDay = dayMap[dayOfWeek];

        console.log('Data selecionada:', day.dateString);
        console.log('Dia da semana (número):', dayOfWeek);
        console.log('Dia da semana (nome):', weekDay);

        if (dayOfWeek === 0) {
            ToastAndroid.show("Não trabalhamos aos domingos", 2000);
            return;
        }

        if (availability[weekDay]) {
            setSelectedDate(day);
            setSelectedTime(null);
        } else {
            setSelectedDate(undefined);
            setSelectedTime(null);
            ToastAndroid.show("Dia não disponível para agendamento", 2000);
        }
    };

    const handleConfirm = async () => {
        if (!selectedDate || !selectedTime || !servico) {
            ToastAndroid.show("Por favor, selecione um dia e um horário.", 2000);
            return;
        }

        try {
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const dataHora = moment(selectedDate.dateString)
                .hour(hours)
                .minute(minutes)
                .second(0)
                .millisecond(0);

            const agendamentoData = {
                dataHora: dataHora.toISOString(),
                clienteId: userID,
                servicoId: servico.id,
            };

            const response = await api.post('/agendamento', agendamentoData);
            if (response.status === 201) {
                ToastAndroid.show("Agendamento realizado com sucesso!", 2000);
                router.replace("/loading");
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

    const selectedDay = selectedDate ?
        dayMap[moment(selectedDate.dateString).day()] :
        null;

    return (
        <ScrollView style={styles.container}>
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
                <Calendar
                    style={styles.calendar}
                    renderArrow={(direction: "right" | "left") => (
                        <Feather size={24} color={colors.purple[100]} name={`chevron-${direction}`} />
                    )}
                    headerStyle={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: colors.gray[300],
                        paddingBottom: 10,
                        marginBottom: 10,
                    }}
                    theme={{
                        textMonthFontSize: 18,
                        monthTextColor: colors.purple[100],
                        todayTextColor: colors.purple[100],
                        selectedDayBackgroundColor: colors.purple[100],
                        selectedDayTextColor: '#fff',
                        arrowColor: colors.purple[100],
                        calendarBackground: '#fff',
                        textDayStyle: { color: colors.gray[600] },
                        textDisabledColor: colors.gray[400],
                        textDayHeaderFontSize: 14,
                    }}
                    minDate={moment().format('YYYY-MM-DD')}
                    hideExtraDays
                    onDayPress={handleDayPress}
                    markedDates={
                        selectedDate ? {
                            [selectedDate.dateString]: { selected: true }
                        } : {}
                    }
                    disableAllTouchEventsForDisabledDays
                    enableSwipeMonths
                />

                {selectedDay && (
                    <>
                        <Text style={styles.sectionTitle}>
                            Horários disponíveis para {selectedDay}:
                        </Text>
                        <View style={styles.gridContainer}>
                            {getAvailableTimes(selectedDay).map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeButton,
                                        selectedTime === time && styles.selectedButton
                                    ]}
                                    onPress={() => setSelectedTime(time)}
                                >
                                    <Text style={[
                                        styles.timeText,
                                        selectedTime === time && { color: '#fff' }
                                    ]}>{time}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {selectedDate && selectedTime && (
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
        fontSize: 16,
        color: colors.gray[600],
    },
    errorText: {
        fontSize: 16,
        color: colors.gray[600],
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
        fontSize: 16,
        color: colors.gray[500],
    },
    detailsContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        color: colors.purple[100],
        marginBottom: 10,
    },
    description: {
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
        fontSize: 16,
        color: colors.gray[600],
        marginRight: 5,
    },
    infoValue: {
        fontSize: 16,
        color: colors.purple[100],
    },
    availabilityContainer: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    sectionTitle: {
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
    timeButton: {
        backgroundColor: colors.gray[200],
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedButton: {
        backgroundColor: colors.purple[100],
        transform: [{ scale: 1.05 }],
    },
    timeText: {
        fontSize: 16,
        color: '#333',
    },
    confirmButton: {
        width: '100%',
        padding: 16,
        backgroundColor: colors.purple[100],
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    confirmButtonText: {
        fontSize: 18,
        color: "#fff",
    },
    calendar: {
        marginBottom: 20,
        borderRadius: 10,
        width: '100%',
    },
});