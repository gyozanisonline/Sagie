import Storyblok, { version } from '@/lib/storyblok';
import Image from 'next/image';
import styles from './page.module.css';
import StoryblokBridgeComp from '../components/StoryblokBridge';

export const revalidate = 60;

async function getInfo() {
    try {
        const { data } = await Storyblok.get('cdn/stories/info', {
            version,
        });
        return data.story?.content || null;
    } catch {
        return null;
    }
}

export default async function InfoPage() {
    const info = await getInfo();

    return (
        <div className={styles.page}>
            <StoryblokBridgeComp />
            <div className={styles.layout}>
                {/* Left — portrait */}
                <div className={styles.imageCol}>
                    {info?.portrait?.filename && (
                        <div className={styles.portrait}>
                            <Image
                                src={info.portrait.filename}
                                alt="Portrait"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                    )}
                </div>

                {/* Right — bio + contact */}
                <div className={styles.textCol}>
                    <p className={styles.bio}>
                        {info?.bio || 'A storyteller providing the narratives through photo, moving image, creative direction, and consulting.'}
                    </p>

                    {info?.press_url && (
                        <p className={styles.press}>
                            You can also find me in the <a href={info.press_url} target="_blank" rel="noopener noreferrer">press</a>.
                        </p>
                    )}

                    <footer className={styles.footer}>
                        {info?.instagram_url && (
                            <a href={info.instagram_url} target="_blank" rel="noopener noreferrer" className={styles.contact}>
                                Instagram
                            </a>
                        )}
                        {info?.email && (
                            <a href={`mailto:${info.email}`} className={styles.contact}>
                                {info.email}
                            </a>
                        )}
                        {info?.tagline && (
                            <span className={styles.tagline}>{info.tagline}</span>
                        )}
                    </footer>
                </div>
            </div>
        </div>
    );
}
