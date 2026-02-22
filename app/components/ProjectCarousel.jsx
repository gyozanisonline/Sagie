'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './ProjectCarousel.module.css';

export default function ProjectCarousel({ images = [], title = '' }) {
    const [current, setCurrent] = useState(0);

    if (!images.length) return null;

    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
    const next = () => setCurrent((c) => (c + 1) % images.length);

    return (
        <div className={styles.carousel}>
            <h1 className={styles.title}>{title}</h1>

            {/* Main image */}
            <div className={styles.imageWrap}>
                <Image
                    key={current}
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
                <div className={styles.dots}>
                    {images.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                            onClick={() => setCurrent(i)}
                            aria-label={`Image ${i + 1}`}
                        />
                    ))}
                </div>
                <button className={styles.arrow} onClick={next} aria-label="Next">→</button>
            </div>
        </div>
    );
}
