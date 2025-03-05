import { useEffect, useState } from "react";
import { View, Alert, Text, Image, TouchableOpacity } from "react-native";
import * as Location from "expo-location";

import { fontFamily, colors } from "@/src/styles/theme";
import { api } from "../services/api";
import { ScrollView } from "react-native-gesture-handler";
import { router, useRouter } from "expo-router";

const currentLocation = {
  latitude: -16.00599734669998,
  longitude: -48.00048220982849,
};

export default function Home() {

  const [category, setCategory] = useState("");
  const [services, setServices] = useState([]);
  const [location, setLocation] = useState(currentLocation);


  async function fetchServices() {
    try {
      if (!category) return;
      const { data } = await api.get("/servico");
      setServices(data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os serviços.");
    }
  }

  async function getCurrentLocation() {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (granted) {
        const location = await Location.getCurrentPositionAsync();
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // fetchCategories();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [category]);

  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#CECECE",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
      }}
    >
      <Text style={{ fontFamily: fontFamily.bold, fontSize: 20 }}>
        Esteticista Viviane Souza
      </Text>
      <Text style={{ fontFamily: fontFamily.bold, fontSize: 14 }}>
        Marque seu horario com a melhor Esticista da região
      </Text>
      <ScrollView
        style={{ flex: 1, width: "100%", height: "80%", marginTop: 20 }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            height: "80%",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((_, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: "row",
                width: "95%",
                height: 100,
                borderRadius: 10,
                padding: 8,
                backgroundColor: colors.purple[100],
                justifyContent: "center",
                gap: 10,
              }}
              onPress={() => router.push({
                pathname: "/service-details/service-details",
                params: {

                },
              })}
            >
              <Image
                src="https://github.com/daviaragaoyt.png"
                width={30}
                height={30}
                style={{
                  alignSelf: "center",
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                }}
              />
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{`Serviço ${index}`}</Text>
                <Text>{`Descrição do serviço`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
