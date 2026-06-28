'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ProjectCarousel.module.css';

export default function ProjectCarousel({ images = [], title = '', category = '', nextSlug = null, nextTitle = '' }) {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    useEffect(() => {
        if (!images.length) return;
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [images.length]);

    if (!images.length) return null;

    return (
        <div className={styles.carousel}>
            <header className={styles.meta}>
                <h1 className={styles.title}>{title}</h1>
                {category && <p className={styles.category}>{category}</p>}
            </header>

            <div key={current} className={styles.imageWrap}>
                <Image
                    src={images[current].filename}
                    alt={`${title} — image ${current + 1}`}
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'contain' }}
                    priority
                />
            </div>

            <div className={styles.controls}>
                <button className={styles.arrow} onClick={prev} aria-label="Previous">←</button>
                <span className={styles.count}>{current + 1} / {images.length}</span>
                <button className={styles.arrow} onClick={next} aria-label="Next">→</button>
            </div>

            {nextSlug && (
                <Link href={`/work/${nextSlug}`} className={styles.nextLink} aria-label={`Next project: ${nextTitle}`}>
                    <span className={styles.nextLabel}>Next</span>
                    <span className={styles.nextTitle}>{nextTitle}</span>
                    <span aria-hidden="true">→</span>
                </Link>
            )}
        </div>
    );
}
