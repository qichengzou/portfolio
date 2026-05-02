import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

const title = document.querySelector('.projects-title');

if (title) {
  title.textContent = `${projects.length} Projects`;
}

let query = '';
let selectedYear = null;

let searchInput = document.querySelector('.searchBar');


renderProjects(projects, projectsContainer, 'h2');
renderPieChart(projects);


function getFilteredProjects() {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    let matchesQuery = values.includes(query.toLowerCase());

    let matchesYear =
      selectedYear === null || String(project.year) === String(selectedYear);

    return matchesQuery && matchesYear;
  });
}

searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = getFilteredProjects();

  renderProjects(filteredProjects, projectsContainer, 'h2');

  // Pie should reflect search results only, not selected year
  let searchOnlyProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  renderPieChart(searchOnlyProjects);
});

function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let selectedIndex = data.findIndex((d) => String(d.label) === String(selectedYear));

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);

  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  arcs.forEach((arc, idx) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .attr('class', selectedIndex === idx ? 'selected' : '')
      .on('click', () => {
        let clickedYear = data[idx].label;

        selectedYear =
          String(selectedYear) === String(clickedYear) ? null : clickedYear;

        let filteredProjects = getFilteredProjects();
        renderProjects(filteredProjects, projectsContainer, 'h2');

        renderPieChart(projectsGiven);
      });
  });

  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', selectedIndex === idx ? 'selected' : '')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

