import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import { router } from "expo-router";
import { useNotes } from "@/contexts/NotesContext";

export default function NewNoteScreen() {
    const { collections, selectedCollectionId, addNote } = useNotes();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle && !trimmedContent) {
            Alert.alert("Empty note", "Please enter a title or content.");
            return;
        }

        setIsSaving(true);
        try {
            await addNote(
                trimmedTitle || "Untitled",
                trimmedContent || "",
                selectedCollectionId,
            );
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
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color="#208AEF" />
                    ) : (
                        <Text style={styles.saveText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

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
});
