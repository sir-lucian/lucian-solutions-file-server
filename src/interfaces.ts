interface Fanart {
    artist: string;
    slug?: string | null;
    slug_language?: string | null;
    art: Art[];
}

interface Art {
    filePath: string;
    children: Art[];
}