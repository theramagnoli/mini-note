import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e0e0e0",
    },
    backText: {
        fontSize: 16,
        color: "#666",
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#333",
    },
    scrollContent: {
        padding: 20,
    },
    titleInput: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
        paddingBottom: 12,
    },
    contentInput: {
        fontSize: 16,
        color: "#333",
        lineHeight: 24,
        minHeight: 200,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 24,
    },
    metaText: {
        fontSize: 13,
        color: "#999",
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#999",
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
        paddingBottom: 30,
    },
    menuContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginHorizontal: 16,
    },
    menuItem: {
        paddingVertical: 16,
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#f0f0f0",
    },
    menuItemText: {
        fontSize: 17,
        color: "#e74c3c",
    },
    menuCancel: {
        paddingVertical: 16,
        alignItems: "center",
    },
    menuCancelText: {
        fontSize: 17,
        color: "#208AEF",
        fontWeight: "600",
    },
});
