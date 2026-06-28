import Link from 'next/link';
import Image from 'next/image';
import { thumb, thumbDims } from '@/lib/thumbs';
import styles from './GoingPlacesScroll.module.css';

// Deterministic (index-based) sparse composition so server and client render
// identically — no hydration mismatch, no flash. Marco Argüello style:
// asymmetric placement, varied scale, generous negative space, single scroll.
const ALIGN = ['left', 'right', 'center', 'right', 'left', 'center'];
const SIZE = ['m', 'l', 's', 'm', 's', 'l'];
const NUDGE = ['', 'down', '', 'down', '', ''];

export default function GoingPlacesScroll({ projects }) {
    return (
        <div className={styles.scroll}>
            {projects.map((p, i) => {
                const src = p.content.CoverImage?.filename;
                if (!src) return null;
                const dims = thumbDims(src) || { w: 800, h: 1000 };
                const align = ALIGN[i % ALIGN.length];
                const size = SIZE[i % SIZE.length];
                const nudge = NUDGE[i % NUDGE.length];
                return (
                    <figure
                        key={p.slug}
                        className={[
                            styles.item,
                            styles[`align_${align}`],
                            styles[`size_${size}`],
                            nudge ? styles.nudgeDown : '',
                        ].join(' ')}
                    >
                        <Link href={`/work/${p.slug}`} className={styles.link}>
                            <Image
                                src={thumb(src)}
                                alt={p.content.Title || ''}
                                width={dims.w}
                                height={dims.h}
                                unoptimized
                                className={styles.img}
                                sizes="(max-width: 640px) 72vw, 42vw"
                            />
                            <figcaption className={styles.caption}>{p.content.Title}</figcaption>
                        </Link>
                    </figure>
                );
            })}
        </div>
    );
}
