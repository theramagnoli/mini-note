import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
    const { user, isLoading, signIn, signOut } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#208AEF" />
            </View>
        );
    }

    if (user) {
        return (
            <View style={styles.container}>
                {user.photo ? (
                    <Image source={{ uri: user.photo }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>
                            {user.name?.charAt(0) ?? user.email.charAt(0)}
                        </Text>
                    </View>
                )}
                <Text style={styles.name}>{user.name ?? "User"}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mini Note</Text>
            <Text style={styles.subtitle}>Sign in to get started</Text>
            <TouchableOpacity style={styles.googleButton} onPress={signIn}>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        padding: 24,
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
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 16,
    },
    avatarPlaceholder: {
        backgroundColor: "#208AEF",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "700",
    },
    name: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: "#888",
        marginBottom: 24,
    },
    signOutButton: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    signOutText: {
        color: "#666",
        fontSize: 14,
    },
});
