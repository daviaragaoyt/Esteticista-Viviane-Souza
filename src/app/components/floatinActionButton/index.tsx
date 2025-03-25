import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/src/styles/colors";

export function FloatingActionButton() {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push("/provider/new-service")} // Redireciona para criação de serviço
            style={{
                position: "absolute",
                bottom: 120, // Posiciona acima da TabBar
                right: 30,
                backgroundColor: colors.purple[100],
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 5, // Sombra no Android
            }}
        >
            <FontAwesome5 name="plus" size={24} color="#fff" />
        </TouchableOpacity>
    );
}
