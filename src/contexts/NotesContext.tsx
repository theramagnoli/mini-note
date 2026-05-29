import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createNote, updateNote, deleteNote, subscribeToNotes, type Note } from "@/services/notes";
import {
    createCollection,
    renameCollection,
    deleteCollection,
    subscribeToCollections,
    type NoteCollection,
} from "@/services/collections";
import { useAuth } from "./AuthContext";

interface NotesContextValue {
    notes: Note[];
    isLoading: boolean;
    collections: NoteCollection[];
    selectedCollectionId: string | null;
    selectCollection: (id: string | null) => void;
    addNote: (title: string, content: string, collectionId?: string | null) => Promise<void>;
    editNote: (noteId: string, title: string, content: string) => Promise<void>;
    removeNote: (noteId: string) => Promise<void>;
    addCollection: (name: string) => Promise<void>;
    editCollection: (collectionId: string, name: string) => Promise<void>;
    removeCollection: (collectionId: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [collections, setCollections] = useState<NoteCollection[]>([]);
    const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

    // Subscribe to collections
    useEffect(() => {
        if (!user) {
            setCollections([]);
            return;
        }

        const unsubscribe = subscribeToCollections(user.id, setCollections, (error) =>
            console.error("Failed to subscribe to collections:", error),
        );

        return unsubscribe;
    }, [user]);

    // Subscribe to notes filtered by selected collection
    useEffect(() => {
        if (!user) {
            setNotes([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const unsubscribe = subscribeToNotes(
            user.id,
            selectedCollectionId,
            (fetchedNotes) => {
                setNotes(fetchedNotes);
                setIsLoading(false);
            },
            (error) => {
                console.error("Failed to subscribe to notes:", error);
                setIsLoading(false);
            },
        );

        return unsubscribe;
    }, [user, selectedCollectionId]);

    const selectCollection = useCallback((id: string | null) => {
        setSelectedCollectionId(id);
    }, []);

    const addNote = useCallback(
        async (title: string, content: string, collectionId?: string | null) => {
            if (!user) return;
            const targetCollection =
                collectionId !== undefined ? collectionId : selectedCollectionId;
            await createNote(user.id, title, content, targetCollection);
        },
        [user, selectedCollectionId],
    );

    const editNote = useCallback(async (noteId: string, title: string, content: string) => {
        await updateNote(noteId, { title, content });
    }, []);

    const removeNote = useCallback(async (noteId: string) => {
        await deleteNote(noteId);
    }, []);

    const addCollection = useCallback(
        async (name: string) => {
            if (!user) return;
            await createCollection(user.id, name);
        },
        [user],
    );

    const editCollection = useCallback(async (collectionId: string, name: string) => {
        await renameCollection(collectionId, name);
    }, []);

    const removeCollection = useCallback(
        async (collectionId: string) => {
            if (!user) return;
            await deleteCollection(collectionId, user.id);
            if (selectedCollectionId === collectionId) {
                setSelectedCollectionId(null);
            }
        },
        [user, selectedCollectionId],
    );

    return (
        <NotesContext.Provider
            value={{
                notes,
                isLoading,
                collections,
                selectedCollectionId,
                selectCollection,
                addNote,
                editNote,
                removeNote,
                addCollection,
                editCollection,
                removeCollection,
            }}
        >
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes(): NotesContextValue {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error("useNotes must be used within a NotesProvider");
    }
    return context;
}
