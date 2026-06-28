// Medium tags derived from each project's category + R2 folder path.
// First-pass auto-tagging; refine by hand later. Branding intentionally
// omitted (it lives at the featured-project tier, not as a grid filter).

export const MEDIUMS = ['Poster', 'Cover Art', 'Apparel', 'Sneakers'];

export function mediumFor(project) {
    const cat = project?.content?.Category || '';
    const path = (project?.content?.CoverImage?.filename || '').toLowerCase();

    if (cat === 'Sneakerbox TLV') return 'Sneakers';
    if (cat === 'Special Projects') return 'Sneakers'; // footwear / product collabs

    if (cat === 'Going Places') {
        if (path.includes('/music/')) return 'Cover Art';
        return 'Apparel';
    }

    if (cat === 'Graphic') {
        if (path.includes('/posters/')) return 'Poster';
        if (path.includes('cover%20art') || path.includes('/cover art/')) return 'Cover Art';
        return 'Poster';
    }

    return null;
}

// Distinct mediums actually present in a set of projects, in canonical order.
export function presentMediums(projects) {
    const present = new Set(projects.map(mediumFor).filter(Boolean));
    return MEDIUMS.filter((m) => present.has(m));
}
