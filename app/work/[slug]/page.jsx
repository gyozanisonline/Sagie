import Storyblok, { version } from '@/lib/storyblok';
import ProjectCarousel from '@/app/components/ProjectCarousel';
import StoryblokBridgeComp from '@/app/components/StoryblokBridge';
import Link from 'next/link';
import styles from './page.module.css';

export const revalidate = 60;

export async function generateStaticParams() {
    try {
        const { data } = await Storyblok.get('cdn/stories', {
            starts_with: 'work/',
            version,
            per_page: 100,
        });
        return (data.stories || []).map((s) => ({ slug: s.slug }));
    } catch {
        return [];
    }
}

async function getProject(slug) {
    try {
        const { data } = await Storyblok.get(`cdn/stories/work/${slug}`, {
            version,
        });
        return data.story;
    } catch {
        return null;
    }
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return (
            <div className={styles.notFound}>
                <p>Project not found.</p>
                <Link href="/work">← Back to Work</Link>
            </div>
        );
    }

    // Build images array — CoverImage first, then the rest of Images
    const images = [];
    if (project.content.CoverImage?.filename) {
        images.push(project.content.CoverImage);
    }
    if (Array.isArray(project.content.Images)) {
        images.push(...project.content.Images);
    }

    return (
        <div className={styles.page}>
            <StoryblokBridgeComp />
            <ProjectCarousel images={images} title={project.content.Title} />
        </div>
    );
}
