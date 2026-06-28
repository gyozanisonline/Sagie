'use client';
import { useMemo, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, useMotionValue, animate } from 'motion/react';
import { thumb, thumbDims } from '../../lib/thumbs.js';
import styles from './ScatterTable.module.css';

const TAP_THRESHOLD_PX = 6;
const MAX_CARD_W = 300;
const MIN_CARD_W = 120;
const THROW_DELAY = 0.5;
const THROW_DURATION = 0.6;
const THROW_EASE = [0.16, 1, 0.3, 1];

const EXTRAS = [
    {
        id: 'eyeglasses',
        src: '/extras/glasses.png',
        w: 434,
        h: 412,
        minW: 180,
        maxW: 260,
    },
    {
        id: 'sd-card',
        src: '/extras/extreme-pro-sd-uhs-ii-v60-64gb-front.png',
        w: 1680,
        h: 1680,
        minW: 110,
        maxW: 160,
    },
    {
        id: 'pencil',
        src: '/extras/pencil.png',
        w: 1493,
        h: 2131,
        minW: 160,
        maxW: 240,
    },
];

export default function ScatterTable({ projects }) {
    const reduceMotion = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    const [mobile, setMobile] = useState(false);
    const [showHint, setShowHint] = useState(true);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 640px)');
        const update = () => setMobile(mq.matches);
        update();
        setMounted(true);
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        if (!mobile) return;
        const onScroll = () => {
            if (window.scrollY > 80) setShowHint(false);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [mobile]);

    const canvasHeight = useMemo(() => {
        if (!mounted) return 0;
        return mobile ? window.innerHeight * 2 : window.innerHeight;
    }, [mounted, mobile]);

    const layout = useMemo(
        () => (mounted ? buildLayout(projects, mobile) : []),
        [projects, mobile, mounted]
    );
    const [topZ, setTopZ] = useState(10);

    return (
        <div className={styles.table} aria-label="Featured projects">
            {layout.map((item, idx) =>
                item.kind === 'prop' ? (
                    <ScatterProp
                        key={item.id}
                        item={item}
                        reduceMotion={reduceMotion}
                        onBringToFront={() => setTopZ((z) => z + 1)}
                        topZ={topZ}
                        index={idx}
                        canvasHeight={canvasHeight}
                    />
                ) : (
                    <ScatterCard
                        key={item.project.slug}
                        card={item}
                        reduceMotion={reduceMotion}
                        onBringToFront={() => setTopZ((z) => z + 1)}
                        topZ={topZ}
                        index={idx}
                        canvasHeight={canvasHeight}
                    />
                )
            )}
            {mounted && mobile && (
                <div className={styles.footer}>
                    <Link href="/work" className={styles.footerLink}>
                        See all work →
                    </Link>
                </div>
            )}
            {mounted && mobile && showHint && (
                <div className={styles.scrollHint} aria-hidden="true">
                    Scroll ↓
                </div>
            )}
        </div>
    );
}

function useThrowAnimation({ reduceMotion, x, y, rotate, tiltOffset, delay, canvasHeight }) {
    const targetX = (x / 100) * window.innerWidth;
    const targetY = (y / 100) * canvasHeight;
    const viewportH = window.innerHeight;
    const inInitialViewport = targetY < viewportH;
    const shouldThrow = !reduceMotion && inInitialViewport;
    const offscreenY = viewportH * 1.1;

    const mvX = useMotionValue(targetX);
    const mvY = useMotionValue(shouldThrow ? offscreenY : targetY);
    const mvRotate = useMotionValue(shouldThrow ? rotate - tiltOffset : rotate);
    const mvScale = useMotionValue(shouldThrow ? 1.15 : 1);

    useEffect(() => {
        if (!shouldThrow) return;
        const opts = { duration: THROW_DURATION, delay, ease: THROW_EASE };
        const ctrls = [
            animate(mvY, targetY, opts),
            animate(mvRotate, rotate, opts),
            animate(mvScale, 1, opts),
        ];
        return () => ctrls.forEach((c) => c.stop());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { mvX, mvY, mvRotate, mvScale };
}

function ScatterCard({ card, reduceMotion, onBringToFront, topZ, index, canvasHeight }) {
    const { project, x, y, rotate, width, aspect, delay } = card;
    const [z, setZ] = useState(10 + index);
    const downPos = useRef({ x: 0, y: 0, moved: false });

    const { mvX, mvY, mvRotate, mvScale } = useThrowAnimation({
        reduceMotion,
        x,
        y,
        rotate,
        tiltOffset: 6,
        delay,
        canvasHeight,
    });

    return (
        <motion.div
            className={styles.card}
            style={{
                width,
                aspectRatio: aspect,
                zIndex: z,
                touchAction: 'none',
                x: mvX,
                y: mvY,
                rotate: mvRotate,
                scale: mvScale,
            }}
            drag
            dragMomentum={false}
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

function ScatterProp({ item, reduceMotion, onBringToFront, topZ, index, canvasHeight }) {
    const { src, w, h, x, y, rotate, width, delay } = item;
    const [z, setZ] = useState(10 + index);
    const downPos = useRef({ x: 0, y: 0, moved: false });
    const aspect = w / h;

    const { mvX, mvY, mvRotate, mvScale } = useThrowAnimation({
        reduceMotion,
        x,
        y,
        rotate,
        tiltOffset: 10,
        delay,
        canvasHeight,
    });

    return (
        <motion.div
            className={`${styles.card} ${styles.prop}`}
            style={{
                width,
                aspectRatio: aspect,
                zIndex: z,
                touchAction: 'none',
                x: mvX,
                y: mvY,
                rotate: mvRotate,
                scale: mvScale,
            }}
            drag
            dragMomentum={false}
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
                href="/info"
                className={styles.cardLink}
                draggable={false}
                aria-label="About"
                onClick={(e) => {
                    if (downPos.current.moved) {
                        e.preventDefault();
                    }
                }}
            >
                <Image
                    src={src}
                    alt=""
                    width={w}
                    height={h}
                    unoptimized
                    priority
                    draggable={false}
                    className={styles.propImage}
                    sizes="320px"
                />
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

    const xSpread = mobile ? 70 : 78;
    const xCenter = 50 - xSpread / 2;
    const yBase = mobile ? 5 : 35;
    const yRange = mobile ? 88 : 55;

    const cards = projects.map((project) => {
        const src = project.content.CoverImage?.filename;
        const dims = (src && thumbDims(src)) || { w: 1024, h: 1024 };
        const aspect = dims.w / dims.h;

        const width = MIN_CARD_W + rand() * (MAX_CARD_W - MIN_CARD_W);
        const rotate = (rand() - 0.5) * 16;
        const x = xCenter + rand() * xSpread;
        const y = yBase + rand() * yRange;

        return {
            kind: 'card',
            project,
            x,
            y,
            rotate,
            width,
            aspect,
            delay: THROW_DELAY,
        };
    });

    const propScale = mobile ? 0.75 : 1;
    const props = EXTRAS.map((extra) => {
        const width = (extra.minW + rand() * (extra.maxW - extra.minW)) * propScale;
        const rotate = (rand() - 0.5) * 40;
        const x = xCenter + rand() * xSpread;
        const y = yBase + rand() * yRange;

        return {
            kind: 'prop',
            id: extra.id,
            src: extra.src,
            w: extra.w,
            h: extra.h,
            x,
            y,
            rotate,
            width,
            delay: THROW_DELAY,
        };
    });

    return shuffle([...cards, ...props], rand);
}

function shuffle(arr, rand) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
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
