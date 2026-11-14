import { sitePath } from '../lib/site';
import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { docs } from '../data/docs';
import { bundledReleases, developmentLibraries, developerReferenceHeadings } from '../data/development';
import { designReferenceHeadings } from '../data/design-reference';

const markdown = import.meta.glob<string>('./docs/**/*.md', { query: '?raw', import: 'default', eager: true });
const developerBuildText = [
  ...developerReferenceHeadings.map(heading => heading.text),
  ...projects.filter(project => project.kind !== 'library' && project.availability !== 'planned').flatMap(project => [project.name, project.version, project.tag]),
  ...developmentLibraries.flatMap(library => [library.name, library.packageName, library.version, library.status, library.purpose]),
  ...bundledReleases.flatMap(bundle => [projects.find(project => project.slug === bundle.slug)?.name, bundle.ref,
    bundle.core ? `Core ${bundle.core}` : '', bundle.activities ? `Activities ${bundle.activities}` : '', bundle.ui ? `XOCE UI ${bundle.ui}` : '']),
].filter(Boolean).join(' ');

function guideSearchText(href: string) {
  const pathname = href.replace(/^\/docs\//, '').replace(/\/$/, '');
  const source = markdown[`./docs/${pathname}.md`] ?? markdown[`./docs/${pathname}/index.md`] ?? '';
  const frontmatter = source.match(/^---([\s\S]*?)---/)?.[1] ?? '';
  const designVariant = frontmatter.match(/^designReference:\s*(website|patterns|pebble)\s*$/m)?.[1] as keyof typeof designReferenceHeadings | undefined;
  return [
    source.replace(/^---[\s\S]*?---/, ''),
    /^developerReference:\s*true\s*$/m.test(frontmatter) ? developerBuildText : '',
    designVariant ? designReferenceHeadings[designVariant].map(heading => heading.text).join(' ') : '',
  ].join(' ').replace(/\s+/g, ' ').trim();
}

export const GET: APIRoute = () => new Response(JSON.stringify([
  ...projects.filter(project => project.availability !== 'planned').map(project => ({ title: project.name, description: project.description, href: `/projects/${project.slug}/`, section: project.kind === 'library' ? 'Developer tools' : project.platform, text: [project.slug, project.kind, project.platform, project.publication ?? project.status, project.summary].join(' ') })),
  { title: 'Android direction', description: 'The planned Android phone app and its optional Pebble companion, within the project’s future direction.', href: '/about/#phone-plan', section: 'Project plan', text: 'Phone Phone for Pebble planned Android optional watch companion calls' },
  ...projects.filter(project => project.supportUrl).flatMap(project => [{ title: project.name + ' support', description: 'Setup help and issue reporting.', href: project.supportUrl!, section: 'Support' }, { title: project.name + ' privacy', description: 'Data, permissions and storage.', href: project.privacyUrl!, section: 'Privacy' }]),
  ...docs.map(doc => ({ title: doc.status === 'historical' && !/^Historical\b/i.test(doc.title) ? `Historical: ${doc.title}` : doc.title,
    description: doc.description, href: doc.href === '/docs/getting-started/' ? '/docs/' : doc.href,
    section: doc.status === 'historical' ? `${doc.section} · History` : doc.section,
    status: doc.status ?? 'current', text: guideSearchText(doc.href) })),
  { title: 'Software', description: 'Download the current Pebble watchfaces, apps and weather plugin.', href: '/projects/', section: 'Software' },
  { title: 'PebbleOS apps', description: 'Watch apps, watchfaces, requirements and a labelled watch-button guide.', href: '/pebble/', section: 'Software', text: 'Pebble Time 2 Round 2 Android iPhone iOS compatibility watch buttons Up Select Down Back Quick Launch reading complication plugin' },
  { title: 'About XOCE', description: 'The ecosystem goal, KDE Plasma, Android, PebbleOS and how to contribute.', href: '/about/', section: 'Project' },
  { title: 'Project plan', description: 'Early apps, dependable stable editions, separate experiments and deeper system work.', href: '/about/#stages', section: 'Project', text: 'roadmap stages phase development experimental JMAP calendars tasks contacts' },
  { title: 'Connected devices', description: 'The goal of shared state and actions across desktop, phone and watch.', href: '/about/#connected-devices', section: 'Project', text: 'timer countdown synchronization sync ecosystem future' },
].map(entry => ({ ...entry, href: sitePath(entry.href) }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
