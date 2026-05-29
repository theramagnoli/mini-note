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
    Animated,
    Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView, BlurTargetView } from "expo-blur";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import { router } from "expo-router";
import type { Note } from "@/services/notes";

const BASE_BG = "#fff";
const HEADER_HEIGHT = 56;
const AVATAR_SIZE = 32;
const H_PADDING = 16;

export default function Index() {
    const { user, isLoading: authLoading, signIn, signOut } = useAuth();
    const {
        notes,
        isLoading: notesLoading,
        collections,
        selectedCollectionId,
        selectCollection,
        addNote,
        removeNote,
        addCollection,
        editCollection,
        removeCollection,
    } = useNotes();

    const [menuVisible, setMenuVisible] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [promptVisible, setPromptVisible] = useState(false);
    const [promptValue, setPromptValue] = useState("");
    const [promptAction, setPromptAction] = useState<"create" | null>(null);
    const [editingCollection, setEditingCollection] = useState<{ id: string; name: string } | null>(
        null,
    );
    const sidebarAnim = useRef(new Animated.Value(0)).current;
    const blurTargetRef = useRef<View>(null);
    const insets = useSafeAreaInsets();

    const openSidebar = () => {
        setSidebarOpen(true);
        Animated.timing(sidebarAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    const closeSidebar = () => {
        Animated.timing(sidebarAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start(() => setSidebarOpen(false));
    };

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

    const menuTop = insets.top + HEADER_HEIGHT - 6;
    const menuRight = H_PADDING - 6;

    const selectedCollectionName = selectedCollectionId
        ? (collections.find((c) => c.id === selectedCollectionId)?.name ?? "")
        : "All Notes";
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

    const handleAddCollection = () => {
        setEditingCollection(null);
        setPromptValue("");
        setPromptAction("create");
        setPromptVisible(true);
    };

    const handleRenameCollection = (collectionId: string, currentName: string) => {
        setEditingCollection({ id: collectionId, name: currentName });
        setPromptValue(currentName);
        setPromptAction(null);
        setPromptVisible(true);
    };

    const handlePromptSubmit = () => {
        const trimmed = promptValue.trim();
        if (!trimmed) return;
        setPromptVisible(false);
        if (promptAction === "create") {
            addCollection(trimmed);
        } else if (editingCollection) {
            editCollection(editingCollection.id, trimmed);
        }
    };

    const handleDeleteCollection = (collectionId: string, name: string) => {
        Alert.alert(
            "Delete Collection",
            `Delete "${name}"? Notes in it will move to "All Notes".`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => removeCollection(collectionId),
                },
            ],
        );
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
        <View style={styles.container}>
            <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
                <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
                    <StatusBar style="dark" />
                    <NavigationBar style="dark" />
                    {menuVisible && (
                        <Pressable
                            style={[
                                styles.menuOverlay,
                                {
                                    paddingTop: menuTop,
                                    paddingRight: menuRight,
                                },
                            ]}
                            onPress={() => setMenuVisible(false)}
                        >
                            <View style={styles.menuContainer}>
                                <View style={styles.menuInfo}>
                                    <Text style={styles.menuName}>{user.name ?? "User"}</Text>
                                    <Text style={styles.menuEmail}>{user.email}</Text>
                                </View>
                                <View style={styles.menuDivider} />
                                <View style={styles.menuActions}>
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
                            </View>
                        </Pressable>
                    )}

                    <KeyboardAvoidingView
                        style={styles.inner}
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        keyboardVerticalOffset={0}
                    >
                        {/* Header bar */}
                        <View style={styles.headerBar}>
                            <TouchableOpacity
                                onPress={openSidebar}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Text style={styles.hamburger}>☰</Text>
                            </TouchableOpacity>
                            <Text style={styles.appName} numberOfLines={1}>
                                {selectedCollectionName}
                            </Text>
                            <TouchableOpacity onPress={() => setMenuVisible(true)}>
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

                        {/* Notes list */}
                        <FlatList
                            data={notes}
                            keyExtractor={(item) => item.id}
                            renderItem={renderNote}
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={
                                notesLoading ? (
                                    <ActivityIndicator
                                        size="large"
                                        color="#208AEF"
                                        style={styles.loader}
                                    />
                                ) : (
                                    <Text style={styles.emptyText}>
                                        No notes yet. Tap + to create one!
                                    </Text>
                                )
                            }
                        />

                        <TouchableOpacity
                            style={styles.fab}
                            onPress={() => router.push("/new-note")}
                        >
                            <Text style={styles.fabText}>+</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>

                    {/* Collection prompt modal */}
                    <Modal
                        visible={promptVisible}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setPromptVisible(false)}
                    >
                        <Pressable
                            style={styles.pickerOverlay}
                            onPress={() => setPromptVisible(false)}
                        >
                            <View style={styles.promptContainer}>
                                <Text style={styles.promptTitle}>
                                    {editingCollection ? "Rename Collection" : "New Collection"}
                                </Text>
                                <TextInput
                                    style={styles.promptInput}
                                    placeholder="Collection name"
                                    placeholderTextColor="#999"
                                    value={promptValue}
                                    onChangeText={setPromptValue}
                                    autoFocus
                                    onSubmitEditing={handlePromptSubmit}
                                />
                                <View style={styles.promptButtons}>
                                    <TouchableOpacity
                                        style={styles.promptCancel}
                                        onPress={() => setPromptVisible(false)}
                                    >
                                        <Text style={styles.promptCancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.promptConfirm}
                                        onPress={handlePromptSubmit}
                                    >
                                        <Text style={styles.promptConfirmText}>
                                            {editingCollection ? "Rename" : "Create"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Pressable>
                    </Modal>
                </SafeAreaView>
            </BlurTargetView>

            {/* Sidebar overlay */}
            {sidebarOpen && (
                <View style={styles.sidebarOverlay}>
                    <Animated.View
                        style={[
                            styles.sidebarBackdrop,
                            {
                                opacity: sidebarAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                }),
                            },
                        ]}
                    >
                        <BlurView
                            blurTarget={blurTargetRef}
                            blurMethod="dimezisBlurViewSdk31Plus"
                            intensity={50}
                            tint="dark"
                            style={{ flex: 1 }}
                        >
                            <Pressable style={{ flex: 1 }} onPress={closeSidebar} />
                        </BlurView>
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
                        <View style={styles.sidebarHeader}>
                            <Text style={styles.sidebarTitle}>Collections</Text>
                            <TouchableOpacity
                                onPress={handleAddCollection}
                                hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                }}
                            >
                                <Text style={styles.sidebarAddButton}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.sidebarItem,
                                !selectedCollectionId && styles.sidebarItemActive,
                            ]}
                            onPress={() => {
                                selectCollection(null);
                                closeSidebar();
                            }}
                        >
                            <Text
                                style={[
                                    styles.sidebarItemText,
                                    !selectedCollectionId && styles.sidebarItemTextActive,
                                ]}
                            >
                                All Notes
                            </Text>
                        </TouchableOpacity>

                        {collections.map((c) => (
                            <TouchableOpacity
                                key={c.id}
                                style={[
                                    styles.sidebarItem,
                                    selectedCollectionId === c.id && styles.sidebarItemActive,
                                ]}
                                onPress={() => {
                                    selectCollection(c.id);
                                    closeSidebar();
                                }}
                                onLongPress={() => {
                                    Alert.alert(c.name, undefined, [
                                        {
                                            text: "Rename",
                                            onPress: () => handleRenameCollection(c.id, c.name),
                                        },
                                        {
                                            text: "Delete",
                                            style: "destructive",
                                            onPress: () => handleDeleteCollection(c.id, c.name),
                                        },
                                        {
                                            text: "Cancel",
                                            style: "cancel",
                                        },
                                    ]);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.sidebarItemText,
                                        selectedCollectionId === c.id &&
                                            styles.sidebarItemTextActive,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {c.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </View>
            )}
        </View>
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
    // Header bar
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e0e0e0",
        backgroundColor: "#fff",
        gap: 12,
    },
    hamburger: {
        fontSize: 22,
        color: "#333",
    },
    appName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#208AEF",
        flex: 1,
        textAlign: "center",
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
    // Sidebar
    sidebarOverlay: {
        ...StyleSheet.absoluteFill,
        zIndex: 100,
    },
    sidebarBackdrop: {
        ...StyleSheet.absoluteFill,
    },
    sidebar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 320,
        backgroundColor: "#fff",
        paddingTop: 60,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: "#e0e0e0",
    },
    sidebarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    sidebarTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },
    sidebarAddButton: {
        fontSize: 24,
        color: "#208AEF",
        fontWeight: "600",
    },
    sidebarItem: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#f0f0f0",
    },
    sidebarItemActive: {
        backgroundColor: "#e8f4fd",
    },
    sidebarItemText: {
        fontSize: 15,
        color: "#333",
    },
    sidebarItemTextActive: {
        color: "#208AEF",
        fontWeight: "600",
    },
    // Contextual menu
    menuOverlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: "flex-start",
        alignItems: "flex-end",
        zIndex: 50,
    },
    menuContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 240,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 2,
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
        padding: 16,
        gap: 4,
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
    menuItem: {},
    menuItemText: {
        fontSize: 15,
        color: "#333",
    },
    menuItemTextDanger: {
        fontSize: 15,
        color: "#e74c3c",
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
        color: "#999",
        fontSize: 15,
        marginTop: 40,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#208AEF",
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 28,
        color: "#fff",
        lineHeight: 30,
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
    // Form
    form: {
        padding: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e0e0e0",
        gap: 10,
        backgroundColor: "#fff",
    },
    formRow: {
        flexDirection: "row",
        gap: 8,
    },
    titleInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: "#333",
    },
    collectionPicker: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 10,
        gap: 4,
    },
    collectionPickerText: {
        fontSize: 13,
        color: "#555",
        maxWidth: 70,
    },
    collectionPickerArrow: {
        fontSize: 12,
        color: "#999",
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
    // Prompt modal
    pickerOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    promptContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        width: 280,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    promptTitle: {
        fontSize: 17,
        fontWeight: "600",
        color: "#333",
        marginBottom: 14,
    },
    promptInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        fontSize: 15,
        color: "#333",
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
        color: "#666",
    },
    promptConfirm: {
        backgroundColor: "#208AEF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    promptConfirmText: {
        fontSize: 15,
        color: "#fff",
        fontWeight: "600",
    },
});
