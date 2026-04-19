import Image from 'next/image';
import styles from './page.module.css';

export default function InfoPage() {
    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                {/* Left — portrait */}
                <div className={styles.imageCol}>
                    <div className={styles.portrait}>
                        <Image
                            src="/placeholders/CIMG0002.JPG"
                            alt="Portrait"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                    </div>
                </div>

                {/* Right — bio + contact */}
                <div className={styles.textCol}>
                    <p className={styles.bio}>
                        A storyteller providing the narratives through photo, moving image, creative direction, and consulting.
                    </p>

                    <footer className={styles.footer}>
                        <a className={styles.contact} href="mailto:hello@sagiemaya.com">
                            hello@sagiemaya.com
                        </a>
                        <a
                            className={styles.contact}
                            href="https://www.instagram.com/sagiemaya"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Instagram ↗
                        </a>
                        <span className={styles.tagline}>Based in Tel Aviv · Available worldwide</span>
                    </footer>
                </div>
            </div>
        </div>
    );
}
