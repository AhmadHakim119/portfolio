const root = document.documentElement;
root.classList.add("interactive");
const motionAllowed = () => !matchMedia("(prefers-reduced-motion: reduce)").matches;

// Filter real HTML, preserving links and content when JavaScript is unavailable.
const projectButtons = [...document.querySelectorAll("[data-project-filter]")];
const projects = [...document.querySelectorAll(".project[data-category]")];
const replayFilter = (grid) => {
  if (!motionAllowed()) return;
  grid.classList.remove("filter-changed");
  requestAnimationFrame(() => grid.classList.add("filter-changed"));
};
projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.projectFilter;
    projectButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    projects.forEach(project => { project.hidden = selected !== "all" && project.dataset.category !== selected; });
    const count = projects.filter(project => !project.hidden).length;
    document.querySelector("[data-project-count]").textContent = count + (count === 1 ? " project" : " projects");
    replayFilter(document.querySelector(".project-grid"));
  });
});

const skillButtons = [...document.querySelectorAll("[data-skill-filter]")];
const skillCards = [...document.querySelectorAll("[data-skill-category]")];
const skillSearch = document.querySelector("[data-skill-search]");
let skillCategory = "all";
const filterSkills = () => {
  const query = skillSearch.value.trim().toLowerCase();
  skillCards.forEach(card => {
    const categoryMatch = skillCategory === "all" || card.dataset.skillCategory.split(" ").includes(skillCategory);
    card.hidden = !categoryMatch || !card.textContent.toLowerCase().includes(query);
  });
  const count = skillCards.filter(card => !card.hidden).length;
  document.querySelector("[data-skill-count]").textContent = count + " of " + skillCards.length + " tools and foundations";
  document.querySelector(".toolkit-empty").hidden = count > 0;
};
skillButtons.forEach(button => button.addEventListener("click", () => {
  skillCategory = button.dataset.skillFilter;
  skillButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  filterSkills();
  replayFilter(document.querySelector(".toolkit-grid"));
}));
skillSearch.addEventListener("input", filterSkills);
document.querySelector("[data-reset-skills]").addEventListener("click", () => {
  skillSearch.value = "";
  skillButtons[0].click();
  skillSearch.focus();
});
filterSkills();

// A collapsible mobile menu with native links and Escape handling.
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const closeMenu = (restoreFocus = false) => {
  header.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  menuButton.querySelector(".icon").dataset.icon = "menu-2";
  if (restoreFocus) menuButton.focus();
};
menuButton.addEventListener("click", () => {
  const open = header.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuButton.querySelector(".icon").dataset.icon = open ? "x" : "menu-2";
});
header.querySelectorAll("nav a").forEach(link => link.addEventListener("click", () => closeMenu()));
document.addEventListener("click", event => {
  if (!header.contains(event.target)) closeMenu();
});
matchMedia("(min-width: 761px)").addEventListener("change", () => closeMenu());

// Active section navigation uses observation instead of scroll-frame work.
const navLinks = [...header.querySelectorAll('nav a[href^="#"]')];
if ("IntersectionObserver" in window) {
  const positions = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => positions.set(entry.target.id, entry.isIntersecting));
    const activeId = [...positions.entries()].find(([,visible]) => visible)?.[0];
    if (!activeId) return;
    navLinks.forEach(link => {
      if (link.hash === "#" + activeId) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
  document.querySelectorAll("main > section[id]").forEach(section => observer.observe(section));
}

// Native dialog provides focus containment, Escape dismissal, and focus restoration.
const commandDialog = document.querySelector(".command-dialog");
const commandSearch = document.querySelector("[data-command-search]");
const commandLinks = [...commandDialog.querySelectorAll(".command-results a")];
let commandOpener = null;
let commandDestination = null;
const filterCommands = () => {
  const query = commandSearch.value.trim().toLowerCase();
  commandLinks.forEach(link => { link.hidden = !link.textContent.toLowerCase().includes(query); });
  document.querySelector(".command-empty").hidden = commandLinks.some(link => !link.hidden);
};
const openCommands = () => {
  if (commandDialog.open) return;
  commandOpener = document.activeElement;
  closeMenu();
  commandSearch.value = "";
  filterCommands();
  commandDialog.showModal();
  commandSearch.focus();
};
const closeCommands = () => commandDialog.close();
document.querySelector("[data-open-command]").addEventListener("click", openCommands);
document.querySelector("[data-close-command]").addEventListener("click", closeCommands);
commandSearch.addEventListener("input", filterCommands);
commandSearch.addEventListener("keydown", event => {
  const visible = commandLinks.filter(link => !link.hidden);
  if (event.key === "ArrowDown" && visible.length) { event.preventDefault(); visible[0].focus(); }
  if (event.key === "Enter" && visible.length) { event.preventDefault(); visible[0].click(); }
});
commandDialog.addEventListener("click", event => {
  if (event.target !== commandDialog) return;
  const rect = commandDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeCommands();
});
commandDialog.addEventListener("close", () => {
  if (commandDestination) {
    const target = commandDestination;
    commandDestination = null;
    target.tabIndex = -1;
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior: motionAllowed() ? "smooth" : "instant", block:"start"});
  } else {
    commandOpener?.focus({preventScroll:true});
  }
});
commandLinks.forEach(link => link.addEventListener("click", event => {
  event.preventDefault();
  commandDestination = document.querySelector(link.hash);
  history.replaceState(null, "", link.hash);
  // Projects may be filtered; navigation to Work should restore the complete selection.
  if (link.hash === "#work") projectButtons[0].click();
  closeCommands();
}));
document.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandDialog.open ? closeCommands() : openCommands();
  }
  if (event.key === "Escape" && header.classList.contains("menu-open")) closeMenu(true);
});

document.querySelector("[data-copy-email]").addEventListener("click", async () => {
  const status = document.querySelector("[data-copy-status]");
  try {
    await navigator.clipboard.writeText("ahmadramihakim1122@gmail.com");
    status.textContent = "Email copied.";
  } catch {
    status.textContent = "Copy unavailable. Select the address above, or tap it to email me.";
  }
});
