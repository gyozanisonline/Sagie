import ProjectDetail from '@/app/components/ProjectDetail';
import Link from 'next/link';
import styles from './page.module.css';
import { WORK } from '@/lib/work';

export function generateStaticParams() {
    return WORK.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const projectIndex = WORK.findIndex((p) => p.slug === slug);
    const project = projectIndex >= 0 ? WORK[projectIndex] : null;

    if (!project) {
        return (
            <div className={styles.notFound}>
                <p>Project not found.</p>
                <Link href="/work">← Back to Work</Link>
            </div>
        );
    }

    const images = [];
    if (project.content.CoverImage?.filename) images.push(project.content.CoverImage);
    if (Array.isArray(project.content.Images)) images.push(...project.content.Images);

    const nextProject = WORK[(projectIndex + 1) % WORK.length];

    return (
        <ProjectDetail
            images={images}
            title={project.content.Title}
            category={project.content.Category}
            nextSlug={nextProject?.slug}
            nextTitle={nextProject?.content?.Title}
        />
    );
}
