'use client';
import { useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HomeCarousel.module.css';

export default function HomeCarousel({ projects = [] }) {
    const trackRef = useRef(null);
    let isDown = false;
    let startX;
    let scrollLeft;

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const onMouseDown = (e) => {
            isDown = true;
            track.classList.add(styles.active);
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        };
        const onMouseLeave = () => { isDown = false; track.classList.remove(styles.active); };
        const onMouseUp = () => { isDown = false; track.classList.remove(styles.active); };
        const onMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            track.scrollLeft = scrollLeft - walk;
        };

        track.addEventListener('mousedown', onMouseDown);
        track.addEventListener('mouseleave', onMouseLeave);
        track.addEventListener('mouseup', onMouseUp);
        track.addEventListener('mousemove', onMouseMove);

        return () => {
            track.removeEventListener('mousedown', onMouseDown);
            track.removeEventListener('mouseleave', onMouseLeave);
            track.removeEventListener('mouseup', onMouseUp);
            track.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <div className={styles.carousel} ref={trackRef}>
            {projects.map((project) => (
                <Link
                    key={project.slug}
                    href={`/work/${project.slug}`}
                    className={styles.card}
                >
                    <span className={styles.cardTitle}>{project.content.title}</span>
                    <div className={styles.cardImage}>
                        {project.content.cover_image?.filename && (
                            <Image
                                src={project.content.cover_image.filename}
                                alt={project.content.title}
                                fill
                                sizes="(max-width: 768px) 80vw, 400px"
                                style={{ objectFit: 'cover' }}
                            />
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
