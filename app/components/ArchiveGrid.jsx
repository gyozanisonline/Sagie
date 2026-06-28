'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import InfiniteGrid from './InfiniteGrid';
import { mediumFor, MEDIUMS } from '@/lib/medium';
import curation from '@/data/curation.json';
import styles from './ArchiveGrid.module.css';

// Curated mediums (multi-tag): hand overrides (studio) win over the auto
// folder-derivation. Always returns an array.
function mediumsOf(p) {
    const t = curation.tags?.[p.slug];
    if (Array.isArray(t)) return t.filter(Boolean);
    if (typeof t === 'string' && t) return [t];
    const auto = mediumFor(p);
    return auto ? [auto] : [];
}

// Build the grid cells. Cover Art → only the chosen front (one tile).
// Everything else → expanded with its inside images for variety.
function buildCells(projects) {
    const out = [];
    for (const p of projects) {
        const base = { slug: p.slug, title: p.content.Title, category: p.content.Category };
        if (mediumsOf(p).includes('Cover Art')) {
            const front = curation.fronts?.[p.slug] || p.content.CoverImage?.filename;
            if (front) out.push({ ...base, src: front });
            continue;
        }
        const imgs = [];
        if (p.content.CoverImage?.filename) imgs.push(p.content.CoverImage.filename);
        if (Array.isArray(p.content.Images)) imgs.push(...p.content.Images.map((i) => i?.filename).filter(Boolean));
        for (const src of [...new Set(imgs)]) out.push({ ...base, src });
    }
    return out;
}

// Tier 2: the full archive on the infinite pannable canvas, filtered by medium.
export default function ArchiveGrid({ projects }) {
    const [active, setActive] = useState('All');

    const mediums = useMemo(() => {
        const present = new Set();
        projects.forEach((p) => mediumsOf(p).forEach((m) => present.add(m)));
        return MEDIUMS.filter((m) => present.has(m));
    }, [projects]);

    const filteredProjects = useMemo(
        () => (active === 'All' ? projects : projects.filter((p) => mediumsOf(p).includes(active))),
        [projects, active],
    );

    const cells = useMemo(() => buildCells(filteredProjects), [filteredProjects]);

    const counts = useMemo(() => {
        const c = { All: buildCells(projects).length };
        for (const m of mediums) {
            c[m] = buildCells(projects.filter((p) => mediumsOf(p).includes(m))).length;
        }
        return c;
    }, [projects, mediums]);

    const tabs = ['All', ...mediums];

    return (
        <div className={styles.root}>
            <header className={styles.bar}>
                <Link href="/" className={styles.logo}>Sagie Maya</Link>
                <Link href="/info" className={styles.navLink}>Info</Link>
            </header>

            <nav className={styles.filters} aria-label="Filter by medium">
                {tabs.map((t) => (
                    <button
                        key={t}
                        type="button"
                        className={active === t ? styles.active : ''}
                        onClick={() => setActive(t)}
                        aria-pressed={active === t}
                    >
                        {t} <span className={styles.count}>{counts[t] ?? 0}</span>
                    </button>
                ))}
            </nav>

            <div className={styles.canvas}>
                <InfiniteGrid key={active} cells={cells} active />
            </div>
        </div>
    );
}
