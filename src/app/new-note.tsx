import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Modal,
    Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import { router } from "expo-router";
import { CaretLeft, CaretDown, Check } from "phosphor-react-native";
import { useNotes } from "@/contexts/NotesContext";

const FALLBACK_COLOR = "#999";

export default function NewNoteScreen() {
    const { collections, selectedCollectionId, addNote } = useNotes();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [collectionId, setCollectionId] = useState<string | null>(selectedCollectionId);
    const [pickerOpen, setPickerOpen] = useState(false);

    const activeCollection = collections.find((c) => c.id === collectionId);

    const handleSave = async () => {
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle && !trimmedContent) {
            Alert.alert("Empty note", "Please enter a title or content.");
            return;
        }

        setIsSaving(true);
        try {
            await addNote(trimmedTitle || "Untitled", trimmedContent || "", collectionId);
            router.back();
        } catch (error) {
            Alert.alert("Error", "Failed to save note.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <StatusBar style="dark" />
            <NavigationBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Note</Text>
                <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#208AEF" />
                    ) : (
                        <Text style={styles.saveText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.collectionRow} onPress={() => setPickerOpen(true)}>
                <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: activeCollection
                            ? activeCollection.color || "#999"
                            : "#ccc",
                    }}
                />
                <Text
                    style={[
                        styles.collectionLabel,
                        activeCollection && styles.collectionLabelActive,
                    ]}
                >
                    {activeCollection?.name ?? "No collection"}
                </Text>
                <CaretDown size={14} color="#999" />
            </TouchableOpacity>

            <TextInput
                style={styles.titleInput}
                placeholder="Title"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                autoFocus
            />
            <TextInput
                style={styles.contentInput}
                placeholder="Write something..."
                placeholderTextColor="#999"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
            />

            <Modal
                visible={pickerOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setPickerOpen(false)}
            >
                <Pressable style={styles.pickerOverlay} onPress={() => setPickerOpen(false)}>
                    <View style={styles.pickerContainer}>
                        <TouchableOpacity
                            style={[styles.pickerItem, !collectionId && styles.pickerItemActive]}
                            onPress={() => {
                                setCollectionId(null);
                                setPickerOpen(false);
                            }}
                        >
                            <View
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: "#ccc",
                                }}
                            />
                            <Text style={styles.pickerItemText}>No collection</Text>
                            {!collectionId && <Check size={18} color="#208AEF" weight="bold" />}
                        </TouchableOpacity>
                        {collections.map((c) => (
                            <TouchableOpacity
                                key={c.id}
                                style={[
                                    styles.pickerItem,
                                    collectionId === c.id && styles.pickerItemActive,
                                ]}
                                onPress={() => {
                                    setCollectionId(c.id);
                                    setPickerOpen(false);
                                }}
                            >
                                <View
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: c.color || FALLBACK_COLOR,
                                    }}
                                />
                                <Text
                                    style={[
                                        styles.pickerItemText,
                                        collectionId === c.id && styles.pickerItemTextActive,
                                    ]}
                                >
                                    {c.name}
                                </Text>
                                {collectionId === c.id && (
                                    <Check size={18} color="#208AEF" weight="bold" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    headerTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#333",
    },
    cancelText: {
        fontSize: 16,
        color: "#666",
    },
    saveText: {
        fontSize: 16,
        color: "#208AEF",
        fontWeight: "600",
    },
    collectionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#f0f0f0",
    },
    collectionLabel: {
        flex: 1,
        fontSize: 14,
        color: "#999",
    },
    collectionLabelActive: {
        color: "#208AEF",
        fontWeight: "500",
    },
    titleInput: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    contentInput: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        paddingHorizontal: 20,
        paddingTop: 12,
        lineHeight: 24,
    },
    pickerOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    pickerContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 260,
        maxHeight: 300,
        overflow: "hidden",
        paddingVertical: 4,
        paddingHorizontal: 4,
        shadowColor: "#000",
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
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#f0f0f0",
    },
    pickerItemActive: {
        backgroundColor: "#e8f4fd",
        borderRadius: 8,
    },
    pickerItemText: {
        flex: 1,
        fontSize: 15,
        color: "#333",
    },
    pickerItemTextActive: {
        color: "#208AEF",
        fontWeight: "600",
    },
});
