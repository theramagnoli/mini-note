import { StyleSheet } from "react-native";
import { colors } from "../styles";

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: colors.text,
        lineHeight: 20,
    },
});
