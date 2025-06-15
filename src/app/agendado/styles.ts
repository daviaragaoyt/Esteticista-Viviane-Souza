import { StyleSheet } from "react-native";
import { colors, fontFamily } from '@/src/styles/theme'
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        textAlign: 'center',
        backgroundColor: colors.purple[100],
    },
    title: {
        color: colors.gray[100],
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",

    },
    map: {
        width: "90%",
        height: "50%",

    },
});
