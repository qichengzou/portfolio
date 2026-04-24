import { fetchJSON, renderProjects } from './global.js';

const projects = await fetchJSON('./lib/projects.json');

const latest = projects.slice(0, 3);

const container = document.querySelector('.projects');

renderProjects(latest, container, 'h2');

import { fetchGitHubData } from './global.js';

const data = await fetchGitHubData('qichengzou');

const stats = document.querySelector('#profile-stats');

if (stats) {
  stats.innerHTML = `
    <dl>
      <dt>Repos</dt><dd>${data.public_repos}</dd>
      <dt>Followers</dt><dd>${data.followers}</dd>
      <dt>Following</dt><dd>${data.following}</dd>
    </dl>
  `;
}