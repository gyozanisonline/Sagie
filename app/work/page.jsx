'use client';
import { useMemo, useState } from 'react';
import InfiniteGrid from '../components/InfiniteGrid';
import ProjectSphere from '../components/ProjectSphere';
import { PROJECTS, CATEGORIES } from '@/lib/projects';
import styles from './page.module.css';

export default function WorkPage() {
    const [filter, setFilter] = useState('All');
    const isAll = filter === 'All';

    const visibleCount = useMemo(() => {
        if (isAll) return PROJECTS.length;
        return PROJECTS.filter((p) => p.content.Category === filter).length;
    }, [filter, isAll]);

    const label = isAll ? 'All Projects' : `${filter} Projects`;

    return (
        <div className={styles.page}>
            <nav className={styles.filters} aria-label="Filter projects by category">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        className={`${styles.filter} ${filter === cat ? styles.filterActive : ''}`}
                        onClick={() => setFilter(cat)}
                        aria-pressed={filter === cat}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            <div className={styles.stage}>
                <div className={styles.status} aria-live="polite">
                    <span className={styles.statusLabel}>{label}</span>
                    <span className={styles.statusCount}>{visibleCount}</span>
                </div>

                <div
                    className={`${styles.layer} ${isAll ? styles.layerVisible : styles.layerHidden}`}
                    aria-hidden={!isAll}
                >
                    <ProjectSphere projects={PROJECTS} active={isAll} />
                </div>

                <div
                    className={`${styles.layer} ${!isAll ? styles.layerVisible : styles.layerHidden}`}
                    aria-hidden={isAll}
                >
                    <InfiniteGrid projects={PROJECTS} filter={filter} active={!isAll} />
                </div>
            </div>
        </div>
    );
}
