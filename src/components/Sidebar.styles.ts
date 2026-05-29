import { StyleSheet } from "react-native";

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
        backgroundColor: "#fff",
        paddingTop: 60,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: "#e0e0e0",
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
        color: "#333",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 12,
        borderRadius: 8,
        marginHorizontal: 12,
    },
    itemActive: {
        backgroundColor: "#e8f4fd",
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 4,
    },
    itemText: {
        fontSize: 15,
        color: "#333",
    },
    itemTextActive: {
        color: "#208AEF",
        fontWeight: "600",
    },
});
