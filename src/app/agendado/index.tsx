import React, { useState } from "react";
import { View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import { Button } from "../components/button";
// import MapView, { Marker } from "react-native-maps";
import styles from "./styles";

const ServicoAgendado = () => {
    const [modalVisible, setModalVisible] = useState(false);

    // Coordenadas do local de atendimento
    const latitude = -16.005909726493336; // Sua LATITUDE
    const longitude = -48.000594844834445; // Sua LONGITUDE

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agendamento Confirmado!</Text>
            <Button onPress={() => setModalVisible(true)}>
                <Button.Title>Ver Localização</Button.Title>
            </Button>
            {/* Modal com Mapa */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        {/* <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude,
                                longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            onPress={() => setModalVisible(false)} // Fecha ao tocar no mapa também
                        >
                            <Marker coordinate={{ latitude, longitude }} title="Local de Atendimento" />
                        </MapView> */}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default ServicoAgendado;
