import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import {
    createNote,
    updateNote,
    deleteNote,
    subscribeToNotes,
    type Note,
} from "@/services/notes";
import { useAuth } from "./AuthContext";

interface NotesContextValue {
    notes: Note[];
    isLoading: boolean;
    addNote: (title: string, content: string) => Promise<void>;
    editNote: (noteId: string, title: string, content: string) => Promise<void>;
    removeNote: (noteId: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setNotes([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        const unsubscribe = subscribeToNotes(
            user.id,
            (fetchedNotes) => {
                setNotes(fetchedNotes);
                setIsLoading(false);
            },
            (error) => {
                console.error("Failed to subscribe to notes:", error);
                setIsLoading(false);
            }
        );

        return unsubscribe;
    }, [user]);

    const addNote = useCallback(
        async (title: string, content: string) => {
            if (!user) return;
            await createNote(user.id, title, content);
        },
        [user]
    );

    const editNote = useCallback(
        async (noteId: string, title: string, content: string) => {
            await updateNote(noteId, title, content);
        },
        []
    );

    const removeNote = useCallback(async (noteId: string) => {
        await deleteNote(noteId);
    }, []);

    return (
        <NotesContext.Provider
            value={{ notes, isLoading, addNote, editNote, removeNote }}
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
