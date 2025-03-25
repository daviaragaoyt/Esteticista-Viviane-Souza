import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles";

const LoadingScreen = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/agendado/index"); // Navega para a página após 5s
        }, 5000);

        return () => clearTimeout(timer); // Evita bugs se o usuário sair antes dos 5s
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Agendando...</Text>
        </View>
    );
};

export default LoadingScreen;
