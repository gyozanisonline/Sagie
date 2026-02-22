'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProjectGrid.module.css';

const FILTERS = ['All', 'Photo', 'Video', 'Creative Direction', 'Special Projects'];

export default function ProjectGrid({ projects = [] }) {
    const [active, setActive] = useState('All');

    const filtered = active === 'All'
        ? projects
        : projects.filter((p) => p.content.category === active);

    return (
        <div className={styles.wrapper}>
            {/* Filter tabs */}
            <nav className={styles.filters}>
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        className={`${styles.filter} ${active === f ? styles.filterActive : ''}`}
                        onClick={() => setActive(f)}
                    >
                        {f}
                    </button>
                ))}
            </nav>

            {/* Grid */}
            <div className={styles.grid}>
                {filtered.map((project) => (
                    <Link
                        key={project.slug}
                        href={`/work/${project.slug}`}
                        className={styles.item}
                    >
                        <span className={styles.itemTitle}>{project.content.title}</span>
                        <div className={styles.itemImage}>
                            {project.content.cover_image?.filename && (
                                <Image
                                    src={project.content.cover_image.filename}
                                    alt={project.content.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
