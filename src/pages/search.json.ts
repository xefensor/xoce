import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { docs } from '../data/docs';

const markdown = import.meta.glob<string>('./docs/**/*.md', { query: '?raw', import: 'default', eager: true });

export const GET: APIRoute = () => new Response(JSON.stringify([
  ...projects.map(project => ({ title: project.name, description: project.description, href: `/projects/${project.slug}/`, section: project.kind === 'library' ? 'Developer tools' : 'Projects' })),
  ...docs.map(doc => ({ title: doc.title, description: doc.description, href: doc.href, section: doc.section, text: (markdown[`./docs/${doc.href.replace(/^\/docs\//, '').replace(/\/$/, '')}.md`] ?? '').replace(/^---[\s\S]*?---/, '').replace(/\s+/g, ' ').trim() })),
  { title: 'The XOCE Lab', description: 'Spatial desktop ideas, an interactive workspace study and modern standards such as JMAP.', href: '/lab/', section: 'Lab' },
  { title: 'About XOCE', description: 'Xef’s Open Computing Ecosystem, its principles and how to contribute.', href: '/about/', section: 'About' },
]), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
