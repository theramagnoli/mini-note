import { StyleSheet } from "react-native";
import { colors, radii } from "../styles";

export const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 100,
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
    },
    sidebar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 320,
        backgroundColor: colors.background,
        paddingTop: 60,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: colors.border,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 12,
        borderRadius: radii.sm,
        marginHorizontal: 12,
    },
    itemActive: {
        backgroundColor: colors.activeBackground,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: radii.full,
    },
    itemText: {
        fontSize: 15,
        color: colors.text,
    },
    itemTextActive: {
        color: colors.black,
    },
});
