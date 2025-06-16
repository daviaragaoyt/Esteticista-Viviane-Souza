import { StyleSheet } from "react-native";
import { colors } from '@/src/styles/theme'
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
    backButton: {
        position: "absolute",
        top: 60,
        marginTop: 30,
        left: 20,
        backgroundColor: colors.purple[100],
        padding: 8,
        borderRadius: 10,
        zIndex: 10,
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.purple[100],
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    mapIcon: {
        marginRight: 10,
    },

});