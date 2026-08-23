const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelector("#year").textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12%", threshold: 0.12 },
  );

  revealElements.forEach((element) => observer.observe(element));
}

const canvas = document.querySelector("#hero-canvas");

const loadThree = () => {
  import("./vendor/three.module.min.js?v=0.180.0")
    .then((THREE) => {
      const hero = canvas.closest(".hero");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      const group = new THREE.Group();

      camera.position.set(0, 0, 6.2);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
      renderer.setClearColor(0x000000, 0);
      scene.add(group);

      const coreGeometry = new THREE.IcosahedronGeometry(1.64, 3);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xc7ff55,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      group.add(core);

      const pointsMaterial = new THREE.PointsMaterial({
        color: 0xecece6,
        size: 0.025,
        transparent: true,
        opacity: 0.66,
      });
      const points = new THREE.Points(coreGeometry, pointsMaterial);
      points.scale.setScalar(1.018);
      group.add(points);

      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x8580bc,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.12, 0.012, 8, 180), ringMaterial);
      ring.rotation.x = 1.12;
      ring.rotation.y = 0.35;
      group.add(ring);

      const dustGeometry = new THREE.BufferGeometry();
      const dustCount = window.innerWidth < 720 ? 260 : 620;
      const positions = new Float32Array(dustCount * 3);

      for (let index = 0; index < dustCount; index += 1) {
        const distance = 2.7 + Math.random() * 3.8;
        const angle = Math.random() * Math.PI * 2;
        positions[index * 3] = Math.cos(angle) * distance;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 5.4;
        positions[index * 3 + 2] = Math.sin(angle) * distance - 1.8;
      }

      dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const dust = new THREE.Points(
        dustGeometry,
        new THREE.PointsMaterial({ color: 0xc7ff55, size: 0.014, transparent: true, opacity: 0.28 }),
      );
      scene.add(dust);

      const pointer = { x: 0, y: 0 };
      const target = { x: 0, y: 0 };

      const positionObject = () => {
        group.position.x = window.innerWidth < 720 ? 1.55 : 2.7;
        group.position.y = window.innerWidth < 720 ? 1.15 : 0.15;
        group.scale.setScalar(window.innerWidth < 720 ? 0.66 : 1);
      };

      const resize = () => {
        const width = hero.clientWidth;
        const height = hero.clientHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        positionObject();
      };

      const onPointerMove = (event) => {
        if (reduceMotion) return;
        target.x = (event.clientX / window.innerWidth - 0.5) * 0.55;
        target.y = (event.clientY / window.innerHeight - 0.5) * 0.4;
      };

      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      resize();

      let frame = 0;
      let animationFrame = null;
      let heroVisible = hero.getBoundingClientRect().bottom > 0;

      const draw = () => {
        pointer.x += (target.x - pointer.x) * 0.045;
        pointer.y += (target.y - pointer.y) * 0.045;
        group.rotation.y = pointer.x + frame * 0.0012;
        group.rotation.x = -pointer.y + 0.18;
        ring.rotation.z = frame * 0.00055;
        dust.rotation.y = frame * -0.00008;
        renderer.render(scene, camera);
      };

      const render = () => {
        animationFrame = null;
        draw();

        if (!reduceMotion && heroVisible && !document.hidden) {
          frame += 1;
          animationFrame = requestAnimationFrame(render);
        }
      };

      const startRendering = () => {
        if (reduceMotion) {
          draw();
          return;
        }

        if (heroVisible && !document.hidden && animationFrame === null) {
          animationFrame = requestAnimationFrame(render);
        }
      };

      const stopRendering = () => {
        if (animationFrame === null) return;
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
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
    window.setTimeout(loadThree, 1200);
  };

  if (document.readyState === "complete") begin();
  else window.addEventListener("load", begin, { once: true });
}
