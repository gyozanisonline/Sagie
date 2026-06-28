import { WORK } from '@/lib/work';
import { mediumFor } from '@/lib/medium';
import StudioClient from './StudioClient';

export const metadata = { title: 'Curation Studio', robots: { index: false } };

// Local curation tool: pick the front/thumbnail per project + fix medium tags.
export default function StudioPage() {
    const items = WORK.map((p) => {
        const images = [];
        if (p.content.CoverImage?.filename) images.push(p.content.CoverImage.filename);
        if (Array.isArray(p.content.Images)) {
            images.push(...p.content.Images.map((i) => i?.filename).filter(Boolean));
        }
        return {
            slug: p.slug,
            title: p.content.Title || p.slug,
            category: p.content.Category || '',
            autoMedium: mediumFor(p) || '',
            images,
        };
    });

    return <StudioClient items={items} />;
}
