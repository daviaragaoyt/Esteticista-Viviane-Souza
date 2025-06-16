import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/theme";

export const s = StyleSheet.create({
    container: {
        height: 56,
        maxHeight: 56,
        backgroundColor: colors.purple[100],
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 14
    },
    title: {
        color: colors.gray[100],

        fontSize: 16,
    },

});