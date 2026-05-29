import { StyleSheet } from "react-native";
import { colors, radii } from "../../styles";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    backText: {
        fontSize: 16,
        color: colors.text,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: colors.text,
    },
    scrollContent: {
        padding: 20,
    },
    titleInput: {
        fontSize: 22,
        fontWeight: "600",
        color: colors.text,
        paddingBottom: 12,
    },
    contentInput: {
        fontSize: 16,
        color: colors.text,
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
        color: colors.text,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: radii.full,
        backgroundColor: colors.text,
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: "flex-end",
        paddingBottom: 30,
    },
    menuContainer: {
        backgroundColor: colors.background,
        borderRadius: radii.md,
        marginHorizontal: 16,
    },
    menuItem: {
        paddingVertical: 16,
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    menuItemText: {
        fontSize: 17,
        color: colors.danger,
    },
    menuCancel: {
        paddingVertical: 16,
        alignItems: "center",
    },
    menuCancelText: {
        fontSize: 17,
        color: colors.primary,
        fontWeight: "600",
    },
});
