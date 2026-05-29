import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { NoteIcon } from "phosphor-react-native";
import type { Note } from "@/services/notes";
import { styles } from "./NoteCard.styles";
import { colors } from "../styles";

interface NoteCardProps {
    note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/note/${note.id}`)}>
            <NoteIcon
                size={22}
                color={colors.black}
                weight="bold"
                style={{ marginRight: 12, marginTop: 3 }}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>
                    {note.title}
                </Text>
                {note.content ? (
                    <Text style={styles.content} numberOfLines={3}>
                        {note.content}
                    </Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );
}
