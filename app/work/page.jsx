import { CATEGORIES } from '@/lib/projects';
import { WORK } from '@/lib/work';
import WorkClient from './WorkClient';
import GoingPlacesScroll from '../components/GoingPlacesScroll';
import ArchiveGrid from '../components/ArchiveGrid';

// Read the category from the URL on the server so the first paint is already
// the correct view (no flash of the All sphere before the real category).
export default async function WorkPage({ searchParams }) {
    const params = await searchParams;
    const cat = params?.category;
    const initialFilter = cat && CATEGORIES.includes(cat) ? cat : 'All';

    // The Work page = the full archive as a dense, medium-filtered grid (dark).
    if (initialFilter === 'All') {
        return <ArchiveGrid projects={WORK} />;
    }
    if (initialFilter === 'Going Places') {
        const projects = WORK.filter((p) => p.content.Category === 'Going Places');
        return <GoingPlacesScroll projects={projects} />;
    }

    return <WorkClient initialFilter={initialFilter} />;
}
