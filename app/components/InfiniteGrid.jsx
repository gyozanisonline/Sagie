'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { thumb } from '../../lib/thumbs.js';
import styles from './InfiniteGrid.module.css';

const TILE_W = 240;
const TILE_H = 340;
const GAP = 16;
const CELL_W = TILE_W + GAP;
const CELL_H = TILE_H + GAP;

function pickIndex(col, row, count) {
    const h = ((col * 73856093) ^ (row * 19349663)) >>> 0;
    return h % count;
}

export default function InfiniteGrid({ projects = [], filter = 'All', active = true }) {
    const router = useRouter();
    const viewportRef = useRef(null);
    const panRef = useRef({ x: 0, y: 0 });
    const velRef = useRef({ x: 0, y: 0 });
    const dragRef = useRef({ down: false, startX: 0, startY: 0, lastX: 0, lastY: 0, moved: false, pointerId: null });
    const rafRef = useRef(null);
    const tileElsRef = useRef(new Map());
    const slotRangeRef = useRef({ colStart: 0, colEnd: -1, rowStart: 0, rowEnd: -1 });
    const sizeRef = useRef({ w: 0, h: 0 });

    const [slots, setSlots] = useState([]);
    const [hintVisible, setHintVisible] = useState(true);

    const cells = useMemo(() => {
        const coverCell = (p) =>
            p.content.CoverImage?.filename
                ? {
                      slug: p.slug,
                      title: p.content.Title,
                      category: p.content.Category,
                      src: p.content.CoverImage.filename,
                  }
                : null;

        if (filter === 'All') return projects.map(coverCell).filter(Boolean);

        const inCat = projects.filter((p) => p.content.Category === filter);
        const out = [];
        for (const p of inCat) {
            const imgs = (p.content.Images || []).filter((i) => i?.filename);
            if (imgs.length === 0) {
                const c = coverCell(p);
                if (c) out.push(c);
                continue;
            }
            for (const img of imgs) {
                out.push({ slug: p.slug, title: p.content.Title, category: p.content.Category, src: img.filename });
            }
        }
        return out.length ? out : projects.map(coverCell).filter(Boolean);
    }, [projects, filter]);

    const setTileRef = useCallback((key, el) => {
        if (el) tileElsRef.current.set(key, el);
        else tileElsRef.current.delete(key);
    }, []);

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const measure = () => {
            sizeRef.current = { w: el.clientWidth, h: el.clientHeight };
            slotRangeRef.current = { colStart: 0, colEnd: -1, rowStart: 0, rowEnd: -1 };
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        panRef.current = { x: 0, y: 0 };
        velRef.current = { x: 0, y: 0 };
        slotRangeRef.current = { colStart: 0, colEnd: -1, rowStart: 0, rowEnd: -1 };
    }, [filter]);

    useEffect(() => {
        if (!active) return;
        const reduce =
            typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        const step = () => {
            const v = velRef.current;
            const p = panRef.current;
            if (!dragRef.current.down && (Math.abs(v.x) > 0.05 || Math.abs(v.y) > 0.05)) {
                if (reduce) {
                    v.x = 0;
                    v.y = 0;
                } else {
                    p.x += v.x;
                    p.y += v.y;
                    v.x *= 0.92;
                    v.y *= 0.92;
                }
            }

            const { w, h } = sizeRef.current;
            if (w && h && cells.length) {
                const colStart = Math.floor(-p.x / CELL_W) - 1;
                const colEnd = Math.ceil((w - p.x) / CELL_W) + 1;
                const rowStart = Math.floor(-p.y / CELL_H) - 1;
                const rowEnd = Math.ceil((h - p.y) / CELL_H) + 1;
                const prev = slotRangeRef.current;
                if (
                    prev.colStart !== colStart ||
                    prev.colEnd !== colEnd ||
                    prev.rowStart !== rowStart ||
                    prev.rowEnd !== rowEnd
                ) {
                    slotRangeRef.current = { colStart, colEnd, rowStart, rowEnd };
                    const next = [];
                    for (let row = rowStart; row <= rowEnd; row++) {
                        for (let col = colStart; col <= colEnd; col++) {
                            const idx = pickIndex(col, row, cells.length);
                            next.push({ col, row, key: `${col}_${row}`, cell: cells[idx] });
                        }
                    }
                    setSlots(next);
                }

                for (const [key, el] of tileElsRef.current) {
                    const sep = key.indexOf('_');
                    const col = parseInt(key.slice(0, sep), 10);
                    const row = parseInt(key.slice(sep + 1), 10);
                    const left = col * CELL_W + p.x;
                    const top = row * CELL_H + p.y;
                    el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
                }
            }

            rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [cells, active]);

    const onPointerDown = (e) => {
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
        setHintVisible(false);
    };
    const onPointerMove = (e) => {
        const d = dragRef.current;
        if (!d.down) return;
        const dx = e.clientX - d.lastX;
        const dy = e.clientY - d.lastY;
        d.lastX = e.clientX;
        d.lastY = e.clientY;
        if (!d.moved && Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY) > 6) {
            d.moved = true;
            viewportRef.current?.setPointerCapture?.(e.pointerId);
        }
        if (!d.moved) return;
        panRef.current.x += dx;
        panRef.current.y += dy;
        velRef.current = { x: dx, y: dy };
    };
    const onPointerUp = () => {
        const d = dragRef.current;
        d.down = false;
        if (d.pointerId != null) {
            try {
                viewportRef.current?.releasePointerCapture?.(d.pointerId);
            } catch {
                /* noop */
            }
        }
    };

    const onTileClick = (slug) => (e) => {
        e.preventDefault();
        if (dragRef.current.moved) return;
        router.push(`/work/${slug}`);
    };

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const reduce =
            typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const handler = (e) => {
            e.preventDefault();
            panRef.current.x -= e.deltaX;
            panRef.current.y -= e.deltaY;
            velRef.current = reduce ? { x: 0, y: 0 } : { x: -e.deltaX * 0.15, y: -e.deltaY * 0.15 };
            setHintVisible(false);
        };
        el.addEventListener('wheel', handler, { passive: false });
        return () => el.removeEventListener('wheel', handler);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (!active) return;
            const STEP = 120;
            if (e.key === 'ArrowLeft') panRef.current.x += STEP;
            else if (e.key === 'ArrowRight') panRef.current.x -= STEP;
            else if (e.key === 'ArrowUp') panRef.current.y += STEP;
            else if (e.key === 'ArrowDown') panRef.current.y -= STEP;
            else return;
            setHintVisible(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [active]);

    useEffect(() => {
        const t = setTimeout(() => setHintVisible(false), 4000);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            ref={viewportRef}
            className={styles.viewport}
            data-lenis-prevent
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            role="application"
            aria-label="Pannable project grid. Drag, scroll, or use arrow keys to explore."
            tabIndex={0}
        >
            {slots.map(({ key, cell }) => (
                <a
                    key={key}
                    ref={(el) => setTileRef(key, el)}
                    href={`/work/${cell.slug}`}
                    onClick={onTileClick(cell.slug)}
                    className={styles.tile}
                    style={{ width: TILE_W, height: TILE_H }}
                    draggable={false}
                >
                    {cell.src && (
                        <Image
                            src={thumb(cell.src)}
                            alt={cell.title || ''}
                            fill
                            sizes="240px"
                            quality={70}
                            unoptimized
                            style={{ objectFit: 'cover' }}
                            draggable={false}
                        />
                    )}
                    <span className={styles.label}>
                        <span className={styles.labelTitle}>{cell.title}</span>
                        <span className={styles.labelCat}>{cell.category}</span>
                    </span>
                </a>
            ))}

            <div className={`${styles.hint} ${hintVisible ? styles.hintShow : ''}`} aria-hidden>
                <span className={styles.hintInner}>Drag · Scroll · Arrow keys</span>
            </div>
        </div>
    );
}
