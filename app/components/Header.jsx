'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <header className={`${styles.header} ${isHome ? styles.home : styles.sub}`}>
            <Link href="/work" className={styles.navLink}>
                WORK
            </Link>

            <Link href="/" className={`${styles.logo} ${isHome ? styles.logoHero : styles.logoSmall}`}>
                <span className={styles.logoText}>CAM HICKS</span>
                <span className={styles.tagline}>Virginia bred. Storyteller. EST 1992</span>
            </Link>

            <Link href="/info" className={styles.navLink}>
                INFO
            </Link>
        </header>
    );
}
