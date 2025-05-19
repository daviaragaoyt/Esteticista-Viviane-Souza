import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { colors } from '@/src/styles/theme';

interface FloatingActionButtonProps {
    onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                position: "absolute",
                bottom: 120,
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
                elevation: 5,
            }}
        >
            <FontAwesome5 name="plus" size={24} color="#fff" />
        </TouchableOpacity>
    );
}
