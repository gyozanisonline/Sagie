import Image from 'next/image';
import styles from './page.module.css';

export const metadata = {
    title: 'Info — Sagie Maya',
    description: 'Sagie Maya — building brands through creative direction, graphic design, and product. Based in Tel Aviv.',
};

export default function InfoPage() {
    return (
        <div className={styles.page}>
            <div className={styles.body}>
                {/* Bio — sans-serif, left column */}
                <div className={styles.bioCol}>
                    <p className={styles.para}>
                        Building brands through creative direction, graphic design, and product.
                        Founder of Going Places. Based in Tel Aviv.
                    </p>
                    <p className={styles.para}>
                        Working across branding, apparel, retail, and visual identity for over 14
                        years, with experience spanning independent labels and global brands.
                    </p>
                    <p className={styles.para}>
                        Focused on thoughtful design, clear ideas, and creating work that feels
                        timeless rather than trend-driven.
                    </p>
                    <p className={styles.para}>
                        Believing that the strongest brands are built through consistency, curiosity,
                        and a clear point of view.
                    </p>
                </div>

                {/* Portrait — right */}
                <figure className={styles.portrait}>
                    <Image
                        src="/placeholders/CIMG0002.JPG"
                        alt="Sagie Maya"
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                </figure>
            </div>

            {/* Footer — serif, pinned bottom */}
            <footer className={styles.footer}>
                <a
                    className={styles.footLink}
                    href="https://www.instagram.com/sagiemaya"
                    target="_blank"
                    rel="noreferrer"
                >
                    Instagram
                </a>
                <a className={styles.footLink} href="mailto:sagiesag@gmail.com">
                    Sagiesag@gmail.com
                </a>
            </footer>
        </div>
    );
}
