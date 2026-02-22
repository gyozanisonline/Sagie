import Storyblok, { version } from '@/lib/storyblok';
import ProjectGrid from '../components/ProjectGrid';
import StoryblokBridgeComp from '../components/StoryblokBridge';

export const revalidate = 60;

async function getAllProjects() {
    try {
        const { data } = await Storyblok.get('cdn/stories', {
            starts_with: 'work/',
            version,
            per_page: 100,
        });
        return data.stories || [];
    } catch {
        return [];
    }
}

export default async function WorkPage() {
    const projects = await getAllProjects();

    return (
        <>
            <StoryblokBridgeComp />
            <ProjectGrid projects={projects} />
        </>
    );
}
