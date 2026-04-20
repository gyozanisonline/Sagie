'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { thumb } from '../../lib/thumbs.js';
import styles from './ProjectSphere.module.css';

const HINT_STORAGE_KEY = 'sagie.sphereHintDismissed';
const DEFAULT_TILE_COUNT = 47;

const AUTO_ROTATE_SPEED = 0.0018;
const DRAG_SENSITIVITY = 0.006;
const INERTIA_DECAY = 0.95;
const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

function fibonacciSphere(count, radius) {
    const points = [];
    for (let i = 0; i < count; i++) {
        const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = (2 * Math.PI * i) / GOLDEN_RATIO;
        points.push({
            x: Math.cos(theta) * radiusAtY * radius,
            y: y * radius,
            z: Math.sin(theta) * radiusAtY * radius,
        });
    }
    return points;
}

function rotatePoint(p, rx, ry) {
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y1 = p.y * cosX - p.z * sinX;
    const z1 = p.y * sinX + p.z * cosX;
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x2 = p.x * cosY + z1 * sinY;
    const z2 = -p.x * sinY + z1 * cosY;
    return { x: x2, y: y1, z: z2 };
}

export default function ProjectSphere({ projects = [], active = true, radius = 440, tileSize = 96 }) {
    const router = useRouter();
    const sceneRef = useRef(null);
    const rotRef = useRef({ x: 0, y: 0 });
    const velRef = useRef({ x: 0, y: 0 });
    const dragRef = useRef({ down: false, lastX: 0, lastY: 0, startX: 0, startY: 0, moved: false, pointerId: null });
    const itemsRef = useRef([]);
    const rafRef = useRef(null);
    const [hintVisible, setHintVisible] = useState(false);

    const allCovers = useMemo(() => {
        const buckets = [];
        let maxLen = 0;
        for (const p of projects) {
            const meta = { slug: p.slug, title: p.content.Title, category: p.content.Category };
            const bag = [];
            if (p.content.CoverImage?.filename) bag.push(p.content.CoverImage.filename);
            for (const img of p.content.Images || []) {
                if (img?.filename) bag.push(img.filename);
            }
            buckets.push({ meta, bag });
            if (bag.length > maxLen) maxLen = bag.length;
        }
        const interleaved = [];
        for (let i = 0; i < maxLen; i++) {
            for (const { meta, bag } of buckets) {
                if (bag[i]) interleaved.push({ ...meta, src: bag[i] });
            }
        }
        return interleaved;
    }, [projects]);

    const [tileCount, setTileCount] = useState(() => Math.min(DEFAULT_TILE_COUNT, allCovers.length || DEFAULT_TILE_COUNT));

    useEffect(() => {
        setTileCount((c) => {
            const max = allCovers.length;
            if (max === 0) return 0;
            return Math.min(Math.max(1, c), max);
        });
    }, [allCovers.length]);

    const covers = useMemo(() => allCovers.slice(0, tileCount), [allCovers, tileCount]);
    const points = useMemo(() => fibonacciSphere(covers.length, radius), [covers.length, radius]);

    useEffect(() => {
        if (!active) return;
        const reduce =
            typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        const step = () => {
            const r = rotRef.current;
            const v = velRef.current;
            if (!dragRef.current.down) {
                r.x += v.x;
                r.y += v.y;
                v.x *= INERTIA_DECAY;
                v.y *= INERTIA_DECAY;
                if (!reduce && Math.abs(v.x) < 0.0001 && Math.abs(v.y) < 0.0001) {
                    r.y += AUTO_ROTATE_SPEED;
                }
            }

            const rx = r.x;
            const ry = r.y;
            const cosX = Math.cos(rx);
            const sinX = Math.sin(rx);
            const cosY = Math.cos(ry);
            const sinY = Math.sin(ry);

            const items = itemsRef.current;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (!item?.el) continue;
                const { x, y, z } = item.initial;
                const y1 = y * cosX - z * sinX;
                const z1 = y * sinX + z * cosX;
                const x2 = x * cosY + z1 * sinY;
                const z2 = -x * sinY + z1 * cosY;

                const normalizedDepth = (z2 + radius) / (radius * 2);
                const scale = 0.55 + normalizedDepth * 0.55;
                const brightness = 25 + normalizedDepth * 75;
                const zIndex = Math.floor(z2 + radius);

                item.el.style.transform = `translate3d(${x2}px, ${y1}px, 0) scale(${scale})`;
                item.el.style.zIndex = String(zIndex);
                item.el.style.filter = `brightness(${brightness}%)`;
                item.el.style.pointerEvents = z2 > 0 ? 'auto' : 'none';
            }

            rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [active, radius, covers.length]);

    useEffect(() => {
        if (!active) return;
        try {
            if (localStorage.getItem(HINT_STORAGE_KEY) === '1') return;
        } catch {
            /* localStorage unavailable — fall through and show hint once */
        }
        setHintVisible(true);
        const t = setTimeout(() => setHintVisible(false), 4500);
        return () => clearTimeout(t);
    }, [active]);

    const dismissHint = () => {
        setHintVisible(false);
        try {
            localStorage.setItem(HINT_STORAGE_KEY, '1');
        } catch {
            /* noop */
        }
    };

    useEffect(() => {
        const el = sceneRef.current;
        if (!el) return;

        const onDown = (e) => {
            dragRef.current = {
                down: true,
                startX: e.clientX,
                startY: e.clientY,
                lastX: e.clientX,
                lastY: e.clientY,
                moved: false,
                pointerId: e.pointerId,
            };
            velRef.current = { x: 0, y: 0 };
            dismissHint();
        };
        const onMove = (e) => {
            const d = dragRef.current;
            if (!d.down) return;
            const dx = e.clientX - d.lastX;
            const dy = e.clientY - d.lastY;
            d.lastX = e.clientX;
            d.lastY = e.clientY;
            if (!d.moved && Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY) > 12) {
                d.moved = true;
                el.setPointerCapture?.(e.pointerId);
            }
            if (!d.moved) return;
            velRef.current.y = dx * DRAG_SENSITIVITY;
            velRef.current.x = -dy * DRAG_SENSITIVITY;
            rotRef.current.y += velRef.current.y;
            rotRef.current.x += velRef.current.x;
        };
        const onUp = (e) => {
            const d = dragRef.current;
            d.down = false;
            if (d.pointerId != null) {
                try {
                    el.releasePointerCapture?.(d.pointerId);
                } catch {
                    /* noop */
                }
            }
        };

        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);
        el.addEventListener('pointerleave', onUp);
        return () => {
            el.removeEventListener('pointerdown', onDown);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerup', onUp);
            el.removeEventListener('pointercancel', onUp);
            el.removeEventListener('pointerleave', onUp);
        };
    }, []);

    const onTileClick = (slug) => (e) => {
        e.preventDefault();
        if (dragRef.current.moved) return;
        router.push(`/work/${slug}`);
    };

    return (
        <div
            ref={sceneRef}
            className={styles.scene}
            data-lenis-prevent
            role="application"
            aria-label="Rotating project sphere. Drag to spin. Click a tile to open a project."
        >
            <div className={styles.sphere}>
                {covers.map((cover, i) => (
                    <a
                        key={`${cover.slug}-${i}`}
                        ref={(el) => {
                            itemsRef.current[i] = el ? { el, initial: points[i] || { x: 0, y: 0, z: 0 } } : null;
                        }}
                        href={`/work/${cover.slug}`}
                        onClick={onTileClick(cover.slug)}
                        className={styles.tile}
                        style={{
                            width: tileSize,
                            height: tileSize,
                            marginLeft: -tileSize / 2,
                            marginTop: -tileSize / 2,
                        }}
                        draggable={false}
                    >
                        <Image
                            src={thumb(cover.src)}
                            alt={cover.title || ''}
                            fill
                            sizes="96px"
                            quality={70}
                            unoptimized
                            style={{ objectFit: 'cover' }}
                            draggable={false}
                        />
                        <span className={styles.label}>{cover.title}</span>
                    </a>
                ))}
            </div>
            <div className={`${styles.hint} ${hintVisible ? styles.hintShow : ''}`} aria-hidden>
                <span className={styles.hintInner}>Drag to explore · Tap to open</span>
            </div>
            {allCovers.length > 1 && (
                <div
                    className={styles.density}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerMove={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                >
                    <label className={styles.densityLabel} htmlFor="sphere-density">
                        Density
                    </label>
                    <input
                        id="sphere-density"
                        className={styles.densityInput}
                        type="range"
                        min={1}
                        max={allCovers.length}
                        step={1}
                        value={tileCount}
                        onChange={(e) => setTileCount(Number(e.target.value))}
                        aria-valuetext={`${tileCount} of ${allCovers.length} tiles`}
                    />
                    <span className={styles.densityValue}>{tileCount}</span>
                </div>
            )}
        </div>
    );
}
