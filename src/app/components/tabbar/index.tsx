import { useSegments, useRouter } from "expo-router";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { colors } from "@/src/styles/colors";
import { FontAwesome } from "@expo/vector-icons"; // Biblioteca de ícones

const tabs = [
    { name: "Agendamentos", route: "/provider/appointments", icon: "calendar" },
    { name: "Serviços", route: "/provider/dashboard", icon: "scissors" },
];

export function TabBar() {
    const router = useRouter();
    const segments = useSegments();
    const currentRoute = `/${segments.join("/")}`;

    // Ref para animação
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 300, // Tempo da animação
            useNativeDriver: true,
        }).start(() => animatedValue.setValue(0)); // Reinicia após a animação
    }, [currentRoute]);

    return (
        <View
            style={{
                position: "relative",
                marginTop: "36.5%",
                width: "100%",
                backgroundColor: colors.purple[100],
                flexDirection: "row",
                paddingVertical: 4,
                borderTopColor: colors.gray[300],
            }}
        >
            {tabs.map((tab, index) => {
                const isActive = currentRoute === tab.route;
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => router.push(tab.route as any)}
                        style={{ alignItems: "center", flex: 1 }}
                    >
                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        scale: isActive
                                            ? animatedValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 1.2], // Aumenta o tamanho ao ativar
                                            })
                                            : 1,
                                    },
                                ],
                            }}
                        >
                            <FontAwesome
                                name={tab.icon as any}
                                size={24}
                                color={isActive ? colors.gray[100] : colors.gray[100]}
                            />
                        </Animated.View>
                        <Text
                            style={{
                                color: isActive ? colors.gray[100] : colors.gray[100],
                                fontWeight: isActive ? "bold" : "normal",
                                marginTop: 4,
                            }}
                        >
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
