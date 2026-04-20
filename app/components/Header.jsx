'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PROJECTS } from '@/lib/projects';
import styles from './Header.module.css';

export default function Header() {
    const pathname = usePathname();
    const isHome    = pathname === '/';
    if (isHome) return null;

    const isInfo    = pathname === '/info';
    const isWork    = pathname === '/work';
    const isProject = pathname.startsWith('/work/') && pathname !== '/work';

    const projectSlug = isProject ? pathname.replace('/work/', '') : null;
    const project = projectSlug ? PROJECTS.find((p) => p.slug === projectSlug) : null;
    const projectTitle = project?.content?.Title ?? null;

    const workActive = isWork || isProject;
    const showSideNav = isProject || isInfo;

    return (
        <header className={`${styles.header} ${isHome ? styles.home : styles.sub} ${isInfo ? styles.headerInfo : ''}`}>
            <div className={styles.left}>
                {showSideNav && (
                    <Link
                        href="/work"
                        className={`${styles.navLink} ${workActive ? styles.navLinkActive : ''}`}
                        aria-current={workActive ? 'page' : undefined}
                    >
                        {isProject ? '← Work' : 'Work'}
                    </Link>
                )}
                {isProject && projectTitle && (
                    <span className={styles.crumb}>
                        <span className={styles.crumbSep} aria-hidden="true">/</span>
                        <span className={styles.crumbTitle}>{projectTitle}</span>
                    </span>
                )}
            </div>

            <Link href="/" className={`${styles.logo} ${isHome ? styles.logoHero : styles.logoSmall}`}>
                <span className={styles.logoText}>SAGIE MAYA</span>
            </Link>

            <div className={styles.right}>
                {showSideNav && (
                    <Link
                        href="/info"
                        className={`${styles.navLink} ${isInfo ? styles.navLinkActive : ''}`}
                        aria-current={isInfo ? 'page' : undefined}
                    >
                        Info
                    </Link>
                )}
            </div>
        </header>
    );
}
