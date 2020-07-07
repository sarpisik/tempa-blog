const urlPrefix =
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

export default function resolveAvatarUrl(avatarUrl: string, resolve = true) {
    return resolve ? `${urlPrefix}/${avatarUrl}` : avatarUrl;
}
