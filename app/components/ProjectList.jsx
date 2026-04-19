'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProjectList.module.css';

const FILTERS = ['All', 'Going Places', 'Graphic Design', 'Sneakerbox TLV', 'Collaborations'];

// Build groups from filtered projects, with a global sequential counter.
function buildGroups(projects, groupBy) {
    const groupMap = new Map();
    projects.forEach((p) => {
        const key = p.content[groupBy] || 'Other';
        if (!groupMap.has(key)) groupMap.set(key, []);
        groupMap.get(key).push(p);
    });

    let counter = 0;
    return Array.from(groupMap.entries()).map(([name, projs]) => ({
        name,
        projects: projs.map((p) => ({ ...p, _num: ++counter })),
    }));
}

export default function ProjectList({ projects = [], showFilters = false, groupBy = null }) {
    const [hovered, setHovered] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    const filtered =
        showFilters && activeFilter !== 'All'
            ? projects.filter((p) => p.content.Category === activeFilter)
            : projects;

    const groups = groupBy ? buildGroups(filtered, groupBy) : null;

    return (
        <div className={styles.wrapper}>
            {/* Fixed right-side image preview — only visible on hover */}
            <div className={`${styles.preview} ${hovered ? styles.previewVisible : ''}`}>
                {projects.map((p) => (
                    <div
                        key={p.slug}
                        className={`${styles.previewImg} ${hovered === p.slug ? styles.previewImgActive : ''}`}
                    >
                        {p.content.CoverImage?.filename && (
                            <Image
                                src={p.content.CoverImage.filename}
                                alt={p.content.Title || ''}
                                fill
                                sizes="45vw"
                                style={{ objectFit: 'cover' }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Left: optional filters + project rows */}
            <div className={styles.content}>
                {showFilters && (
                    <nav className={styles.filters}>
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                className={`${styles.filter} ${activeFilter === f ? styles.filterActive : ''}`}
                                onClick={() => setActiveFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </nav>
                )}

                {groups ? (
                    groups.map(({ name, projects: groupProjects }) => (
                        <div key={name} className={styles.group}>
                            <h2 className={styles.groupHeading}>{name}</h2>
                            <ul className={styles.list}>
                                {groupProjects.map((project) => (
                                    <li key={project.slug}>
                                        <Link
                                            href={`/work/${project.slug}`}
                                            className={`${styles.row} ${hovered && hovered !== project.slug ? styles.rowDimmed : ''}`}
                                            onMouseEnter={() => setHovered(project.slug)}
                                            onMouseLeave={() => setHovered(null)}
                                        >
                                            <span className={styles.num}>{String(project._num).padStart(2, '0')}</span>
                                            <span className={styles.title}>{project.content.Title}</span>
                                            <span className={styles.cat}>{project.content.Category}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <ul className={styles.list}>
                        {filtered.map((project, i) => (
                            <li key={project.slug}>
                                <Link
                                    href={`/work/${project.slug}`}
                                    className={`${styles.row} ${hovered && hovered !== project.slug ? styles.rowDimmed : ''}`}
                                    onMouseEnter={() => setHovered(project.slug)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                                    <span className={styles.title}>{project.content.Title}</span>
                                    <span className={styles.cat}>{project.content.Category}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
