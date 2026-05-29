import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
    configureGoogleSignIn,
    signIn as googleSignIn,
    signInSilently,
    signOut as googleSignOut,
    getCurrentUser,
    type AuthUser,
} from "@/services/auth";

interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        configureGoogleSignIn();

        signInSilently()
            .then((restoredUser) => {
                if (restoredUser) {
                    setUser(restoredUser);
                }
            })
            .catch(() => {
                // Silent sign-in failed, user is not signed in
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleSignIn = useCallback(async () => {
        try {
            const signedInUser = await googleSignIn();
            if (signedInUser) {
                setUser(signedInUser);
            }
        } catch (error: any) {
            console.error("Sign-in failed:", error);
            alert(error?.message ?? "Sign-in failed. Please try again.");
        }
    }, []);

    const handleSignOut = useCallback(async () => {
        await googleSignOut();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                signIn: handleSignIn,
                signOut: handleSignOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
