import { consumerProjects } from './projects.ts';
import { screenshotGalleries } from './screenshots.ts';

export const setupReferenceHeadings = [
  { depth: 2, slug: 'illustrated-first-setup', text: 'A countdown on your watchface, in pictures' },
];

export const setupExamples = ['dynamic', 'halftone'].map(slug => {
  const project = consumerProjects.find(project => project.slug === slug)!;
  const landing = screenshotGalleries[slug].find(image => image.kind === 'phone' && image.version === project.version);
  const watch = screenshotGalleries[slug].find(image => image.kind === 'watch' && image.platform === 'gabbro' && /timer/i.test(image.title));
  if (!landing || !watch) throw Error(`Missing illustrated setup evidence for ${slug}`);
  const priority = {
    image: `/images/setup/${slug}-${project.version}-activity-setup-20261115.jpg`,
    width: 1363, height: 936, displayWidth: 512, displayHeight: 880, version: project.version!,
    alt: `${project.name} phone settings: activity plugins enabled, Timer first in the priority list, and a confirmed phone save.`,
  };
  return {
    project, landing, watch,
    category: slug === 'dynamic' ? 'Activities' : 'Content & priority',
    landingCrop: slug === 'dynamic' ? { top: 0, height: 320 } : { top: 85, height: 160 },
    priority,
    save: {
      ...priority,
      image: slug === 'halftone' ? `/images/setup/halftone-${project.version}-save-state-20261115.jpg` : priority.image,
      alt: `${project.name}: phone settings saved, with a separate pending watch-delivery status.`,
      deliveryCrop: slug === 'halftone' ? { top: 320, height: 125 } : undefined,
      footerCrop: { top: 769, height: 111 },
    },
  };
});
