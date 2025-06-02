import { api } from "@/src/services/api";
import { colors, fontFamily } from "@/src/styles/theme";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View, ScrollView } from "react-native";
import moment from "moment";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import { Feather } from "@expo/vector-icons";
import { ptBR } from "../../utils/localeCalendarConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

LocaleConfig.locales["pt-br"] = ptBR;
LocaleConfig.defaultLocale = "pt-br";

interface Servico {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    duracao: number;
    imagem: string | null;
}

const availability: Record<string, string[]> = {
    Monday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Tuesday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Wednesday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Thursday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    Friday: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
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
    const [userID, setUserID] = useState<string | null>()

    useEffect(() => {
        (async () => {
            const result = await AsyncStorage.getItem('userId')
            if (result) setUserID(result)
        })()
    }, [])

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
        const date = new Date(day.dateString);
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            ToastAndroid.show("Não trabalhamos aos fins de semana", 2000);
            return;
        }

        const weekDay = moment(day.dateString).format('dddd');
        const capitalized = weekDay.charAt(0).toUpperCase() + weekDay.slice(1).split('-')[0];

        console.log('tst', capitalized)

        if (availability[capitalized]) {
            setSelectedDate(day);
            setSelectedTime(null);
        } else {
            setSelectedDate(undefined);
            setSelectedTime(null);
            ToastAndroid.show("Dia não disponível para agendamento", 2000);
        }
    };

    const handleConfirm = async () => {
        if (selectedDate && selectedTime && servico) {
            try {
                const [hours, minutes] = selectedTime.split(':').map(Number);
                const dataHora = new Date(selectedDate.dateString);
                dataHora.setHours(hours, minutes, 0, 0);

                const agendamentoData = {
                    dataHora: dataHora.toISOString(),
                    clienteId: userID,
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

    const selectedDay = selectedDate ?
        moment(selectedDate.dateString).format('dddd').charAt(0).toUpperCase() +
        moment(selectedDate.dateString).format('dddd').slice(1).split('-')[0] :
        null;

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
                        textDayStyle: { color: colors.gray[600], fontFamily: fontFamily.regular },
                        textDisabledColor: colors.gray[400],
                        textDayHeaderFontFamily: fontFamily.medium,
                        textDayHeaderFontSize: 14,
                        textDayHeaderColor: colors.purple[100],
                    }}
                    minDate={new Date().toDateString()}
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
                                    <Text style={styles.timeText}>{time}</Text>
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
        fontFamily: fontFamily.medium,
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
        fontFamily: fontFamily.bold,
        fontSize: 18,
        color: "#fff",
    },
    calendar: {
        marginBottom: 20,
        borderRadius: 10,
        width: '100%',
    },
});