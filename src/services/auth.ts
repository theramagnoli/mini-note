import {
    GoogleSignin,
    isSuccessResponse,
    isErrorWithCode,
    statusCodes,
    type User,
} from "@react-native-google-signin/google-signin";

export function configureGoogleSignIn(): void {
    GoogleSignin.configure({
        // webClientId is auto-detected from Firebase config files.
        // If auto-detection fails, provide it explicitly:
        // webClientId: "<YOUR_WEB_CLIENT_ID>.apps.googleusercontent.com",
    });
}

export interface AuthUser {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
    idToken: string | null;
}

function mapUser(user: User): AuthUser {
    return {
        id: user.user.id,
        name: user.user.name,
        email: user.user.email,
        photo: user.user.photo,
        idToken: user.idToken,
    };
}

export async function signIn(): Promise<AuthUser | null> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const response = await GoogleSignin.signIn();

    if (isSuccessResponse(response)) {
        return mapUser(response.data);
    }

    return null;
}

export async function signInSilently(): Promise<AuthUser | null> {
    const response = await GoogleSignin.signInSilently();

    if (response.type === "success") {
        return mapUser(response.data);
    }

    return null;
}

export async function signOut(): Promise<void> {
    await GoogleSignin.signOut();
}

export function getCurrentUser(): AuthUser | null {
    const user = GoogleSignin.getCurrentUser();
    if (user) {
        return mapUser(user);
    }
    return null;
}

export { isSuccessResponse, isErrorWithCode, statusCodes };
