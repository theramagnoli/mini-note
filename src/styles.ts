import { StyleSheet } from "react-native";
import { colors, radii } from "./styles/index.styles";

export { colors, radii };

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
        backgroundColor: colors.overlay,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: colors.background,
        borderRadius: radii.md,
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
