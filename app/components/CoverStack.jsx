'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CoverStack.module.css';

const WHEEL_THRESHOLD = 60;
const WHEEL_COOLDOWN_MS = 140;

export default function CoverStack({ images = [], title = '', category = '', nextSlug = null, nextTitle = '' }) {
    const [current, setCurrent] = useState(0);
    const [expanded, setExpanded] = useState(null);
    const stackRef = useRef(null);
    const wheelAccum = useRef(0);
    const lastWheelAt = useRef(0);

    const n = images.length;

    const step = useCallback(
        (dir) => {
            if (!n) return;
            setCurrent((c) => Math.max(0, Math.min(n - 1, c + dir)));
        },
        [n],
    );

    const stepExpanded = useCallback(
        (dir) => {
            setExpanded((cur) => {
                if (cur === null) return cur;
                return (cur + dir + n) % n;
            });
        },
        [n],
    );

    const close = useCallback(() => setExpanded(null), []);

    useEffect(() => {
        if (expanded === null) return;
        const onKey = (e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') stepExpanded(-1);
            if (e.key === 'ArrowRight') stepExpanded(1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [expanded, close, stepExpanded]);

    useEffect(() => {
        if (expanded === null) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [expanded]);

    useEffect(() => {
        const el = stackRef.current;
        if (!el) return;

        const onWheel = (e) => {
            if (expanded !== null) return;
            e.preventDefault();
            const now = performance.now();
            if (now - lastWheelAt.current > 300) wheelAccum.current = 0;
            wheelAccum.current += e.deltaY;
            lastWheelAt.current = now;

            if (Math.abs(wheelAccum.current) >= WHEEL_THRESHOLD) {
                step(wheelAccum.current > 0 ? 1 : -1);
                wheelAccum.current = 0;
                lastWheelAt.current = now + WHEEL_COOLDOWN_MS;
            }
        };

        const onKey = (e) => {
            if (expanded !== null) return;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                step(-1);
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                step(1);
            }
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setExpanded(current);
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        el.addEventListener('keydown', onKey);
        return () => {
            el.removeEventListener('wheel', onWheel);
            el.removeEventListener('keydown', onKey);
        };
    }, [step, expanded, current]);

    if (!n) return null;

    return (
        <>
            <div className={styles.wrap}>
                <header className={styles.heading}>
                    <div className={styles.headingRow}>
                        <h1 className={styles.title}>{title}</h1>
                        {category && <p className={styles.category}>{category}</p>}
                    </div>
                    <p className={styles.hint}>
                        <span aria-hidden>↓</span> Scroll / arrows · Click to open
                    </p>
                </header>

                <div
                    ref={stackRef}
                    className={styles.stack}
                    tabIndex={0}
                    role="listbox"
                    aria-label={`${title} covers`}
                    aria-activedescendant={`cover-${current}`}
                    data-lenis-prevent
                >
                    <div className={styles.scene} style={{ '--count': n, '--current': current }}>
                        {images.map((img, i) => {
                            const offset = i - current;
                            return (
                                <button
                                    type="button"
                                    key={`${img.filename}-${i}`}
                                    id={`cover-${i}`}
                                    className={styles.slot}
                                    data-state={
                                        i === current
                                            ? 'current'
                                            : offset < 0
                                              ? 'past'
                                              : 'future'
                                    }
                                    role="option"
                                    aria-selected={i === current}
                                    style={{
                                        '--i': i,
                                        '--offset': offset,
                                        '--abs': Math.abs(offset),
                                    }}
                                    onClick={() => {
                                        if (i === current) setExpanded(i);
                                        else setCurrent(i);
                                    }}
                                    aria-label={`${title} — cover ${i + 1}`}
                                >
                                    <span className={styles.card}>
                                        <Image
                                            src={img.filename}
                                            alt={`${title} cover ${i + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 70vw, 36vw"
                                            style={{ objectFit: 'cover' }}
                                            loading={Math.abs(offset) < 4 ? 'eager' : 'lazy'}
                                        />
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles.counter} aria-live="polite">
                        {current + 1} / {n}
                    </div>
                </div>

                {nextSlug && (
                    <Link href={`/work/${nextSlug}`} className={styles.nextLink} aria-label={`Next project: ${nextTitle}`}>
                        <span className={styles.nextLabel}>Next</span>
                        <span className={styles.nextTitle}>{nextTitle}</span>
                        <span aria-hidden="true">→</span>
                    </Link>
                )}
            </div>

            {expanded !== null && (
                <div
                    className={styles.overlay}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${title} — cover ${expanded + 1} of ${n}`}
                    onClick={close}
                >
                    <button
                        type="button"
                        className={styles.close}
                        onClick={(e) => {
                            e.stopPropagation();
                            close();
                        }}
                        aria-label="Close"
                    >
                        ×
                    </button>

                    <button
                        type="button"
                        className={`${styles.nav} ${styles.navPrev}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            stepExpanded(-1);
                        }}
                        aria-label="Previous"
                    >
                        ←
                    </button>

                    <div className={styles.expanded} onClick={(e) => e.stopPropagation()}>
                        <Image
                            key={expanded}
                            src={images[expanded].filename}
                            alt={`${title} cover ${expanded + 1}`}
                            fill
                            sizes="100vw"
                            style={{ objectFit: 'contain' }}
                            priority
                        />
                    </div>

                    <button
                        type="button"
                        className={`${styles.nav} ${styles.navNext}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            stepExpanded(1);
                        }}
                        aria-label="Next"
                    >
                        →
                    </button>

                    <div className={styles.counter}>
                        {expanded + 1} / {n}
                    </div>
                </div>
            )}
        </>
    );
}
