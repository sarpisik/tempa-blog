export function manifestParser(): { [key: string]: string } {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const manifest = require('../public/manifest.json');
    return manifest;
}

export function srcGenerator(src: string): string {
    return `/${src}`;
}
