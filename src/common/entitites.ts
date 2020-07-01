export interface PreAuthor {
    name: string;
    bio: string;
}
export interface IAuthor extends PreAuthor {
    id: string;
    avatar_url: string;
    created_at: string;
}
