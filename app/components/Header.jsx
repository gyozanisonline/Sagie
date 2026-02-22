'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const isHome    = pathname === '/';
    const isInfo    = pathname === '/info';
    const isProject = pathname.startsWith('/work/') && pathname !== '/work';

    return (
        <header className={`${styles.header} ${isHome ? styles.home : styles.sub} ${isInfo ? styles.headerInfo : ''}`}>
            <Link href="/work" className={styles.navLink}>
                {isProject ? '← Work' : 'WORK'}
            </Link>

            <Link href="/" className={`${styles.logo} ${isHome ? styles.logoHero : styles.logoSmall}`}>
                <span className={styles.logoText}>SAGIE MAYA</span>
                <span className={styles.tagline}>Graphic Designer</span>
            </Link>

            <Link href="/info" className={styles.navLink}>
                INFO
            </Link>
        </header>
    );
}
