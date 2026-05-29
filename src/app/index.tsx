import {
    Text,
    View,
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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurTargetView } from "expo-blur";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import { router } from "expo-router";
import { ListIcon, PlusIcon } from "phosphor-react-native";
import { NoteCard } from "@/components/NoteCard";
import { COLLECTION_COLORS, CollectionColor } from "@/services/collectionColors";
import { Sidebar } from "@/components/Sidebar";
import { styles } from "@/styles/index.styles";

const BASE_BG = "#fff";
const HEADER_HEIGHT = 56;
const H_PADDING = 16;

export default function Index() {
    const { user, isLoading: authLoading, signIn, signOut } = useAuth();
    const {
        notes,
        isLoading: notesLoading,
        collections,
        selectedCollectionId,
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
    const [selectedColor, setSelectedColor] = useState<CollectionColor>(COLLECTION_COLORS[0]);
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
        : "All notes";

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
        setSelectedColor(COLLECTION_COLORS[0]);
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
            addCollection(trimmed, selectedColor);
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
                                <ListIcon size={22} color="#333" weight="bold" />
                            </TouchableOpacity>
                            <Image
                                source={require("@/assets/mini-note-logo.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />
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
                            renderItem={({ item }) => <NoteCard note={item} />}
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
                            <PlusIcon size={28} color="#fff" weight="bold" />
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
                                {promptAction === "create" && (
                                    <View style={styles.colorRow}>
                                        {COLLECTION_COLORS.map((color) => (
                                            <TouchableOpacity
                                                key={color}
                                                style={[
                                                    styles.colorDot,
                                                    { backgroundColor: color },
                                                    selectedColor === color &&
                                                        styles.colorDotSelected,
                                                ]}
                                                onPress={() => setSelectedColor(color)}
                                            />
                                        ))}
                                    </View>
                                )}
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
                <Sidebar
                    sidebarAnim={sidebarAnim}
                    blurTargetRef={blurTargetRef}
                    onClose={closeSidebar}
                    onAddCollection={handleAddCollection}
                    onRenameCollection={handleRenameCollection}
                    onDeleteCollection={handleDeleteCollection}
                />
            )}
        </View>
    );
}
