import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
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
import { styles } from "./new-note.styles";

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
