import { StyleSheet } from "react-native";

export const radii = {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
} as const;

export const colors = {
    primary: "#C2B528",
    danger: "#e74c3c",
    text: "#000",
    border: "#a3a3a3",
    background: "#fff",
    activeBackground: "#f0f9ff",
    white: "#fff",
    black: "#000",
    fallback: "#ccc",
    overlay: "rgba(0,0,0,0.3)",
    placeholder: "#9CA3AF",
} as const;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    inner: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 32,
    },
    googleButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: radii.sm,
    },
    googleButtonText: {
        color: colors.black,
        fontSize: 16,
        fontWeight: "600",
    },
    // Header bar
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
        gap: 12,
    },
    hamburger: {
        fontSize: 22,
        color: colors.text,
    },
    appName: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.black,
        flex: 1,
    },
    logo: {
        width: 20,
        height: 20,
    },
    avatar: {
        width: 32,
        height: 32,
        borderWidth: 3,
        borderColor: colors.black,
        borderRadius: radii.full,
    },
    avatarPlaceholder: {
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: colors.black,
        fontSize: 14,
        fontWeight: "700",
    },
    menuOverlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        zIndex: 50,
    },
    menuContainer: {
        backgroundColor: colors.background,
        borderRadius: radii.md,
        width: 240,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 2,
    },
    menuAvatar: {
        width: 40,
        height: 40,
        borderRadius: radii.full,
    },
    menuAvatarText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: "700",
    },
    menuInfo: {
        padding: 16,
        gap: 4,
    },
    menuName: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.text,
    },
    menuEmail: {
        fontSize: 12,
        color: colors.text,
        marginTop: 2,
    },
    menuDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
    },
    menuItem: {},
    menuItemText: {
        fontSize: 15,
        color: colors.text,
    },
    menuItemTextDanger: {
        fontSize: 15,
        color: colors.danger,
    },
    menuActions: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        gap: 16,
    },
    // Notes list
    list: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        gap: 10,
        flexGrow: 1,
    },
    loader: {
        marginTop: 40,
    },
    emptyText: {
        textAlign: "center",
        color: colors.text,
        fontSize: 15,
        marginTop: 40,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        borderRadius: radii.lg,
        borderWidth: 3,
        borderColor: colors.black,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
    },
    fabText: {
        fontSize: 28,
        color: colors.black,
        lineHeight: 30,
    },
    // Prompt modal
    pickerOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: "center",
        alignItems: "center",
    },
    promptContainer: {
        backgroundColor: colors.background,
        borderRadius: radii.md,
        width: 280,
        padding: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    promptTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: colors.text,
        marginBottom: 14,
    },
    promptInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: radii.sm,
        padding: 10,
        fontSize: 15,
        color: colors.text,
        marginBottom: 16,
    },
    promptButtons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    promptCancel: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    promptCancelText: {
        fontSize: 15,
        color: colors.text,
    },
    promptConfirm: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: radii.sm,
    },
    promptConfirmText: {
        fontSize: 15,
        color: colors.black,
        fontWeight: "600",
    },
    colorRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 16,
    },
    colorDot: {
        width: 28,
        height: 28,
        borderRadius: radii.full,
    },
    colorDotSelected: {
        borderWidth: 3,
        borderColor: colors.text,
    },
});
