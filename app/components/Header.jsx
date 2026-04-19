'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROJECTS } from '@/lib/projects';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const isHome    = pathname === '/';
    const isInfo    = pathname === '/info';
    const isWork    = pathname === '/work';
    const isProject = pathname.startsWith('/work/') && pathname !== '/work';

    const projectSlug = isProject ? pathname.replace('/work/', '') : null;
    const project = projectSlug ? PROJECTS.find((p) => p.slug === projectSlug) : null;
    const projectTitle = project?.content?.Title ?? null;

    const workActive = isWork || isProject;

    return (
        <header className={`${styles.header} ${isHome ? styles.home : styles.sub} ${isInfo ? styles.headerInfo : ''}`}>
            <div className={styles.left}>
                <Link
                    href="/work"
                    className={`${styles.navLink} ${workActive ? styles.navLinkActive : ''}`}
                    aria-current={workActive ? 'page' : undefined}
                >
                    {isProject ? '← Work' : 'Work'}
                </Link>
                {isProject && projectTitle && (
                    <span className={styles.crumb} aria-hidden="true">
                        <span className={styles.crumbSep}>/</span>
                        <span className={styles.crumbTitle}>{projectTitle}</span>
                    </span>
                )}
            </div>

            <Link href="/" className={`${styles.logo} ${isHome ? styles.logoHero : styles.logoSmall}`}>
                <span className={styles.logoText}>SAGIE MAYA</span>
                <span className={styles.tagline}>Graphic Designer</span>
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
