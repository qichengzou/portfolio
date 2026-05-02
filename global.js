console.log('IT’S ALIVE!');

const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/";

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname
// );

// currentLink?.classList.add("current");

let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "cv/", title: "CV" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/qichengzou", title: "GitHub" }
];

let nav = document.createElement("nav");
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  url = !url.startsWith("http") ? BASE_PATH + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = title;

  // highlight current page
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

let select = document.querySelector(".color-scheme select");

select.addEventListener("input", function (event) {
  document.documentElement.style.setProperty("color-scheme", event.target.value);
  localStorage.colorScheme = event.target.value;
});

if ("colorScheme" in localStorage) {
  document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

//projects
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) {
    console.error('Container not found');
    return;
  }

  containerElement.innerHTML = '';

  projects.forEach(project => {
    const article = document.createElement('article');

    article.innerHTML = `
      <h3>${project.title}</h3>
      <img src="${project.image}" alt="" />
      <p>${project.description}</p>
      <p class="project-year">${project.year}</p>
    `;

    containerElement.appendChild(article);
  });
}

//github
export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}