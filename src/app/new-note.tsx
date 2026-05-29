import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import { router } from "expo-router";
import { CaretLeftIcon, CheckIcon } from "phosphor-react-native";
import { useNotes } from "@/contexts/NotesContext";
import { styles } from "@/styles/new-note.styles";
import { colors } from "../styles";

const FALLBACK_COLOR = colors.fallback;

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
                    <CaretLeftIcon size={22} color={colors.black} weight="bold" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Note</Text>
                <TouchableOpacity onPress={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <CheckIcon size={22} color={colors.black} weight="bold" />
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: colors.background }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Title"
                        placeholderTextColor={colors.placeholder}
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                    />
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Write something..."
                        placeholderTextColor={colors.placeholder}
                        value={content}
                        onChangeText={setContent}
                        multiline
                        textAlignVertical="top"
                    />
                </ScrollView>

                <TouchableOpacity style={styles.collectionRow} onPress={() => setPickerOpen(true)}>
                    <View
                        style={[
                            styles.collectionDot,
                            styles.collectionDotBordered,
                            {
                                backgroundColor: activeCollection
                                    ? activeCollection.color || colors.fallback
                                    : colors.fallback,
                            },
                        ]}
                    />
                    <Text
                        style={[
                            styles.collectionLabel,
                            activeCollection && styles.collectionLabelActive,
                        ]}
                    >
                        {activeCollection?.name ?? "No collection"}
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

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
                                style={[styles.collectionDot, { backgroundColor: colors.fallback }]}
                            />
                            <Text style={styles.pickerItemText}>No collection</Text>
                            {!collectionId && (
                                <CheckIcon size={18} color={colors.black} weight="bold" />
                            )}
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
                                    style={[
                                        styles.collectionDot,
                                        { backgroundColor: c.color || FALLBACK_COLOR },
                                    ]}
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
                                    <CheckIcon size={18} color={colors.black} weight="bold" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}
