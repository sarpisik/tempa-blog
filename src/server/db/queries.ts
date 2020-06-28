export default [
    // Create uuid primary key generator
    `CREATE EXTENSION IF NOT EXISTS "pgcrypto"`,

    // Create post statuses if not exists
    `
    DO $$ BEGIN
        CREATE TYPE post_status AS ENUM ('draft', 'published');
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;
    `,

    // Create authors table
    `CREATE TABLE IF NOT EXISTS authors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(255) NOT NULL,
        avatar_url text NOT NULL,
        description text NOT NULL,
        created_at TIMESTAMPTZ DEFAULT Now()
    )`,

    // Create posts table
    `CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT Now(),
        author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
        status post_status default 'draft',
        content text NOT NULL
    )`,

    // Create users table
    `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT Now()
    )`,

    // Create comments table
    `CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT Now(),
        users_id UUID REFERENCES userss(id) ON DELETE CASCADE,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        content text NOT NULL
    )`,
];
