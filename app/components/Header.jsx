'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { CATEGORIES } from '@/lib/projects';
import styles from './Header.module.css';

const CATEGORY_LINKS = [
    { label: 'All Work', href: '/work' },
    ...CATEGORIES.filter((c) => c !== 'All').map((c) => ({
        label: c,
        href: `/work?category=${encodeURIComponent(c)}`,
    })),
];

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isInfo = pathname === '/info';
    const isBig = isHome || isInfo; // both get the giant centred logo
    const [open, setOpen] = useState(false);

    return (
        <header
            className={`${styles.header} ${isHome ? styles.home : isInfo ? styles.infoHead : styles.sub} ${
                isInfo ? styles.headerInfo : ''
            }`}
        >
            <div className={styles.left}>
                <button
                    type="button"
                    className={styles.workBtn}
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-haspopup="true"
                >
                    Work
                </button>

                <AnimatePresence>
                    {open && (
                        <>
                            <button
                                type="button"
                                className={styles.scrim}
                                aria-label="Close menu"
                                onClick={() => setOpen(false)}
                            />
                            <motion.nav
                                className={styles.dropdown}
                                aria-label="Categories"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {CATEGORY_LINKS.map((c, i) => (
                                    <motion.span
                                        key={c.href}
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -4 }}
                                        transition={{ delay: 0.04 * i, duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <Link href={c.href} className={styles.dropItem} onClick={() => setOpen(false)}>
                                            {c.label}
                                        </Link>
                                    </motion.span>
                                ))}
                            </motion.nav>
                        </>
                    )}
                </AnimatePresence>
            </div>

            <Link href="/" className={`${styles.logo} ${isBig ? styles.logoHero : styles.logoSmall}`}>
                <span className={styles.logoText}>Sagie Maya</span>
            </Link>

            <div className={styles.right}>
                <Link
                    href="/info"
                    className={`${styles.navLink} ${isInfo ? styles.navLinkActive : ''}`}
                    aria-current={isInfo ? 'page' : undefined}
                >
                    Info
                </Link>
            </div>
        </header>
    );
}
