'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { thumb } from '../../lib/thumbs.js';
import styles from './HomeStrip.module.css';

export default function HomeStrip({ projects = [] }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const [ready, setReady] = useState(false);
    const last = projects.length - 1;

    return (
        <>
        <Link href="/work" className={styles.mobileCta}>
            Enter the archive →
        </Link>
        <div className={styles.strip} data-ready={String(ready)}>
            {projects.map((p, i) => (
                <Link
                    key={p.slug}
                    href={`/work/${p.slug}`}
                    className={styles.item}
                    data-active={String(activeIndex === i)}
                    data-is-first={String(i === 0)}
                    data-is-last={String(i === last)}
                    data-before-active={String(activeIndex !== null && i < activeIndex)}
                    data-after-active={String(activeIndex !== null && i > activeIndex)}
                    data-hovered-first={String(activeIndex === 0)}
                    data-hovered-last={String(activeIndex === last)}
                    onMouseEnter={() => { setActiveIndex(i); setReady(true); }}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <span className={styles.title}>{p.content.Title}</span>
                    <div className={styles.image}>
                        {p.content.CoverImage?.filename && (
                            <Image
                                src={thumb(p.content.CoverImage.filename)}
                                alt={p.content.Title || ''}
                                width={256}
                                height={256}
                                sizes="200px"
                                unoptimized
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        )}
                    </div>
                </Link>
            ))}
        </div>
        </>
    );
}
