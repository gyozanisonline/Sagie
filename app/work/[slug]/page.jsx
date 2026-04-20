import ProjectCarousel from '@/app/components/ProjectCarousel';
import CoverStack from '@/app/components/CoverStack';
import Link from 'next/link';
import styles from './page.module.css';
import { PROJECTS } from '@/lib/projects';

export function generateStaticParams() {
    return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
    const project = projectIndex >= 0 ? PROJECTS[projectIndex] : null;

    if (!project) {
        return (
            <div className={styles.notFound}>
                <p>Project not found.</p>
                <Link href="/work">← Back to Work</Link>
            </div>
        );
    }

    const images = [];
    if (project.content.CoverImage?.filename) {
        images.push(project.content.CoverImage);
    }
    if (Array.isArray(project.content.Images)) {
        images.push(...project.content.Images);
    }

    const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];

    if (project.layout === 'cover-stack') {
        return (
            <div className={styles.pageStack}>
                <CoverStack
                    images={images}
                    title={project.content.Title}
                    category={project.content.Category}
                    nextSlug={nextProject?.slug}
                    nextTitle={nextProject?.content?.Title}
                />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <ProjectCarousel
                images={images}
                title={project.content.Title}
                category={project.content.Category}
                nextSlug={nextProject?.slug}
                nextTitle={nextProject?.content?.Title}
            />
        </div>
    );
}
