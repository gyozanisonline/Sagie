'use client';
import { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { thumb, thumbDims } from '../../lib/thumbs.js';
import styles from './ScatterTable.module.css';

const TAP_THRESHOLD_PX = 6;
const MAX_CARD_W = 300;
const MIN_CARD_W = 120;

export default function ScatterTable({ projects }) {
    const reduceMotion = useReducedMotion();
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 640px)');
        const update = () => setMobile(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    const layout = useMemo(() => buildLayout(projects, mobile), [projects, mobile]);
    const [topZ, setTopZ] = useState(layout.length + 10);

    return (
        <div className={styles.table} aria-label="Featured projects">
            {layout.map((card, idx) => (
                <ScatterCard
                    key={card.project.slug}
                    card={card}
                    reduceMotion={reduceMotion}
                    onBringToFront={() => setTopZ((z) => z + 1)}
                    topZ={topZ}
                    index={idx}
                />
            ))}
        </div>
    );
}

function ScatterCard({ card, reduceMotion, onBringToFront, topZ, index }) {
    const { project, x, y, rotate, width, aspect, delay } = card;
    const [z, setZ] = useState(10 + index);
    const downPos = useRef({ x: 0, y: 0, moved: false });

    const initial = reduceMotion
        ? { opacity: 0, x: `${x}vw`, y: `${y}vh`, rotate, scale: 1 }
        : { opacity: 0, x: `${x}vw`, y: '110vh', rotate: rotate - 6, scale: 1.15 };

    const animate = { opacity: 1, x: `${x}vw`, y: `${y}vh`, rotate, scale: 1 };

    const transition = reduceMotion
        ? { duration: 0.4, delay: index * 0.02 }
        : { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay };

    return (
        <motion.div
            className={styles.card}
            style={{
                width,
                aspectRatio: aspect,
                zIndex: z,
                touchAction: 'none',
            }}
            initial={initial}
            animate={animate}
            transition={transition}
            drag
            dragMomentum={false}
            dragElastic={0.6}
            whileDrag={{ scale: 1.04 }}
            onPointerDown={(e) => {
                downPos.current = { x: e.clientX, y: e.clientY, moved: false };
                const next = topZ + 1;
                setZ(next);
                onBringToFront();
            }}
            onPointerMove={(e) => {
                const dx = e.clientX - downPos.current.x;
                const dy = e.clientY - downPos.current.y;
                if (Math.hypot(dx, dy) > TAP_THRESHOLD_PX) {
                    downPos.current.moved = true;
                }
            }}
        >
            <Link
                href={`/work/${project.slug}`}
                className={styles.cardLink}
                draggable={false}
                onClick={(e) => {
                    if (downPos.current.moved) {
                        e.preventDefault();
                    }
                }}
            >
                <CardImage project={project} />
                <span className={styles.cardTitle}>{project.content.Title}</span>
            </Link>
        </motion.div>
    );
}

function CardImage({ project }) {
    const src = project.content.CoverImage?.filename;
    if (!src) return null;
    const dims = thumbDims(src);
    const w = dims?.w || 1024;
    const h = dims?.h || 1024;
    return (
        <Image
            src={thumb(src)}
            alt={project.content.Title || ''}
            width={w}
            height={h}
            unoptimized
            priority
            draggable={false}
            className={styles.cardImage}
            sizes="(max-width: 640px) 45vw, 220px"
        />
    );
}

function buildLayout(projects, mobile) {
    const seed = pickSeed();
    const rand = mulberry32(seed);

    return projects.map((project, i) => {
        const src = project.content.CoverImage?.filename;
        const dims = (src && thumbDims(src)) || { w: 1024, h: 1024 };
        const aspect = dims.w / dims.h;

        const width = MIN_CARD_W + rand() * (MAX_CARD_W - MIN_CARD_W);
        const rotate = (rand() - 0.5) * 16;

        const xSpread = mobile ? 70 : 78;
        const xCenter = 50 - xSpread / 2;
        const x = xCenter + rand() * xSpread;

        const yBase = mobile ? 55 : 35;
        const yRange = mobile ? 40 : 55;
        const y = yBase + rand() * yRange;

        const delay = 0.5 + i * 0.07;

        return { project, x, y, rotate, width, aspect, delay };
    });
}

function pickSeed() {
    if (typeof window === 'undefined') return 1;
    return Math.floor(Math.random() * 1e9);
}

function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
