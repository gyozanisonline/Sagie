import Storyblok from '@/lib/storyblok';
import ProjectCarousel from '@/app/components/ProjectCarousel';
import Link from 'next/link';
import styles from './page.module.css';

export const revalidate = 60;

export async function generateStaticParams() {
    try {
        const { data } = await Storyblok.get('cdn/stories', {
            starts_with: 'work/',
            version: 'published',
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
            version: 'published',
        });
        return data.story;
    } catch {
        return null;
    }
}

export default async function ProjectPage({ params }) {
    const project = await getProject(params.slug);

    if (!project) {
        return (
            <div className={styles.notFound}>
                <p>Project not found.</p>
                <Link href="/work">← Back to Work</Link>
            </div>
        );
    }

    const images = project.content.images || [];
    if (project.content.cover_image?.filename) {
        images.unshift(project.content.cover_image);
    }

    return (
        <div className={styles.page}>
            <Link href="/work" className={styles.back}>← Work</Link>
            <ProjectCarousel images={images} title={project.content.title} />
        </div>
    );
}
