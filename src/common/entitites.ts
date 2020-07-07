export interface IAuthor extends PreAuthor {
    id: string;
    created_at: string;
}
export interface PreAuthor {
    name: string;
    email: string;
    bio: string;
    avatar_url: ImageFormats;
}
interface ImageFormats {
    src: string;
    lqip: string;
    webp: string;
}
