import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.resolve('projects.json');

// Helper to read DB
function readDb() {
    if (!fs.existsSync(DB_PATH)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Helper to write DB
function writeDb(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
    const projects = readDb();
    return json(projects);
}

export async function POST({ request }) {
    const projects = await request.json();
    writeDb(projects);
    return json({ success: true });
}
