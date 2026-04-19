import HomeStrip from './components/HomeStrip';
import { PROJECTS } from '@/lib/projects';

const HERO_PROJECT_COUNT = 8;

export default function HomePage() {
    return <HomeStrip projects={PROJECTS.slice(0, HERO_PROJECT_COUNT)} />;
}
