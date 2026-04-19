'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './ProjectCarousel.module.css';

export default function ProjectCarousel({ images = [], title = '' }) {
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
            <h1 className={styles.title}>{title}</h1>

            {/* Main image — key on wrapper triggers fade-in on each change */}
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

            {/* Controls */}
            <div className={styles.controls}>
                <button className={styles.arrow} onClick={prev} aria-label="Previous">←</button>
                <span className={styles.count}>{current + 1} / {images.length}</span>
                <button className={styles.arrow} onClick={next} aria-label="Next">→</button>
            </div>
        </div>
    );
}
