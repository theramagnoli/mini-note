import {
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Modal,
    Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import type { Note } from "@/services/notes";

const BASE_BG = "#fff";

export default function Index() {
    const { user, isLoading: authLoading, signIn, signOut } = useAuth();
    const { notes, isLoading: notesLoading, addNote, removeNote } = useNotes();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const avatarRef = useRef<View>(null);

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(BASE_BG);
    }, []);

    if (authLoading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <StatusBar style="dark" />
                <ActivityIndicator size="large" color="#208AEF" />
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <StatusBar style="dark" />
                <Text style={styles.title}>Mini Note</Text>
                <Text style={styles.subtitle}>Sign in to get started</Text>
                <TouchableOpacity style={styles.googleButton} onPress={signIn}>
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const handleAddNote = async () => {
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle && !trimmedContent) {
            Alert.alert("Empty note", "Please enter a title or content.");
            return;
        }

        setIsSaving(true);
        try {
            await addNote(trimmedTitle || "Untitled", trimmedContent || "");
            setTitle("");
            setContent("");
        } catch (error) {
            Alert.alert("Error", "Failed to save note.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteNote = (note: Note) => {
        Alert.alert("Delete note", `Delete "${note.title}"?`, [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => removeNote(note.id),
            },
        ]);
    };

    const handleMenuAction = (action: "profile" | "signOut") => {
        setMenuVisible(false);
        if (action === "signOut") {
            signOut();
        } else {
            Alert.alert("Profile", `${user.name ?? "User"}\n${user.email}`);
        }
    };

    const renderNote = ({ item }: { item: Note }) => (
        <View style={styles.noteCard}>
            <View style={styles.noteHeader}>
                <Text style={styles.noteTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <TouchableOpacity
                    onPress={() => handleDeleteNote(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Text style={styles.deleteButton}>✕</Text>
                </TouchableOpacity>
            </View>
            {item.content ? (
                <Text style={styles.noteContent} numberOfLines={3}>
                    {item.content}
                </Text>
            ) : null}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <StatusBar style="dark" />
            <NavigationBar style="dark" />
            <KeyboardAvoidingView
                style={styles.inner}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={0}
            >
                {/* Single header bar */}
                <View style={styles.headerBar}>
                    <Text style={styles.appName}>Mini Note</Text>
                    <TouchableOpacity onPress={() => setMenuVisible(true)} ref={avatarRef as any}>
                        {user.photo ? (
                            <Image source={{ uri: user.photo }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarText}>
                                    {user.name?.charAt(0) ?? user.email.charAt(0)}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Contextual menu modal */}
                <Modal
                    visible={menuVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
                        <View style={styles.menuContainer}>
                            <View style={styles.menuHeader}>
                                {user.photo ? (
                                    <Image source={{ uri: user.photo }} style={styles.menuAvatar} />
                                ) : (
                                    <View style={[styles.menuAvatar, styles.avatarPlaceholder]}>
                                        <Text style={styles.menuAvatarText}>
                                            {user.name?.charAt(0) ?? user.email.charAt(0)}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.menuInfo}>
                                    <Text style={styles.menuName}>{user.name ?? "User"}</Text>
                                    <Text style={styles.menuEmail}>{user.email}</Text>
                                </View>
                            </View>
                            <View style={styles.menuDivider} />
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleMenuAction("profile")}
                            >
                                <Text style={styles.menuItemText}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleMenuAction("signOut")}
                            >
                                <Text style={styles.menuItemTextDanger}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Modal>

                {/* Notes list */}
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNote}
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        notesLoading ? (
                            <ActivityIndicator size="large" color="#208AEF" style={styles.loader} />
                        ) : (
                            <Text style={styles.emptyText}>No notes yet. Create one below!</Text>
                        )
                    }
                />

                {/* Add note form */}
                <View style={styles.form}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Note title"
                        placeholderTextColor="#999"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.contentInput}
                        placeholder="Write something..."
                        placeholderTextColor="#999"
                        value={content}
                        onChangeText={setContent}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.addButton, isSaving && styles.addButtonDisabled]}
                        onPress={handleAddNote}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.addButtonText}>Save Note</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inner: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#208AEF",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 32,
    },
    googleButton: {
        backgroundColor: "#208AEF",
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 8,
    },
    googleButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e0e0e0",
        backgroundColor: "#fff",
    },
    appName: {
        fontSize: 20,
        fontWeight: "700",
        color: "#208AEF",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    avatarPlaceholder: {
        backgroundColor: "#208AEF",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },

    menuOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingTop: 60,
        paddingRight: 20,
    },
    menuContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 240,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    menuHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
    },
    menuAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    menuAvatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    menuInfo: {
        marginLeft: 12,
        flex: 1,
    },
    menuName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    menuEmail: {
        fontSize: 12,
        color: "#888",
        marginTop: 2,
    },
    menuDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#e0e0e0",
    },
    menuItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    menuItemText: {
        fontSize: 15,
        color: "#333",
    },
    menuItemTextDanger: {
        fontSize: 15,
        color: "#e74c3c",
    },
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
        color: "#999",
        fontSize: 15,
        marginTop: 40,
    },
    noteCard: {
        backgroundColor: "#f8f9fa",
        borderRadius: 10,
        padding: 14,
    },
    noteHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        flex: 1,
        marginRight: 8,
    },
    deleteButton: {
        fontSize: 16,
        color: "#e74c3c",
        fontWeight: "600",
    },
    noteContent: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
        lineHeight: 20,
    },
    form: {
        padding: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e0e0e0",
        gap: 10,
        backgroundColor: "#fff",
    },
    titleInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: "#333",
    },
    contentInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        fontSize: 15,
        color: "#333",
        minHeight: 60,
        textAlignVertical: "top",
    },
    addButton: {
        backgroundColor: "#208AEF",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    addButtonDisabled: {
        opacity: 0.6,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
