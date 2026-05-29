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
    writeBatch,
    type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CollectionColor } from "./collectionColors";

export interface NoteCollection {
    id: string;
    name: string;
    userId: string;
    color: CollectionColor;
    createdAt: Timestamp | null;
}

const COLLECTIONS_PATH = "collections";
const NOTES_PATH = "notes";

export async function createCollection(
    userId: string,
    name: string,
    color: CollectionColor,
): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS_PATH), {
        userId,
        name,
        color,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function renameCollection(collectionId: string, name: string): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS_PATH, collectionId), { name });
}

export async function deleteCollection(collectionId: string, userId: string): Promise<void> {
    const batch = writeBatch(db);

    // Remove collectionId from all notes in this collection
    const notesQuery = query(
        collection(db, NOTES_PATH),
        where("userId", "==", userId),
        where("collectionId", "==", collectionId),
    );

    // Get current notes (onSnapshot not suitable here, we need a one-time read)
    const { getDocs } = await import("firebase/firestore");
    const snapshot = await getDocs(notesQuery);
    snapshot.forEach((docSnapshot) => {
        batch.update(docSnapshot.ref, { collectionId: null });
    });

    // Delete the collection
    batch.delete(doc(db, COLLECTIONS_PATH, collectionId));

    await batch.commit();
}

export function subscribeToCollections(
    userId: string,
    onCollections: (collections: NoteCollection[]) => void,
    onError: (error: Error) => void,
): () => void {
    const q = query(
        collection(db, COLLECTIONS_PATH),
        where("userId", "==", userId),
        orderBy("createdAt", "asc"),
    );

    return onSnapshot(
        q,
        (snapshot) => {
            const collections: NoteCollection[] = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as NoteCollection[];
            onCollections(collections);
        },
        onError,
    );
}
