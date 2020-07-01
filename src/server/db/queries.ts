export const create_uuid_generator = `CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

export const create_type_post_status = `
DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
`;

export const authors_table = `CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    avatar_url text NOT NULL,
    bio text NOT NULL,
    created_at TIMESTAMPTZ DEFAULT Now()
)`;

export const blogs_table = `CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT Now(),
    author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
    status post_status default 'draft',
    content text NOT NULL
)`;

export const users_table = `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT Now()
)`;

export const comments_table = `CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT Now(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blog_id UUID REFERENCES blogs(id) ON DELETE CASCADE,
    content text NOT NULL
)`;
