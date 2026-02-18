/* ═══════════════════════════════════════════════════════════
   UNVRS LABS — 3D Service Showcase (Three.js)
   Frames 170–529: 6 services × 60 frames each
   Split-screen editorial layout with alternating sides
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Service Definitions ───────────────────────────────────
  const SERVICES = [
    {
      start: 170, end: 229,
      title: 'AI INTEGRATION',
      desc: 'Seamlessly integrate cutting-edge AI solutions into your existing infrastructure for enhanced automation and insights.',
      color: '#00d4ff',
      tags: ['Neural Networks', 'Machine Learning', 'NLP', 'Computer Vision'],
      side: 'left',   // text on left, model on right
      create: createNeuralNetwork
    },
    {
      start: 230, end: 289,
      title: 'CUSTOM SOFTWARE',
      desc: 'Tailored enterprise applications built from the ground up to match your unique business requirements.',
      color: '#a855f7',
      tags: ['Enterprise', 'Scalable', 'Microservices', 'API-First'],
      side: 'right',  // text on right, model on left
      create: createCubeArchitecture
    },
    {
      start: 290, end: 349,
      title: 'MOBILE APPLICATIONS',
      desc: 'Native and cross-platform mobile solutions that deliver exceptional user experiences.',
      color: '#10b981',
      tags: ['iOS', 'Android', 'Cross-Platform', 'React Native'],
      side: 'left',
      create: createSmartphone
    },
    {
      start: 350, end: 409,
      title: 'CLOUD ARCHITECTURE',
      desc: 'Design and implement scalable cloud infrastructure that grows with your business needs.',
      color: '#f59e0b',
      tags: ['AWS', 'Azure', 'GCP', 'Kubernetes'],
      side: 'right',
      create: createCloud
    },
    {
      start: 410, end: 469,
      title: 'CONSULTING & STRATEGY',
      desc: 'Expert guidance on digital transformation and technology roadmap planning.',
      color: '#ec4899',
      tags: ['Digital Transform', 'Roadmap', 'Analysis', 'Innovation'],
      side: 'left',
      create: createDiamond
    },
    {
      start: 470, end: 529,
      title: 'DEVOPS & AUTOMATION',
      desc: 'Streamline your development pipeline with modern DevOps practices and automation.',
      color: '#3b82f6',
      tags: ['CI/CD', 'Docker', 'Terraform', 'Monitoring'],
      side: 'right',
      create: createGears
    }
  ];

  const SVC_GLOBAL_START = 170;
  const SVC_GLOBAL_END = 529;
  const SVC_FRAMES_PER = 60;
  const EDGE_PAD = 'clamp(50px, 6vw, 100px)';

  // ─── DOM Elements ──────────────────────────────────────────
  const container = document.getElementById('services-3d');
  const canvasEl = document.getElementById('svc3dCanvas');
  const hudEl = document.getElementById('svc3dHud');
  const titleEl = document.getElementById('svc3dTitle');
  const descEl = document.getElementById('svc3dDesc');
  const labelEl = document.getElementById('svc3dLabel');
  const counterEl = document.getElementById('svc3dCounter');
  const progBar = document.getElementById('svc3dProgress');
  const numberEl = document.getElementById('svc3dNumber');
  const accentEl = document.getElementById('svc3dAccent');
  const tagsEl = document.getElementById('svc3dTags');
  const moodEl = document.getElementById('svc3dMood');

  if (!container || !canvasEl) { console.warn('Services 3D elements not found'); return; }

  // ─── Three.js Setup ────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.06);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  renderer.outputEncoding = THREE.sRGBEncoding;

  // ─── Cinematic Lighting ────────────────────────────────────
  const ambient = new THREE.AmbientLight(0x404060, 0.8);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(4, 6, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x4488ff, 0.9);
  fillLight.position.set(-4, 2, -3);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xff4488, 0.6, 30);
  rimLight.position.set(0, -4, 4);
  scene.add(rimLight);

  // Accent light that changes color per service
  const accentLight = new THREE.PointLight(0x00d4ff, 1.2, 18);
  accentLight.position.set(2, 2, 3);
  scene.add(accentLight);

  // Secondary accent (opposite side)
  const accentLight2 = new THREE.PointLight(0x00d4ff, 0.5, 12);
  accentLight2.position.set(-3, -1, 2);
  scene.add(accentLight2);

  // ─── Particle System (ambient dust) ────────────────────────
  const particleCount = 160;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    pPositions[i] = (Math.random() - 0.5) * 18;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.018,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ─── Create All Service Models ─────────────────────────────
  const serviceGroups = SERVICES.map(svc => {
    const group = svc.create(svc.color);
    group.visible = false;
    scene.add(group);
    return group;
  });

  // ─── Resize Handler ────────────────────────────────────────
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize);

  // ─── Position helpers ──────────────────────────────────────
  // Model offset in world-space for split-screen layout
  function getModelOffset(side) {
    // If text is on left, model goes right (+X) and vice versa
    return side === 'left' ? 1.4 : -1.4;
  }

  function positionHud(side) {
    hudEl.style.left = '';
    hudEl.style.right = '';
    numberEl.style.left = '';
    numberEl.style.right = '';

    if (side === 'left') {
      hudEl.style.left = EDGE_PAD;
      numberEl.style.left = EDGE_PAD;
    } else {
      hudEl.style.right = EDGE_PAD;
      numberEl.style.right = EDGE_PAD;
    }
  }

  // ─── Build tag pills ──────────────────────────────────────
  function buildTags(tags) {
    tagsEl.innerHTML = tags.map(t =>
      `<span class="svc3d-tag">${t}</span>`
    ).join('');
  }

  // ─── Set mood overlay gradient ─────────────────────────────
  function setMood(color, side) {
    const x = side === 'left' ? '75%' : '25%';
    moodEl.style.background = `radial-gradient(ellipse at ${x} 50%, ${color}12 0%, transparent 60%)`;
  }

  // ─── Main Update (called from animate loop) ────────────────
  let lastServiceIdx = -1;

  window.updateServices3D = function (frameIdx) {
    if (frameIdx < SVC_GLOBAL_START || frameIdx > SVC_GLOBAL_END) {
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      if (lastServiceIdx >= 0) {
        serviceGroups.forEach(g => g.visible = false);
        lastServiceIdx = -1;
      }
      return;
    }

    container.style.opacity = '1';
    container.style.pointerEvents = 'none';

    // Determine current service
    const svcIndex = Math.min(Math.floor((frameIdx - SVC_GLOBAL_START) / SVC_FRAMES_PER), SERVICES.length - 1);
    const svc = SERVICES[svcIndex];
    const localFrame = frameIdx - svc.start;
    const localP = localFrame / (SVC_FRAMES_PER - 1); // 0..1

    // Show only active model + update layout on service change
    if (svcIndex !== lastServiceIdx) {
      serviceGroups.forEach((g, i) => g.visible = (i === svcIndex));
      lastServiceIdx = svcIndex;

      // Update accent light colors
      const c = new THREE.Color(svc.color);
      accentLight.color.copy(c);
      accentLight2.color.copy(c);

      // Position text on correct side
      positionHud(svc.side);

      // Update accent line color
      accentEl.style.background = svc.color;
      accentEl.style.boxShadow = `0 0 18px ${svc.color}, 0 0 40px ${svc.color}`;

      // Build tags
      buildTags(svc.tags);

      // Set mood gradient (model side)
      setMood(svc.color, svc.side);

      // CSS custom property for title shadow
      hudEl.style.setProperty('--svc-color', svc.color);
    }

    const model = serviceGroups[svcIndex];
    const time = performance.now() / 1000;
    const modelXOffset = getModelOffset(svc.side);

    // ── Fade in/out ──
    let alpha = 1;
    if (localP < 0.10) alpha = localP / 0.10;
    if (localP > 0.88) alpha = (1 - localP) / 0.12;
    alpha = Math.max(0, Math.min(1, alpha));

    // ── 3D Object Animation ──
    // Offset to one side
    model.position.x = modelXOffset + Math.cos(time * 0.3) * 0.06;

    // Smooth continuous rotation
    model.rotation.y = time * 0.4;
    model.rotation.x = Math.sin(time * 0.25) * 0.12;

    // Floating sinusoidal motion
    model.position.y = Math.sin(time * 0.6) * 0.2;

    // Camera subtle movement
    camera.position.z = 5.0 - localP * 0.5;
    camera.position.y = Math.sin(time * 0.2) * 0.04;
    camera.position.x = Math.cos(time * 0.15) * 0.03;

    // Scale entrance/exit
    const scaleEase = easeOutQuart(Math.min(localP / 0.2, 1));
    const scaleExit = localP > 0.85 ? easeInQuad((1 - localP) / 0.15) : 1;
    model.scale.setScalar(scaleEase * scaleExit * 1.15);

    // Particle animation
    particles.rotation.y = time * 0.02;
    particles.rotation.x = time * 0.01;
    pMat.opacity = alpha * 0.3;

    // Mood overlay opacity
    moodEl.style.opacity = String(alpha * 0.7);

    // ── Text ──
    titleEl.textContent = svc.title;
    descEl.textContent = svc.desc;
    titleEl.style.opacity = String(alpha);
    descEl.style.opacity = String(alpha * 0.85);
    labelEl.style.opacity = String(alpha * 0.45);
    accentEl.style.opacity = String(alpha);
    tagsEl.style.opacity = String(alpha * 0.7);

    // Number watermark
    const numStr = String(svcIndex + 1).padStart(2, '0');
    numberEl.textContent = numStr;
    numberEl.style.opacity = String(alpha * 0.6);

    // Counter
    counterEl.textContent = `${numStr} / 06`;
    counterEl.style.opacity = String(alpha * 0.35);

    // Progress bar
    progBar.style.width = (localP * 100) + '%';
    progBar.style.background = svc.color;

    // ── Render ──
    renderer.render(scene, camera);
  };

  // ─── Easing ────────────────────────────────────────────────
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  function easeInQuad(t) { return t * t; }

  // ═══════════════════════════════════════════════════════════
  //  3D MODEL FACTORIES — Higher opacity, stronger materials
  // ═══════════════════════════════════════════════════════════

  // Helper: premium metallic material
  function premiumMat(baseColor, accent, opts) {
    return new THREE.MeshPhysicalMaterial(Object.assign({
      color: baseColor,
      metalness: 0.85,
      roughness: 0.2,
      emissive: accent,
      emissiveIntensity: 0.4,
      transparent: false
    }, opts || {}));
  }

  // 1️⃣ AI Integration — Neural Network Mesh
  function createNeuralNetwork(accentColor) {
    const group = new THREE.Group();
    const col = new THREE.Color(accentColor);

    // Core icosahedron wireframe
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
    const wireGeo = new THREE.WireframeGeometry(icoGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: col,
      transparent: true,
      opacity: 0.7
    });
    group.add(new THREE.LineSegments(wireGeo, wireMat));

    // Glowing nodes at vertices
    const pos = icoGeo.attributes.position;
    const nodeGeo = new THREE.SphereGeometry(0.055, 14, 14);
    const nodeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: col,
      emissiveIntensity: 3.0,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.98
    });

    const seen = new Set();
    for (let i = 0; i < pos.count; i++) {
      const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      group.add(node);
    }

    // Dark metallic core
    const coreMat = premiumMat(0x0a1a33, col, { emissiveIntensity: 1.2, metalness: 0.95 });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), coreMat));

    // Outer rings
    const ringMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.012, 8, 64), ringMat);
    group.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.008, 8, 64), ringMat.clone());
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.z = Math.PI / 5;
    group.add(ring2);

    return group;
  }

  // 2️⃣ Custom Software — Layered Cube Architecture
  function createCubeArchitecture(accentColor) {
    const group = new THREE.Group();
    const col = new THREE.Color(accentColor);

    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2e,
      metalness: 0.75,
      roughness: 0.25,
      emissive: col,
      emissiveIntensity: 0.15,
      transparent: true,
      opacity: 0.92
    });

    const edgeMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.85 });

    const cubes = [
      { size: [1.1, 0.38, 1.1], pos: [0, -0.6, 0] },
      { size: [0.8, 0.38, 0.8], pos: [0.1, -0.12, 0.1] },
      { size: [0.58, 0.38, 0.58], pos: [-0.05, 0.36, -0.05] },
      { size: [0.38, 0.38, 0.38], pos: [0.15, 0.84, 0.15] }
    ];

    cubes.forEach(c => {
      const geo = new THREE.BoxGeometry(...c.size);
      const mesh = new THREE.Mesh(geo, cubeMat.clone());
      mesh.position.set(...c.pos);
      group.add(mesh);

      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, edgeMat);
      line.position.copy(mesh.position);
      group.add(line);
    });

    // Floating data particles
    const dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: col });
    for (let i = 0; i < 20; i++) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(
        (Math.random() - 0.5) * 2.2,
        (Math.random() - 0.5) * 2.8,
        (Math.random() - 0.5) * 2.2
      );
      dot.userData.speed = 0.3 + Math.random() * 0.5;
      dot.userData.offset = Math.random() * Math.PI * 2;
      group.add(dot);
    }

    return group;
  }

  // 3️⃣ Mobile Applications — Floating Smartphone
  function createSmartphone(accentColor) {
    const group = new THREE.Group();
    const col = new THREE.Color(accentColor);

    // Phone body
    const bodyGeo = new THREE.BoxGeometry(0.75, 1.4, 0.07);
    const bodyMat = premiumMat(0x1a1a2e, 0x000000, {
      metalness: 0.92, roughness: 0.12,
      clearcoat: 1.0, clearcoatRoughness: 0.08
    });
    const phone = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(phone);

    // Screen (glowing glass)
    const screenGeo = new THREE.PlaneGeometry(0.62, 1.2);
    const screenMat = new THREE.MeshPhysicalMaterial({
      color: 0x080818,
      metalness: 0.1,
      roughness: 0.03,
      emissive: col,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.95
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.036;
    group.add(screen);

    // UI panels floating outward
    const panelPositions = [
      { pos: [-0.65, 0.42, 0.32], size: [0.38, 0.22, 0.018], rot: [0, -0.3, 0] },
      { pos: [0.7, 0.12, 0.28], size: [0.32, 0.28, 0.018], rot: [0, 0.25, 0] },
      { pos: [-0.55, -0.38, 0.38], size: [0.28, 0.17, 0.018], rot: [0, -0.2, 0.1] },
      { pos: [0.6, -0.42, 0.22], size: [0.3, 0.2, 0.018], rot: [0, 0.35, -0.05] }
    ];

    const panelMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a2a3a,
      metalness: 0.3,
      roughness: 0.25,
      emissive: col,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.8
    });

    panelPositions.forEach(p => {
      const geo = new THREE.BoxGeometry(...p.size);
      const mesh = new THREE.Mesh(geo, panelMat.clone());
      mesh.position.set(...p.pos);
      mesh.rotation.set(...p.rot);
      group.add(mesh);

      const edg = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edg, new THREE.LineBasicMaterial({
        color: col, transparent: true, opacity: 0.55
      }));
      line.position.copy(mesh.position);
      line.rotation.copy(mesh.rotation);
      group.add(line);
    });

    return group;
  }

  // 4️⃣ Cloud Architecture — Volumetric Cloud
  function createCloud(accentColor) {
    const group = new THREE.Group();
    const col = new THREE.Color(accentColor);

    const cloudMat = new THREE.MeshPhysicalMaterial({
      color: 0xddeeff,
      metalness: 0.08,
      roughness: 0.5,
      transparent: true,
      opacity: 0.5,
      emissive: col,
      emissiveIntensity: 0.2
    });

    const spheres = [
      { r: 0.65, pos: [0, 0, 0] },
      { r: 0.55, pos: [-0.55, 0.1, 0.1] },
      { r: 0.48, pos: [0.58, 0.05, -0.1] },
      { r: 0.38, pos: [-0.32, 0.38, 0.15] },
      { r: 0.42, pos: [0.32, 0.32, 0.05] },
      { r: 0.32, pos: [0.75, 0.28, 0.1] },
      { r: 0.38, pos: [-0.75, -0.05, 0] }
    ];

    spheres.forEach(s => {
      const geo = new THREE.SphereGeometry(s.r, 28, 28);
      const mesh = new THREE.Mesh(geo, cloudMat.clone());
      mesh.position.set(...s.pos);
      group.add(mesh);
    });

    // Internal network grid
    const innerGeo = new THREE.IcosahedronGeometry(0.75, 1);
    const innerWire = new THREE.WireframeGeometry(innerGeo);
    const innerMat = new THREE.LineBasicMaterial({
      color: col, transparent: true, opacity: 0.4
    });
    group.add(new THREE.LineSegments(innerWire, innerMat));

    // Core nodes
    const nodeGeo = new THREE.SphereGeometry(0.035, 10, 10);
    const nodeMat = new THREE.MeshBasicMaterial({ color: col });
    const iPos = innerGeo.attributes.position;
    const seen = new Set();
    for (let i = 0; i < iPos.count; i++) {
      const key = `${iPos.getX(i).toFixed(2)},${iPos.getY(i).toFixed(2)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const n = new THREE.Mesh(nodeGeo, nodeMat);
      n.position.set(iPos.getX(i), iPos.getY(i), iPos.getZ(i));
      group.add(n);
    }

    return group;
  }

  // 5️⃣ Consulting & Strategy — Crystal Diamond
  function createDiamond(accentColor) {
    const group = new THREE.Group();
    const col = new THREE.Color(accentColor);

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2a3f,
      metalness: 0.25,
      roughness: 0.04,
      transparent: true,
      opacity: 0.75,
      emissive: col,
      emissiveIntensity: 0.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0
    });

    // Top cone
    const topGeo = new THREE.ConeGeometry(0.95, 1.15, 6);
    const top = new THREE.Mesh(topGeo, crystalMat);
    top.position.y = 0.3;
    group.add(top);

    // Bottom inverted cone
    const botGeo = new THREE.ConeGeometry(0.95, 0.75, 6);
    const bot = new THREE.Mesh(botGeo, crystalMat.clone());
    bot.rotation.x = Math.PI;
    bot.position.y = -0.05;
    group.add(bot);

    // Glowing edges
    const edgeMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.65 });
    [topGeo, botGeo].forEach((geo, i) => {
      const edg = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edg, edgeMat);
      line.position.y = i === 0 ? 0.3 : -0.05;
      if (i === 1) line.rotation.x = Math.PI;
      group.add(line);
    });

    // Inner glow sphere
    const glowMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.22 });
    group.add(new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 20), glowMat));

    // Orbiting ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.01, 8, 64),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.35 })
    );
    ring.rotation.x = Math.PI * 0.35;
    group.add(ring);

    // Second ring
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.006, 8, 64),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.15 })
    );
    ring2.rotation.x = Math.PI * 0.6;
    ring2.rotation.z = Math.PI * 0.2;
    group.add(ring2);

    return group;
  }

  // 6️⃣ DevOps & Automation — Interlocking Gears
  function createGears(accentColor) {
    const group = new THREE.Group();
    const col = new THREE.Color(accentColor);

    function makeGear(innerR, outerR, teeth, thick) {
      const gearGroup = new THREE.Group();

      const bodyGeo = new THREE.CylinderGeometry(innerR, innerR, thick, 32);
      const bodyMat = premiumMat(0x2a2a3e, col, {
        emissiveIntensity: 0.12, metalness: 0.88, roughness: 0.22
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.rotation.x = Math.PI / 2;
      gearGroup.add(body);

      // Teeth
      const toothMat = premiumMat(0x3a3a4e, col, {
        emissiveIntensity: 0.08, metalness: 0.82, roughness: 0.28
      });
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const toothGeo = new THREE.BoxGeometry(
          (outerR - innerR) * 1.2, thick * 0.9, innerR * 0.18
        );
        const tooth = new THREE.Mesh(toothGeo, toothMat);
        const mid = (innerR + outerR) / 2;
        tooth.position.set(Math.cos(angle) * mid, 0, Math.sin(angle) * mid);
        tooth.rotation.y = -angle;
        gearGroup.add(tooth);
      }

      // Center hole
      const holeGeo = new THREE.CylinderGeometry(innerR * 0.3, innerR * 0.3, thick * 1.1, 16);
      const holeMat = premiumMat(0x111122, 0x000000, { metalness: 0.95, roughness: 0.1, emissiveIntensity: 0 });
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.rotation.x = Math.PI / 2;
      gearGroup.add(hole);

      // Edge ring highlight
      const ringGeo = new THREE.TorusGeometry(innerR, 0.018, 8, 32);
      gearGroup.add(new THREE.Mesh(ringGeo,
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.45 })
      ));

      return gearGroup;
    }

    const gear1 = makeGear(0.65, 0.85, 12, 0.16);
    gear1.position.set(-0.58, 0, 0);
    gear1.userData.speed = 0.3;
    gear1.userData.dir = 1;
    group.add(gear1);

    const gear2 = makeGear(0.4, 0.55, 8, 0.16);
    gear2.position.set(0.62, 0.15, 0.08);
    gear2.userData.speed = 0.3 * (0.65 / 0.4);
    gear2.userData.dir = -1;
    group.add(gear2);

    const gear3 = makeGear(0.32, 0.44, 7, 0.13);
    gear3.position.set(-0.15, 0.78, -0.1);
    gear3.rotation.z = 0.3;
    gear3.userData.speed = 0.3 * (0.65 / 0.32);
    gear3.userData.dir = 1;
    group.add(gear3);

    group.userData.isGears = true;
    group.userData.gears = [gear1, gear2, gear3];

    return group;
  }

  // ─── Animation Override for Special Models ─────────────────
  const origUpdate = window.updateServices3D;
  window.updateServices3D = function (frameIdx) {
    origUpdate(frameIdx);

    const time = performance.now() / 1000;

    // Animate gears independently
    serviceGroups.forEach(g => {
      if (!g.visible || !g.userData.isGears) return;
      g.rotation.y = 0;
      g.rotation.x = 0;
      g.userData.gears.forEach(gear => {
        gear.rotation.y = time * gear.userData.speed * gear.userData.dir;
      });
      g.rotation.x = Math.sin(time * 0.2) * 0.15;
      g.rotation.z = Math.cos(time * 0.15) * 0.08;
      // Keep X offset from original update
      const svcIndex = SERVICES.findIndex(s => s.create === createGears);
      if (svcIndex >= 0) {
        g.position.x = getModelOffset(SERVICES[svcIndex].side) + Math.cos(time * 0.3) * 0.06;
      }
    });

    // Animate cube architecture floating dots
    serviceGroups.forEach(g => {
      if (!g.visible) return;
      g.children.forEach(child => {
        if (child.userData.speed) {
          child.position.y += Math.sin(time * child.userData.speed + child.userData.offset) * 0.002;
        }
      });
    });
  };

})();
