import { PROJECTS } from './projects';

// The Sneakerbox category was auto-split into 210 per-image "projects".
// Fold them back into ONE project whose Images are all 210 pieces, so it reads
// as a single body of work (and the archive grid still expands those images).
function consolidateSneakerbox(projects) {
    const sneaker = projects.filter((p) => p.content.Category === 'Sneakerbox TLV');
    if (sneaker.length <= 1) return projects;
    const rest = projects.filter((p) => p.content.Category !== 'Sneakerbox TLV');

    const images = [];
    for (const p of sneaker) {
        if (p.content.CoverImage?.filename) images.push(p.content.CoverImage);
        if (Array.isArray(p.content.Images)) {
            for (const im of p.content.Images) if (im?.filename) images.push(im);
        }
    }

    const folded = {
        slug: 'sneakerbox-tlv',
        content: {
            Title: 'Sneakerbox TLV',
            Category: 'Sneakerbox TLV',
            CoverImage: sneaker[0].content.CoverImage,
            Images: images,
        },
    };

    return [...rest, folded];
}

// The canonical work list the whole site reads (vs the raw generated PROJECTS).
export const WORK = consolidateSneakerbox(PROJECTS);
