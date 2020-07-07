export interface PreAuthor {
    name: string;
    email: string;
    bio: string;
    avatar_url: string;
}
export interface IAuthor extends PreAuthor {
    id: string;
    created_at: string;
}
