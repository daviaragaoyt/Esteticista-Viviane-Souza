import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/colors";
import { fontFamily } from "@/src/styles/font-family";

export const styles = StyleSheet.create({


    title: {
        fontSize: 28,
        fontFamily: fontFamily.bold,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: fontFamily.bold,
    },
    loginContainer: {
        backgroundColor: colors.purple[100],
        borderRadius: 20,
        height: "50%",
        padding: 20,
        justifyContent: "center",
    },

    headerText: {
        fontFamily: fontFamily.bold,
        fontSize: 35,
        color: colors.gray[100],
    },
    inputContainer: {
        gap: 20,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: colors.gray[100],
        paddingHorizontal: 10,
        width: "100%",
    },
    input: {
        flex: 1,
        paddingVertical: 10,
    },
    icon: {
        marginLeft: 10,
    },
});
