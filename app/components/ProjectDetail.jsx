'use client';
import { useState } from 'react';
import Link from 'next/link';
import { thumb } from '@/lib/thumbs';
import styles from './ProjectDetail.module.css';

// Frame-05 layout: dark, serif title, large hero, left thumbnail rail,
// circular next arrow. Shared "inside a project" template across categories.
export default function ProjectDetail({ images = [], title, category, nextSlug, nextTitle }) {
    const [active, setActive] = useState(0);
    const list = images.filter((img) => img?.filename);
    const hero = list[active]?.filename;

    return (
        <div className={styles.root}>
            <header className={styles.bar}>
                <Link href="/work" className={styles.navLink}>Work</Link>
                <Link href="/" className={styles.logo}>Sagie Maya</Link>
                <Link href="/info" className={styles.navLink}>Info</Link>
            </header>

            <div className={styles.body}>
                <div className={styles.rail}>
                    {list.map((img, i) => (
                        <button
                            key={i}
                            type="button"
                            className={`${styles.thumb} ${i === active ? styles.thumbActive : ''}`}
                            onClick={() => setActive(i)}
                            aria-label={`View image ${i + 1} of ${list.length}`}
                            aria-pressed={i === active}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={thumb(img.filename)} alt="" draggable={false} />
                        </button>
                    ))}
                </div>

                <div className={styles.heroWrap}>
                    {hero && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={styles.hero} src={thumb(hero)} alt={title || ''} draggable={false} />
                    )}
                </div>

                <div className={styles.meta}>
                    <div className={styles.metaTop}>
                        <h1 className={styles.title}>{title}</h1>
                        {category && <p className={styles.category}>{category}</p>}
                        <p className={styles.count}>
                            {list.length} {list.length === 1 ? 'image' : 'images'}
                        </p>
                    </div>

                    {nextSlug && (
                        <Link
                            href={`/work/${nextSlug}`}
                            className={styles.next}
                            aria-label={`Next project${nextTitle ? `: ${nextTitle}` : ''}`}
                        >
                            <span className={styles.nextLabel}>Next</span>
                            <span className={styles.nextCircle} aria-hidden="true">›</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
