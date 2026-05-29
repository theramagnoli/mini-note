import {
    GoogleSignin,
    isSuccessResponse,
    isErrorWithCode,
    statusCodes,
    type User,
} from "@react-native-google-signin/google-signin";
import {
    getAuth,
    signInWithCredential,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export function configureGoogleSignIn(): void {
    GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
}

export interface AuthUser {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
}

async function signIntoFirebase(idToken: string): Promise<string> {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return result.user.uid;
}

function mapUser(googleUser: User, firebaseUid: string): AuthUser {
    return {
        id: firebaseUid,
        name: googleUser.user.name,
        email: googleUser.user.email,
        photo: googleUser.user.photo,
    };
}

export async function signIn(): Promise<AuthUser | null> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
        const idToken = response.data.idToken;
        if (!idToken) throw new Error("Google sign-in did not return an ID token.");
        const firebaseUid = await signIntoFirebase(idToken);
        return mapUser(response.data, firebaseUid);
    }

    return null;
}

export async function signInSilently(): Promise<AuthUser | null> {
    const response = await GoogleSignin.signInSilently();

    if (response.type === "success") {
        const idToken = response.data.idToken;
        if (!idToken) throw new Error("Google sign-in did not return an ID token.");
        const firebaseUid = await signIntoFirebase(idToken);
        return mapUser(response.data, firebaseUid);
    }

    return null;
}

export async function signOut(): Promise<void> {
    await GoogleSignin.signOut();
    await firebaseSignOut(auth);
}

export function getCurrentUser(): AuthUser | null {
    const googleUser = GoogleSignin.getCurrentUser();
    const firebaseUser = auth.currentUser;

    if (googleUser && firebaseUser) {
        return mapUser(googleUser, firebaseUser.uid);
    }
    return null;
}

export { isSuccessResponse, isErrorWithCode, statusCodes };
