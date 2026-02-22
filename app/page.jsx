import Storyblok, { version } from '@/lib/storyblok';
import HomeCarousel from './components/HomeCarousel';
import StoryblokBridgeComp from './components/StoryblokBridge';
import styles from './page.module.css';

export const revalidate = 60;

async function getFeaturedProjects() {
    try {
        const { data } = await Storyblok.get('cdn/stories', {
            starts_with: 'work/',
            filter_query: { Featured: { is: true } },
            version,
            per_page: 20,
        });
        return data.stories || [];
    } catch {
        return [];
    }
}

export default async function HomePage() {
    const featured = await getFeaturedProjects();

    return (
        <div className={styles.page}>
            <StoryblokBridgeComp />
            <HomeCarousel projects={featured} />
        </div>
    );
}
