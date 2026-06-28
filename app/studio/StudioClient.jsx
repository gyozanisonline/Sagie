'use client';
import { useEffect, useMemo, useState } from 'react';
import { thumb, thumbDims } from '@/lib/thumbs';
import { MEDIUMS } from '@/lib/medium';
import styles from './studio.module.css';

export default function StudioClient({ items }) {
    const [curation, setCuration] = useState({ fronts: {}, tags: {}, featured: [] });
    const [filter, setFilter] = useState('Featured');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch('/api/curation')
            .then((r) => r.json())
            .then((d) => setCuration({ fronts: d.fronts || {}, tags: d.tags || {}, featured: d.featured || [] }))
            .catch(() => {});
    }, []);

    const tagsOf = (it) => {
        const t = curation.tags[it.slug];
        if (Array.isArray(t)) return t;
        if (typeof t === 'string' && t) return [t];
        return it.autoMedium ? [it.autoMedium] : [];
    };

    const featured = curation.featured || [];

    const filtered = useMemo(() => {
        if (filter === 'All') return items;
        if (filter === 'Featured') return items.filter((it) => featured.includes(it.slug));
        return items.filter((it) => tagsOf(it).includes(filter));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, filter, curation.tags, curation.featured]);

    async function save(patch) {
        setStatus('Saving…');
        try {
            const r = await fetch('/api/curation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
            });
            const d = await r.json();
            setCuration({ fronts: d.fronts || {}, tags: d.tags || {}, featured: d.featured || [] });
            setStatus('Saved ✓');
            setTimeout(() => setStatus(''), 1200);
        } catch {
            setStatus('Error');
        }
    }

    const setFront = (slug, filename) => save({ fronts: { [slug]: filename } });
    const toggleTag = (slug, medium, current) => {
        const next = current.includes(medium)
            ? current.filter((m) => m !== medium)
            : [...current, medium];
        save({ tags: { [slug]: next } });
    };
    const toggleFeatured = (slug) => {
        const next = featured.includes(slug) ? featured.filter((s) => s !== slug) : [...featured, slug];
        save({ featured: next });
    };

    return (
        <div className={styles.root}>
            <header className={styles.bar}>
                <h1 className={styles.h}>Curation Studio</h1>
                <div className={styles.tabs}>
                    {['All', 'Featured', ...MEDIUMS].map((m) => (
                        <button
                            key={m}
                            type="button"
                            className={filter === m ? styles.active : ''}
                            onClick={() => setFilter(m)}
                        >
                            {m}
                        </button>
                    ))}
                </div>
                <span className={styles.status}>{status}</span>
            </header>

            <p className={styles.help}>
                Click an image to set it as the <strong>front / thumbnail</strong>. Change the dropdown to
                fix the <strong>medium tag</strong>. Saves automatically. ({filtered.length} projects)
            </p>

            <div className={styles.list}>
                {filtered.map((it) => {
                    const front = curation.fronts[it.slug] || it.images[0];
                    return (
                        <div key={it.slug} className={styles.row}>
                            <div className={styles.meta}>
                                <div className={styles.title}>{it.title}</div>
                                <div className={styles.cat}>{it.category}</div>
                                <div className={styles.chips}>
                                    {MEDIUMS.map((m) => {
                                        const on = tagsOf(it).includes(m);
                                        return (
                                            <button
                                                key={m}
                                                type="button"
                                                className={`${styles.chip} ${on ? styles.chipOn : ''}`}
                                                onClick={() => toggleTag(it.slug, m, tagsOf(it))}
                                                aria-pressed={on}
                                            >
                                                {m}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    className={`${styles.star} ${featured.includes(it.slug) ? styles.starOn : ''}`}
                                    onClick={() => toggleFeatured(it.slug)}
                                    aria-pressed={featured.includes(it.slug)}
                                >
                                    {featured.includes(it.slug) ? '★ Featured' : '☆ Feature'}
                                </button>
                            </div>
                            <div className={styles.strip}>
                                {it.images.map((src, i) => {
                                    const d = thumbDims(src);
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`${styles.thumb} ${src === front ? styles.frontSel : ''}`}
                                            onClick={() => setFront(it.slug, src)}
                                            title="Set as front"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={thumb(src)} alt="" loading="lazy" />
                                            <span className={styles.dim}>{d ? `${d.w}×${d.h}` : '—'}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
