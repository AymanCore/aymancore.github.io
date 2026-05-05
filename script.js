const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const projectsGrid = document.querySelector("#projects-grid");
const projectsStatus = document.querySelector("#projects-status");
const filterButtons = document.querySelectorAll(".filter");
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalCategory = document.querySelector("#modal-category");
const modalDescription = document.querySelector("#modal-description");
const modalTechs = document.querySelector("#modal-techs");
const contactForm = document.querySelector("#contact-form");
const formMessage = document.querySelector("#form-message");

let projects = [];
let activeFilter = "all";

const fallbackProjects = [
  {
  "id": 1,
  "title": "Mini-Projet HTML/CSS",
  "category": "web",
  "description": "Une page web moderne réalisée en HTML et CSS avec un en-tête, une barre de navigation, une section principale avec image, article, vidéo, sidebar et footer. Le projet respecte une structure claire et une mise en page adaptée aux ordinateurs.",
  "techs": ["HTML", "CSS"]
  }
];

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

async function loadProjects() {
  try {
    projectsStatus.textContent = "Chargement des projets...";

    const response = await fetch("projects.json");

    if (!response.ok) {
      throw new Error("Impossible de charger les projets.");
    }

    projects = await response.json();
    renderProjects();
  } catch (error) {
    projects = fallbackProjects;
    projectsStatus.textContent = "Mode local : les projets de secours sont affiches.";
    renderProjects();
    console.error(error);
  }
}

function renderProjects() {
  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter((project) => project.category === activeFilter);

  projectsStatus.textContent = `${filteredProjects.length} projet(s) affiche(s).`;

  projectsGrid.innerHTML = filteredProjects.map((project) => `
    <article class="project-card">
      <div>
        <div class="project-card-header">
          <span class="project-category">${project.category.toUpperCase()}</span>
          <h3>${project.title}</h3>
        </div>
        <p>${project.description}</p>
      </div>
      <button class="button secondary" type="button" data-project-id="${project.id}">
        Details
      </button>
    </article>
  `).join("");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProjects();
  });
});

projectsGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-id]");

  if (!button) {
    return;
  }

  const project = projects.find((item) => item.id === Number(button.dataset.projectId));

  if (project) {
    openProjectModal(project);
  }
});

function openProjectModal(project) {
  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modalDescription.textContent = project.description;
  modalTechs.innerHTML = project.techs.map((tech) => `<li>${tech}</li>`).join("");

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeProjectModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

modal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) {
    closeProjectModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeProjectModal();
  }
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();

  formMessage.textContent = `Merci ${name}, votre message a bien ete prepare.`;
  contactForm.reset();
});

loadProjects();
