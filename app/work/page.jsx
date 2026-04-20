'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InfiniteGrid from '../components/InfiniteGrid';
import ProjectSphere from '../components/ProjectSphere';
import CoverStack from '../components/CoverStack';
import { PROJECTS, CATEGORIES, SUBCATEGORIES } from '@/lib/projects';
import styles from './page.module.css';

export default function WorkPage() {
    const [filter, setFilter] = useState('All');
    const [subFilter, setSubFilter] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        if (cat && CATEGORIES.includes(cat)) setFilter(cat);
    }, []);

    const isAll = filter === 'All';
    const subs = SUBCATEGORIES?.[filter] ?? null;

    // Only show sub-filters that actually have content.
    const availableSubs = useMemo(() => {
        if (!subs) return null;
        const present = new Set(
            PROJECTS
                .filter((p) => p.content.Category === filter && p.content.Subcategory)
                .map((p) => p.content.Subcategory),
        );
        return subs.filter((s) => present.has(s));
    }, [filter, subs]);

    const filteredProjects = useMemo(() => {
        if (isAll) return PROJECTS;
        const inCat = PROJECTS.filter((p) => p.content.Category === filter);
        if (!subFilter) return inCat;
        return inCat.filter((p) => p.content.Subcategory === subFilter);
    }, [filter, subFilter, isAll]);

    const coverArtImages = useMemo(() => {
        if (filter !== 'Graphic' || subFilter !== 'Cover Art') return [];
        return filteredProjects
            .map((p) => p.content.CoverImage)
            .filter((c) => c?.filename);
    }, [filter, subFilter, filteredProjects]);

    const showCoverStack = filter === 'Graphic' && subFilter === 'Cover Art' && coverArtImages.length > 0;

    const label = isAll
        ? 'All Projects'
        : subFilter
          ? `${filter} — ${subFilter}`
          : `${filter} Projects`;

    const handleCategoryChange = (cat) => {
        setFilter(cat);
        setSubFilter(null);
    };

    return (
        <div className={styles.page}>
            <h1 className={styles.srOnly}>Work</h1>
            <nav className={styles.filters} aria-label="Filter projects by category">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        className={`${styles.filter} ${filter === cat ? styles.filterActive : ''}`}
                        onClick={() => handleCategoryChange(cat)}
                        aria-pressed={filter === cat}
                    >
                        {cat}
                    </button>
                ))}
                <span className={styles.sep} aria-hidden="true" />
                <Link href="/info" className={styles.filter}>Info</Link>
            </nav>

            {availableSubs && availableSubs.length > 0 && (
                <nav className={styles.subFilters} aria-label={`Filter ${filter} by sub-category`}>
                    <button
                        type="button"
                        className={`${styles.subFilter} ${subFilter === null ? styles.subFilterActive : ''}`}
                        onClick={() => setSubFilter(null)}
                        aria-pressed={subFilter === null}
                    >
                        All {filter}
                    </button>
                    {availableSubs.map((sub) => (
                        <button
                            key={sub}
                            type="button"
                            className={`${styles.subFilter} ${subFilter === sub ? styles.subFilterActive : ''}`}
                            onClick={() => setSubFilter(sub)}
                            aria-pressed={subFilter === sub}
                        >
                            {sub}
                        </button>
                    ))}
                </nav>
            )}

            <div className={styles.stage}>
                <div className={styles.status} aria-live="polite">
                    <span className={styles.statusLabel}>{label}</span>
                    <span className={styles.statusCount}>{filteredProjects.length}</span>
                </div>

                <div
                    className={`${styles.layer} ${isAll ? styles.layerVisible : styles.layerHidden}`}
                    aria-hidden={!isAll}
                >
                    <ProjectSphere projects={PROJECTS} active={isAll} />
                </div>

                <div
                    className={`${styles.layer} ${!isAll && showCoverStack ? styles.layerVisible : styles.layerHidden}`}
                    aria-hidden={!showCoverStack}
                >
                    {showCoverStack && <CoverStack images={coverArtImages} title="Cover Art" />}
                </div>

                <div
                    className={`${styles.layer} ${!isAll && !showCoverStack ? styles.layerVisible : styles.layerHidden}`}
                    aria-hidden={isAll || showCoverStack}
                >
                    <InfiniteGrid projects={filteredProjects} filter={filter} active={!isAll && !showCoverStack} />
                </div>
            </div>
        </div>
    );
}
