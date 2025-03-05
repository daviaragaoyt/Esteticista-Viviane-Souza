import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { fontFamily, colors } from "@/src/styles/theme";
import { IconArrowLeft } from "@tabler/icons-react-native";

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
    const { id, title, description, price, image } = useLocalSearchParams();
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);


    const handleConfirm = () => {
        if (selectedDay && selectedTime) {
            Alert.alert("Agendamento Confirmado", `Serviço: ${title}\nDia: ${selectedDay}\nHorário: ${selectedTime}`);
        } else {
            Alert.alert("Erro", "Por favor, selecione um dia e um horário.");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <IconArrowLeft color={colors.gray[100]} />
            </TouchableOpacity>

            <Image src="https://github.com/daviaragaoyt.png" style={styles.serviceImage} />

            <View style={styles.detailsContainer}>
                <Text style={styles.title}>Massagem</Text>
                <Text style={styles.description}>Seilaaaaaa</Text>
                <Text style={styles.price}>{`R$ ${price}`}</Text>
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
        marginTop: 280
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
});
