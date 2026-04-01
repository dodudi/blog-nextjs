export interface Post {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export interface Draft {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    savedAt: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
}
