export interface IBlog {
    id: string;
    created_at: string;
    author_id: string;
    status: 'draft' | 'published';
    content: string;
}
