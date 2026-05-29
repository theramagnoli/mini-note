import { View, Text, TouchableOpacity, Animated, Pressable, Alert } from "react-native";
import { BlurView } from "expo-blur";
import { Plus } from "phosphor-react-native";
import { useNotes } from "@/contexts/NotesContext";
import { styles } from "./Sidebar.styles";

const FALLBACK_COLOR = "#999";

interface SidebarProps {
    sidebarAnim: Animated.Value;
    blurTargetRef: React.RefObject<View>;
    onClose: () => void;
    onAddCollection: () => void;
    onRenameCollection: (id: string, name: string) => void;
    onDeleteCollection: (id: string, name: string) => void;
}

export function Sidebar({
    sidebarAnim,
    blurTargetRef,
    onClose,
    onAddCollection,
    onRenameCollection,
    onDeleteCollection,
}: SidebarProps) {
    const { collections, selectedCollectionId, selectCollection } = useNotes();

    return (
        <View style={styles.overlay}>
            <Animated.View
                style={[
                    styles.backdrop,
                    {
                        opacity: sidebarAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            >
                <Pressable style={{ flex: 1 }} onPress={onClose}>
                    <BlurView
                        blurTarget={blurTargetRef}
                        blurMethod="dimezisBlurViewSdk31Plus"
                        intensity={50}
                        tint="dark"
                        style={{ flex: 1 }}
                    />
                </Pressable>
            </Animated.View>
            <Animated.View
                style={[
                    styles.sidebar,
                    {
                        left: sidebarAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-320, 0],
                        }),
                    },
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Collections</Text>
                    <TouchableOpacity
                        onPress={onAddCollection}
                        hitSlop={{
                            top: 8,
                            bottom: 8,
                            left: 8,
                            right: 8,
                        }}
                    >
                        <Plus size={22} color="#208AEF" weight="bold" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.item, !selectedCollectionId && styles.itemActive]}
                    onPress={() => {
                        selectCollection(null);
                        onClose();
                    }}
                >
                    <View style={[styles.dot, { backgroundColor: "#ccc" }]} />
                    <Text style={[styles.itemText, !selectedCollectionId && styles.itemTextActive]}>
                        All Notes
                    </Text>
                </TouchableOpacity>

                {collections.map((c) => (
                    <TouchableOpacity
                        key={c.id}
                        style={[styles.item, selectedCollectionId === c.id && styles.itemActive]}
                        onPress={() => {
                            selectCollection(c.id);
                            onClose();
                        }}
                        onLongPress={() => {
                            Alert.alert(c.name, undefined, [
                                {
                                    text: "Rename",
                                    onPress: () => onRenameCollection(c.id, c.name),
                                },
                                {
                                    text: "Delete",
                                    style: "destructive",
                                    onPress: () => onDeleteCollection(c.id, c.name),
                                },
                                {
                                    text: "Cancel",
                                    style: "cancel",
                                },
                            ]);
                        }}
                    >
                        <View
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: c.color || FALLBACK_COLOR,
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.itemText,
                                selectedCollectionId === c.id && styles.itemTextActive,
                            ]}
                            numberOfLines={1}
                        >
                            {c.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>
        </View>
    );
}
