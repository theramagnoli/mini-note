import { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import { useLocalSearchParams, router } from "expo-router";
import { DotsThreeVertical } from "phosphor-react-native";
import { useNotes } from "@/contexts/NotesContext";
import { updateNote } from "@/services/notes";
import { styles } from "@/styles/note/[id].styles";
import { colors } from "../../styles";

export default function NoteDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { notes, removeNote } = useNotes();
    const note = notes.find((n) => n.id === id);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        }
    }, [note]);

    const handleSave = async () => {
        if (!note) return;
        setIsSaving(true);
        try {
            await updateNote(note.id, {
                title: title.trim() || "Untitled",
                content,
            });
        } catch (error) {
            console.error("Failed to save note:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        if (!note) return;
        setMenuOpen(false);
        Alert.alert("Delete note", `Delete "${note.title}"?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await removeNote(note.id);
                    router.back();
                },
            },
        ]);
    };

    if (!note) {
        return (
            <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <StatusBar style="dark" />
            <NavigationBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => {
                        handleSave();
                        router.back();
                    }}
                >
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Note</Text>
                <TouchableOpacity onPress={() => setMenuOpen(true)}>
                    <DotsThreeVertical size={22} color={colors.black} weight="bold" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput
                    style={styles.titleInput}
                    placeholder="Title"
                    placeholderTextColor={colors.placeholder}
                    value={title}
                    onChangeText={setTitle}
                    onBlur={handleSave}
                />
                <TextInput
                    style={styles.contentInput}
                    placeholder="Write something..."
                    placeholderTextColor={colors.placeholder}
                    value={content}
                    onChangeText={setContent}
                    multiline
                    textAlignVertical="top"
                    onBlur={handleSave}
                />
                {isSaving && (
                    <ActivityIndicator size="small" color={colors.text} style={{ marginTop: 12 }} />
                )}
            </ScrollView>

            <Modal
                visible={menuOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuOpen(false)}
            >
                <Pressable style={styles.menuOverlay} onPress={() => setMenuOpen(false)}>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                            <Text style={styles.menuItemText}>Delete note</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuCancel}
                            onPress={() => setMenuOpen(false)}
                        >
                            <Text style={styles.menuCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
