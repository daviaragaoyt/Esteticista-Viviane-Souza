import React, { useState } from "react";
import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Linking, ToastAndroid } from "react-native";
import { Button } from "../components/button";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const ServicoAgendado = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleMap = async () => {
        const endereco = {
            latitude: -16.0260796,
            longitude: -48.0280298,
            label: 'QR 207 Estética Viviane Sousa',
            address: 'QR 207 Casa 19 - Santa Maria, Brasília - DF, 72507-403'
        };

        try {
            // Cria a URL do Google Maps
            const url = `https://www.google.com/maps/search/?api=1&query=${endereco.latitude},${endereco.longitude}`;

            // Verifica se pode abrir a URL
            const canOpen = await Linking.canOpenURL(url);

            if (canOpen) {
                await Linking.openURL(url);
            } else {
                // Fallback para navegador
                const browserUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco.address)}`;
                await Linking.openURL(browserUrl);
            }
        } catch (error) {
            console.error('Erro ao abrir o mapa:', error);
            ToastAndroid.show('Não foi possível abrir o mapa', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/')}
            >
                <Feather name="arrow-left" color={'#fff'} size={32} />
            </TouchableOpacity>

            <Text style={styles.title}>Agendamento Confirmado!</Text>

            <Button
                onPress={handleMap}
                style={styles.mapButton}
            >
                <Feather
                    name="map-pin"
                    size={20}
                    color="#FFF"
                    style={styles.mapIcon}
                />
                <Button.Title>Ver Localização</Button.Title>
            </Button>

            {/* Modal com Mapa */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        {/* Conteúdo do Modal aqui */}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default ServicoAgendado;