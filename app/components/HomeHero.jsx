import Link from 'next/link';
import Image from 'next/image';
import { thumb, thumbDims } from '@/lib/thumbs';
import { WORK } from '@/lib/work';
import curation from '@/data/curation.json';
import styles from './HomeHero.module.css';

// Frame 01 / Hero.png: a centred row of selected work along the bottom.
// Driven by the "Featured" toggles in /studio. Falls back to this set until
// any project is marked featured, so the hero is never empty.
const HERO_SLUGS = ['poster-mika2', 'hummus', 'naot-01', 'collection-1', 'poster-levontin'];

const bySlug = Object.fromEntries(WORK.map((p) => [p.slug, p]));

export default function HomeHero() {
    const featured = curation.featured?.length ? curation.featured : HERO_SLUGS;
    const picks = featured.map((s) => bySlug[s]).filter((p) => p?.content?.CoverImage?.filename);

    return (
        <section className={styles.hero} aria-label="Selected work">
            <div className={styles.strip}>
                {picks.map((p) => {
                    const src = p.content.CoverImage.filename;
                    const dims = thumbDims(src) || { w: 800, h: 1000 };
                    return (
                        <figure key={p.slug} className={styles.fig}>
                            <Link href={`/work/${p.slug}`} className={styles.link}>
                                <Image
                                    src={thumb(src)}
                                    alt={p.content.Title || ''}
                                    width={dims.w}
                                    height={dims.h}
                                    unoptimized
                                    priority
                                    className={styles.img}
                                    sizes="(max-width: 640px) 40vw, 15vw"
                                />
                            </Link>
                        </figure>
                    );
                })}
            </div>
        </section>
    );
}
