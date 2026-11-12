import { sitePath } from '../lib/site';
import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { docs } from '../data/docs';

const markdown = import.meta.glob<string>('./docs/**/*.md', { query: '?raw', import: 'default', eager: true });

export const GET: APIRoute = () => new Response(JSON.stringify([
  ...projects.filter(project => project.availability !== 'planned').map(project => ({ title: project.name, description: project.description, href: `/projects/${project.slug}/`, section: project.kind === 'library' ? 'Developer tools' : project.platform, text: [project.slug, project.kind, project.platform, project.status, project.summary].join(' ') })),
  { title: 'Android direction', description: 'The planned Android phone app and its optional Pebble companion, within the project’s future direction.', href: '/about/#phone-plan', section: 'Project plan', text: 'Phone Phone for Pebble planned Android optional watch companion calls' },
  ...docs.map(doc => ({ title: doc.title, description: doc.description, href: doc.href === '/docs/getting-started/' ? '/docs/' : doc.href, section: doc.section, text: (markdown[`./docs/${doc.href.replace(/^\/docs\//, '').replace(/\/$/, '')}.md`] ?? '').replace(/^---[\s\S]*?---/, '').replace(/\s+/g, ' ').trim() })),
  { title: 'Software', description: 'Download the current Pebble watchfaces, apps and weather plugin.', href: '/projects/', section: 'Software' },
  { title: 'PebbleOS apps', description: 'Watch apps, watchfaces, requirements and a labelled watch-button guide.', href: '/pebble/', section: 'Software', text: 'Pebble Time 2 Android iPhone iOS compatibility watch buttons Up Select Down Back Quick Launch reading complication plugin' },
  { title: 'About XOCE', description: 'The ecosystem goal, KDE Plasma, Android, PebbleOS and how to contribute.', href: '/about/', section: 'Project' },
  { title: 'Project plan', description: 'Early apps, dependable stable editions, separate experiments and deeper system work.', href: '/about/#stages', section: 'Project', text: 'roadmap stages phase development experimental JMAP calendars tasks contacts' },
  { title: 'Connected devices', description: 'The goal of shared state and actions across desktop, phone and watch.', href: '/about/#connected-devices', section: 'Project', text: 'timer countdown synchronization sync ecosystem future' },
].map(entry => ({ ...entry, href: sitePath(entry.href) }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
