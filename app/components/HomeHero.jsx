'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CATEGORIES } from '@/lib/projects';
import styles from './HomeHero.module.css';

export default function HomeHero() {
    return (
        <section className={styles.hero} aria-label="Sagie Maya portfolio">
            <motion.h1
                className={styles.logo}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            >
                <span className={styles.logoText}>SAGIE MAYA</span>
            </motion.h1>

            <motion.nav
                className={styles.pills}
                aria-label="Browse portfolio"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
                }}
            >
                {CATEGORIES.map((cat) => (
                    <motion.span
                        key={cat}
                        variants={pillVariants}
                        className={styles.pillWrap}
                    >
                        <Link href={hrefForCategory(cat)} className={styles.pill}>
                            {cat}
                        </Link>
                    </motion.span>
                ))}
                <span className={styles.sep} aria-hidden="true" />
                <motion.span variants={pillVariants} className={styles.pillWrap}>
                    <Link href="/info" className={styles.pill}>Info</Link>
                </motion.span>
            </motion.nav>
        </section>
    );
}

const pillVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] } },
};

function hrefForCategory(cat) {
    if (cat === 'All') return '/work';
    return `/work?category=${encodeURIComponent(cat)}`;
}
