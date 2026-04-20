import HomeHero from './components/HomeHero';
import ScatterTable from './components/ScatterTable';
import { PROJECTS } from '@/lib/projects';

const HERO_PROJECT_COUNT = 10;

export default function HomePage() {
    return (
        <>
            <HomeHero />
            <ScatterTable projects={PROJECTS.slice(0, HERO_PROJECT_COUNT)} />
        </>
    );
}
