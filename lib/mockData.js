// Placeholder projects — used when Storyblok returns empty (no token / dev)
// Replace with real Sanity data on migration.

const imgs = [
    '/placeholders/CIMG0002.JPG',
    '/placeholders/CIMG0003.JPG',
    '/placeholders/CIMG0004.JPG',
    '/placeholders/CIMG0005.JPG',
    '/placeholders/CIMG0006.JPG',
    '/placeholders/CIMG0013.JPG',
    '/placeholders/CIMG0014.JPG',
    '/placeholders/CIMG0015.JPG',
    '/placeholders/CIMG0016.JPG',
    '/placeholders/CIMG0017.JPG',
    '/placeholders/CIMG0018.JPG',
    '/placeholders/CIMG0024.JPG',
];

function img(filename) {
    return { filename };
}

export const MOCK_PROJECTS = [
    {
        slug: 'editorial-i',
        content: {
            Title: 'Editorial I',
            Category: 'Photo',
            Client: 'Vogue Italia',
            CoverImage: img(imgs[0]),
            Images: [img(imgs[1]), img(imgs[2])],
        },
    },
    {
        slug: 'campaign-ss24',
        content: {
            Title: 'Campaign SS24',
            Category: 'Creative Direction',
            Client: 'Stone Island',
            CoverImage: img(imgs[3]),
            Images: [img(imgs[4]), img(imgs[5])],
        },
    },
    {
        slug: 'still-life',
        content: {
            Title: 'Still Life',
            Category: 'Photo',
            Client: 'Dazed & Confused',
            CoverImage: img(imgs[6]),
            Images: [img(imgs[7])],
        },
    },
    {
        slug: 'portrait-series',
        content: {
            Title: 'Portrait Series',
            Category: 'Photo',
            Client: 'Vogue Italia',
            CoverImage: img(imgs[8]),
            Images: [img(imgs[9]), img(imgs[10])],
        },
    },
    {
        slug: 'moving-image-01',
        content: {
            Title: 'Moving Image 01',
            Category: 'Video',
            Client: 'Self-Initiated',
            CoverImage: img(imgs[11]),
            Images: [img(imgs[0])],
        },
    },
    {
        slug: 'brand-identity',
        content: {
            Title: 'Brand Identity',
            Category: 'Creative Direction',
            Client: 'Stone Island',
            CoverImage: img(imgs[2]),
            Images: [img(imgs[3]), img(imgs[4])],
        },
    },
    {
        slug: 'lookbook-aw23',
        content: {
            Title: 'Lookbook AW23',
            Category: 'Special Projects',
            Client: 'Dazed & Confused',
            CoverImage: img(imgs[5]),
            Images: [img(imgs[6]), img(imgs[7])],
        },
    },
    {
        slug: 'nature-study',
        content: {
            Title: 'Nature Study',
            Category: 'Photo',
            Client: 'Self-Initiated',
            CoverImage: img(imgs[9]),
            Images: [img(imgs[10]), img(imgs[11])],
        },
    },
];

export const MOCK_FEATURED = MOCK_PROJECTS.slice(0, 6);
