import { StyleSheet } from "react-native";

export const colors = {
    primary: "#208AEF",
    danger: "#e74c3c",
    text: "#333",
    textSecondary: "#666",
    textMuted: "#999",
    border: "#e0e0e0",
    borderLight: "#f0f0f0",
    background: "#fff",
    cardBackground: "#f8f9fa",
    activeBackground: "#e8f4fd",
    white: "#fff",
    black: "#000",
    fallback: "#ccc",
} as const;

export const sharedStyles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    absoluteFill: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: colors.background,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
});
