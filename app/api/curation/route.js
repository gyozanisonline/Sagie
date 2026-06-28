import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { WORK } from '@/lib/work';
import { MEDIUMS } from '@/lib/medium';

const FILE = path.join(process.cwd(), 'data', 'curation.json');
const R2_PREFIX = 'https://pub-d0e7eeb8686c4d4f99d9d40b305dfa6d.r2.dev/';
const SLUGS = new Set(WORK.map((p) => p.slug));

// Curation is a local authoring tool only. It must never accept writes in
// production (it's an unauthenticated file write). Disable the whole route there.
const DISABLED = process.env.NODE_ENV === 'production';

async function read() {
    try {
        const data = JSON.parse(await fs.readFile(FILE, 'utf8'));
        return { fronts: {}, tags: {}, featured: [], ...data };
    } catch {
        return { fronts: {}, tags: {}, featured: [] };
    }
}

function cleanFeatured(arr) {
    if (!Array.isArray(arr)) return [];
    return [...new Set(arr.filter((s) => SLUGS.has(s)))];
}

// Only keep keys that are real project slugs, fronts that are R2 URLs, and
// tags that are known mediums (or '' to clear).
function cleanFronts(obj) {
    const out = {};
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        for (const [k, v] of Object.entries(obj)) {
            if (SLUGS.has(k) && typeof v === 'string' && v.startsWith(R2_PREFIX)) out[k] = v;
        }
    }
    return out;
}
// Tags are stored as arrays of mediums (multi-tag). Accept an array, a single
// string (back-compat), '' / null to clear.
function cleanTags(obj) {
    const out = {};
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        for (const [k, v] of Object.entries(obj)) {
            if (!SLUGS.has(k)) continue;
            if (Array.isArray(v)) out[k] = [...new Set(v.filter((x) => MEDIUMS.includes(x)))];
            else if (v === '' || v == null) out[k] = [];
            else if (MEDIUMS.includes(v)) out[k] = [v];
        }
    }
    return out;
}

export async function GET() {
    if (DISABLED) return new NextResponse('Not Found', { status: 404 });
    return NextResponse.json(await read());
}

export async function POST(req) {
    if (DISABLED) return new NextResponse('Not Found', { status: 404 });

    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const cur = await read();
    const next = {
        fronts: { ...cur.fronts, ...cleanFronts(body.fronts) },
        tags: { ...cur.tags, ...cleanTags(body.tags) },
        featured: Array.isArray(body.featured) ? cleanFeatured(body.featured) : cur.featured || [],
    };
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(next, null, 2));
    return NextResponse.json({ ok: true, ...next });
}
