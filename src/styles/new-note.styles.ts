import { Dimensions, StyleSheet } from "react-native";
import { colors, radii } from "../styles";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: colors.text,
    },
    collectionRow: {
        position: "absolute",
        bottom: 12,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 8,
        paddingRight: 12,
        paddingVertical: 4,
        gap: 8,
        backgroundColor: "#F3F4F6",
        borderRadius: radii.full,
    },
    collectionLabel: {
        fontSize: 16,
        color: colors.text,
        flexShrink: 1,
    },
    collectionLabelActive: {
        color: colors.black,
        fontWeight: "500",
    },
    collectionDot: {
        width: 16,
        height: 16,
        borderRadius: radii.full,
    },
    collectionDotBordered: {
        borderWidth: 2,
        borderColor: colors.black,
    },
    titleInput: {
        fontSize: 22,
        fontWeight: "600",
        color: colors.text,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    contentInput: {
        fontSize: 16,
        color: colors.text,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        lineHeight: 24,
        minHeight: SCREEN_HEIGHT * 0.5,
    },
    pickerOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: "center",
        alignItems: "center",
    },
    pickerContainer: {
        backgroundColor: colors.background,
        borderRadius: radii.md,
        width: 260,
        overflow: "hidden",
        paddingVertical: 4,
        paddingHorizontal: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    pickerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 10,
    },
    pickerItemActive: {
        backgroundColor: colors.activeBackground,
        borderRadius: radii.sm,
    },
    pickerItemText: {
        flex: 1,
        fontSize: 15,
        color: colors.text,
    },
    pickerItemTextActive: {
        color: colors.primary,
        fontWeight: "600",
    },
});
