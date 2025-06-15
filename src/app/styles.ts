// styles.ts
import { StyleSheet } from "react-native";
import { colors } from "@/src/styles/colors";
import { fontFamily } from "@/src/styles/font-family";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    title: {
        fontFamily: fontFamily.bold,
        fontSize: 32,
        color: colors.purple[100],
    },
    subtitle: {
        fontFamily: fontFamily.bold,
        fontSize: 18,
        color: colors.purple[100],
    },
    formContainer: {
        width: "90%",
        gap: 10,
        backgroundColor: colors.purple[100],
        borderRadius: 8,
        padding: 32,
    },
    input: {
        backgroundColor: colors.gray[100],
        borderWidth: 1,
        borderColor: colors.gray[300],
        borderRadius: 8,
        padding: 10,
        fontFamily: fontFamily.regular,
    },
    linkText: {
        color: colors.purple[100],
        fontSize: 20,
        fontFamily: fontFamily.bold,
        marginTop: 10,
    },
    loginButton: {
        width: 280,
        marginTop: 20,
    },
    buttonText: {
        color: colors.gray[100],
        fontSize: 20,
        fontFamily: fontFamily.bold,
    },
});