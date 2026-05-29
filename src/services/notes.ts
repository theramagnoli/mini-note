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
    createdAt: Timestamp | null;
    updatedAt: Timestamp | null;
}

const NOTES_COLLECTION = "notes";

export async function createNote(userId: string, title: string, content: string): Promise<string> {
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
        userId,
        title,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateNote(noteId: string, title: string, content: string): Promise<void> {
    await updateDoc(doc(db, NOTES_COLLECTION, noteId), {
        title,
        content,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteNote(noteId: string): Promise<void> {
    await deleteDoc(doc(db, NOTES_COLLECTION, noteId));
}

export function subscribeToNotes(
    userId: string,
    onNotes: (notes: Note[]) => void,
    onError: (error: Error) => void,
): () => void {
    const q = query(
        collection(db, NOTES_COLLECTION),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
    );

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
