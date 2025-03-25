import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    loadingText: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    confirmText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "green",
    },
    infoText: {
        fontSize: 16,
        color: "gray",
        marginTop: 10,
    },
    button: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#4F46E5",
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
