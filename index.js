const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const themeIcon = document.querySelector("[data-theme-icon]");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

const updateThemeControls = () => {
  const theme = root.dataset.theme === "light" ? "light" : "dark";
  themeLabel.textContent = theme === "light" ? "Light" : "Dark";
  themeIcon.dataset.icon = theme === "light" ? "sun" : "moon";
  themeToggle.setAttribute("aria-pressed", String(theme === "light"));
  themeToggle.setAttribute("aria-label", `${theme === "light" ? "Light" : "Dark"} theme. Switch to ${theme === "light" ? "dark" : "light"} theme`);
  themeMeta.setAttribute("content", theme === "light" ? "#eff0f3" : "#101216");
};

const applyTheme = (theme, persist = true) => {
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem("ah-theme", theme);
    } catch {
      // Theme still applies when storage is unavailable.
    }
  }

  updateThemeControls();
  window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
};

updateThemeControls();

themeToggle.addEventListener("click", () => {
  applyTheme(root.dataset.theme === "light" ? "dark" : "light");
});

systemTheme.addEventListener("change", (event) => {
  try {
    if (localStorage.getItem("ah-theme")) return;
  } catch {
    // Follow the operating-system theme when storage is unavailable.
  }
  applyTheme(event.matches ? "light" : "dark", false);
});

document.querySelector("#year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const canvas = document.querySelector("#hero-canvas");

const loadThree = () => {
  import("./vendor/three.module.min.js?v=0.180.0")
    .then((THREE) => {
      const hero = canvas.closest(".hero");
      const controls = document.querySelector(".sphere-controls");
      const pauseButton = document.querySelector("[data-sphere-pause]");
      const modeButton = document.querySelector("[data-sphere-mode]");
      const speedInput = document.querySelector("[data-sphere-speed]");
      const desktop = window.matchMedia("(min-width: 761px)");
      const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      let paused = false;
      let speed = 1;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "high-performance",
      });
      const system = new THREE.Group();
      const orbitGroup = new THREE.Group();

      camera.position.set(0, 0, 7);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      scene.add(system);
      system.add(orbitGroup);

      const coreGeometry = new THREE.IcosahedronGeometry(1.58, 2);
      const coreMaterial = new THREE.MeshBasicMaterial({
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      system.add(core);

      const pointMaterial = new THREE.PointsMaterial({
        size: 0.032,
        transparent: true,
        opacity: 0.82,
      });
      const points = new THREE.Points(coreGeometry, pointMaterial);
      points.scale.setScalar(1.025);
      system.add(points);

      const ringMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      });

      [
        [2.05, 1.1, 0.2],
        [2.32, 0.48, 1.35],
        [2.58, 1.55, -0.55],
      ].forEach(([radius, rotationX, rotationY]) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.012, 6, 150),
          ringMaterial,
        );
        ring.rotation.x = rotationX;
        ring.rotation.y = rotationY;
        orbitGroup.add(ring);
      });

      const satelliteMaterial = new THREE.MeshBasicMaterial();
      const satelliteGeometry = new THREE.SphereGeometry(0.055, 10, 10);

      [
        [2.05, 0, 0],
        [-1.45, 1.58, 0.25],
        [0.5, -2.18, -0.25],
      ].forEach((position) => {
        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        satellite.position.set(...position);
        orbitGroup.add(satellite);
      });

      const dustGeometry = new THREE.BufferGeometry();
      const dustCount = window.innerWidth < 760 ? 180 : 420;
      const positions = new Float32Array(dustCount * 3);

      for (let index = 0; index < dustCount; index += 1) {
        const distance = 2.8 + Math.random() * 4.8;
        const angle = Math.random() * Math.PI * 2;
        positions[index * 3] = Math.cos(angle) * distance;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 6;
        positions[index * 3 + 2] = Math.sin(angle) * distance - 2;
      }

      dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const dustMaterial = new THREE.PointsMaterial({
        size: 0.014,
        transparent: true,
        opacity: 0.28,
      });
      const dust = new THREE.Points(dustGeometry, dustMaterial);
      scene.add(dust);

      const syncColors = () => {
        const styles = getComputedStyle(root);
        const accent = new THREE.Color(styles.getPropertyValue("--accent").trim());
        const text = new THREE.Color(styles.getPropertyValue("--text").trim());
        const faint = new THREE.Color(styles.getPropertyValue("--text-faint").trim());

        coreMaterial.color.copy(accent);
        pointMaterial.color.copy(text);
        ringMaterial.color.copy(accent);
        satelliteMaterial.color.copy(text);
        dustMaterial.color.copy(faint);
      };

      const pointer = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };

      const positionSystem = () => {
        if (window.innerWidth < 760) {
          system.position.set(1.55, 1.55, -0.4);
          system.scale.setScalar(0.72);
        } else {
          system.position.set(2.65, 0.25, -0.2);
          system.scale.setScalar(1);
        }
      };

      const resize = () => {
        const width = hero.clientWidth;
        const height = hero.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        positionSystem();
        draw();
      };

      const onPointerMove = (event) => {
        if (reduceMotion) return;
        target.x = (event.clientX / window.innerWidth - 0.5) * 0.48;
        target.y = (event.clientY / window.innerHeight - 0.5) * 0.34;
      };

      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("themechange", syncColors);

      let frame = 0;
      let lastTime = null;
      let animationFrame = null;
      let heroVisible = hero.getBoundingClientRect().bottom > 0;

      const draw = () => {
        pointer.x += (target.x - pointer.x) * 0.04;
        pointer.y += (target.y - pointer.y) * 0.04;
        system.rotation.y = pointer.x + frame * 0.001;
        system.rotation.x = -pointer.y + 0.12;
        core.rotation.z = frame * -0.00045;
        orbitGroup.rotation.z = frame * 0.00042;
        orbitGroup.rotation.y = frame * -0.00016;
        dust.rotation.y = frame * -0.00006;
        renderer.render(scene, camera);
      };

      const canAnimate = () => !paused && !motionPreference.matches && desktop.matches && heroVisible && !document.hidden;

      const render = (now) => {
        animationFrame = null;
        const delta = lastTime === null ? 0 : Math.min(now - lastTime, 50);
        lastTime = now;
        frame += delta / (1000 / 60) * speed;
        draw();

        if (canAnimate()) {
          animationFrame = requestAnimationFrame(render);
        }
      };

      const startRendering = () => {
        if (!canAnimate()) {
          draw();
          return;
        }

        if (animationFrame === null) {
          lastTime = null;
          animationFrame = requestAnimationFrame(render);
        }
      };

      const stopRendering = () => {
        if (animationFrame === null) return;
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
        lastTime = null;
      };

      const heroObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) startRendering();
        else stopRendering();
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopRendering();
        else startRendering();
      });

      pauseButton.addEventListener("click", () => {
        paused = !paused;
        pauseButton.setAttribute("aria-pressed", String(paused));
        pauseButton.setAttribute("aria-label", paused ? "Resume sphere rotation" : "Pause sphere rotation");
        pauseButton.querySelector(".icon").dataset.icon = paused ? "player-play" : "player-pause";
        if (paused) stopRendering();
        else startRendering();
      });
      modeButton.addEventListener("click", () => {
        const nodesOnly = modeButton.getAttribute("aria-pressed") !== "true";
        modeButton.setAttribute("aria-pressed", String(nodesOnly));
        modeButton.textContent = nodesOnly ? "Particles" : "Wireframe";
        core.visible = !nodesOnly;
        pointMaterial.size = nodesOnly ? 0.055 : 0.032;
        draw();
      });
      speedInput.addEventListener("input", () => { speed = Number(speedInput.value); });
      const syncMotion = () => {
        stopRendering();
        controls.hidden = !desktop.matches || motionPreference.matches;
        startRendering();
      };
      desktop.addEventListener("change", syncMotion);
      motionPreference.addEventListener("change", syncMotion);
      window.addEventListener("themechange", () => draw());

      syncColors();
      resize();
      controls.hidden = !desktop.matches || motionPreference.matches;
      heroObserver.observe(hero);
      draw();
      startRendering();
    })
    .catch(() => {
      canvas.hidden = true;
    });
};

if (canvas) {
  const begin = () => {
    if (window.innerWidth < 760 || reduceMotion) {
      canvas.hidden = true;
      return;
    }

    window.setTimeout(loadThree, 1100);
  };

  if (document.readyState === "complete") begin();
  else window.addEventListener("load", begin, { once: true });
}
