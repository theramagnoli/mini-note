import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface Note {
    id: string;
    title: string;
    content: string;
    userId: string;
    collectionId: string | null;
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
}

const NOTES_COLLECTION = "notes";

export async function createNote(
    userId: string,
    title: string,
    content: string,
    collectionId: string | null = null,
): Promise<string> {
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
        userId,
        title,
        content,
        collectionId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateNote(
    noteId: string,
    updates: { title?: string; content?: string; collectionId?: string | null },
): Promise<void> {
    await updateDoc(doc(db, NOTES_COLLECTION, noteId), {
        ...updates,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteNote(noteId: string): Promise<void> {
    await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
}

export function subscribeToNotes(
    userId: string,
    collectionId: string | null,
    onNotes: (notes: Note[]) => void,
    onError: (error: Error) => void,
): () => void {
    const constraints: any[] = [where("userId", "==", userId)];

    if (collectionId) {
        constraints.push(where("collectionId", "==", collectionId));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(collection(db, NOTES_COLLECTION), ...constraints);

    return onSnapshot(
        q,
        (snapshot) => {
            const notes: Note[] = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as Note[];
            onNotes(notes);
        },
        onError,
    );
}
