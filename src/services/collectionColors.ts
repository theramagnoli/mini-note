export const COLLECTION_COLORS = [
    "#B8860B",
    "#e74c3c",
    "#2ecc71",
    "#f39c12",
    "#9b59b6",
    "#1abc9c",
    "#e67e22",
    "#3498db",
] as const;

export type CollectionColor = (typeof COLLECTION_COLORS)[number];
