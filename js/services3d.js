/* ═══════════════════════════════════════════════════════════
   UNVRS LABS — 3D Service Showcase v3
   Full-Bleed Cinematic Design
   Frames 170–529 · 6 services × 60 frames
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const SERVICES = [
    {
      start: 170, end: 229, title: 'AI\nINTEGRATION',
      desc: 'Seamlessly integrate cutting-edge AI solutions into your existing infrastructure for enhanced automation and insights.',
      color: '#00d4ff', create: createAISphere
    },
    {
      start: 230, end: 289, title: 'CUSTOM\nSOFTWARE',
      desc: 'Tailored enterprise applications built from the ground up to match your unique business requirements.',
      color: '#a855f7', create: createCodeConstruct
    },
    {
      start: 290, end: 349, title: 'MOBILE\nAPPLICATIONS',
      desc: 'Native and cross-platform mobile solutions that deliver exceptional user experiences.',
      color: '#10b981', create: createMobileHolo
    },
    {
      start: 350, end: 409, title: 'CLOUD\nARCHITECTURE',
      desc: 'Design and implement scalable cloud infrastructure that grows with your business needs.',
      color: '#f59e0b', create: createCloudNetwork
    },
    {
      start: 410, end: 469, title: 'CONSULTING\n& STRATEGY',
      desc: 'Expert guidance on digital transformation and technology roadmap planning.',
      color: '#ec4899', create: createGyroscope
    },
    {
      start: 470, end: 529, title: 'DEVOPS\n& AUTOMATION',
      desc: 'Streamline your development pipeline with modern DevOps practices and automation.',
      color: '#3b82f6', create: createInfinityLoop
    }
  ];

  const START = 170, END = 529, FPR = 60;
  const CIRC = 2 * Math.PI * 20; // 125.66 — SVG circle circumference

  // ─── DOM ───────────────────────────────────────────────────
  const container = document.getElementById('services-3d');
  const canvas = document.getElementById('svc3dCanvas');
  const titleEl = document.getElementById('svc3dTitle');
  const descEl = document.getElementById('svc3dDesc');
  const numEl = document.getElementById('svc3dNum');
  const lineEl = document.getElementById('svc3dLine');
  const topEl = document.getElementById('svc3dTop');
  const navEl = document.getElementById('svc3dNav');
  const ringEl = document.getElementById('svc3dRing');
  const dots = navEl ? navEl.querySelectorAll('.svc3d-dot') : [];

  if (!container || !canvas) return;

  // ─── Three.js ──────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020210, 0.04);

  const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  const R = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  R.setSize(innerWidth, innerHeight);
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  R.toneMapping = THREE.ACESFilmicToneMapping;
  R.toneMappingExposure = 1.6;
  R.outputEncoding = THREE.sRGBEncoding;

  // ─── Lights ────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x303050, 0.7));

  const key = new THREE.DirectionalLight(0xffffff, 2.5);
  key.position.set(5, 7, 6); scene.add(key);

  const fill = new THREE.DirectionalLight(0x4466cc, 1.0);
  fill.position.set(-5, 2, -4); scene.add(fill);

  const rim = new THREE.PointLight(0xff3377, 0.5, 25);
  rim.position.set(0, -5, 5); scene.add(rim);

  const acc1 = new THREE.PointLight(0x00d4ff, 1.4, 20);
  acc1.position.set(3, 3, 4); scene.add(acc1);

  const acc2 = new THREE.PointLight(0x00d4ff, 0.6, 14);
  acc2.position.set(-3, -1, 3); scene.add(acc2);

  // ─── Particles ─────────────────────────────────────────────
  const pN = 220;
  const pG = new THREE.BufferGeometry();
  const pP = new Float32Array(pN * 3);
  for (let i = 0; i < pN * 3; i++) pP[i] = (Math.random() - 0.5) * 22;
  pG.setAttribute('position', new THREE.BufferAttribute(pP, 3));
  const pM = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.02, transparent: true, opacity: 0.25, sizeAttenuation: true
  });
  const pts = new THREE.Points(pG, pM);
  scene.add(pts);

  // ─── Models ────────────────────────────────────────────────
  const groups = SERVICES.map(s => {
    const g = s.create(s.color);
    g.visible = false;
    scene.add(g);
    return g;
  });

  // ─── Resize ────────────────────────────────────────────────
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    R.setSize(innerWidth, innerHeight);
  });

  // ─── Easing ────────────────────────────────────────────────
  const eOQ = x => 1 - Math.pow(1 - x, 4);
  const eIQ = x => x * x;

  // ─── Main Update ───────────────────────────────────────────
  let prev = -1;

  window.updateServices3D = function (f) {
    if (f < START || f > END) {
      container.style.opacity = '0';
      if (prev >= 0) { groups.forEach(g => g.visible = false); prev = -1; }
      return;
    }

    container.style.opacity = '1';
    container.style.pointerEvents = 'none';

    const idx = Math.min(Math.floor((f - START) / FPR), 5);
    const svc = SERVICES[idx];
    const lp = (f - svc.start) / (FPR - 1); // 0..1

    // ── Service switch — trigger entrance animations ──
    if (idx !== prev) {
      groups.forEach((g, i) => g.visible = i === idx);
      prev = idx;

      const c = new THREE.Color(svc.color);
      acc1.color.copy(c);
      acc2.color.copy(c);

      // Nav dots
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      navEl.style.setProperty('--svc-accent', svc.color);

      // ── Animated title: per-character stagger with line breaks ──
      var charIdx = 0;
      titleEl.innerHTML = svc.title.split('\n').map(function (line) {
        return line.split('').map(function (ch) {
          var delay = charIdx * 30;
          charIdx++;
          if (ch === ' ') return '<span class="ch-space"></span>';
          return '<span class="ch" style="animation-delay:' + delay + 'ms">' + ch + '</span>';
        }).join('');
      }).join('<br>');

      // ── Animated description: slide up ──
      descEl.textContent = svc.desc;
      descEl.classList.remove('animate');
      void descEl.offsetWidth;
      descEl.style.animationDelay = (svc.title.length * 30 + 150) + 'ms';
      descEl.classList.add('animate');

      // ── Accent underline ──
      lineEl.classList.remove('visible');
      lineEl.style.background = svc.color;
      void lineEl.offsetWidth;
      lineEl.classList.add('visible');

      // ── Animated number ──
      numEl.textContent = String(idx + 1).padStart(2, '0');
      numEl.classList.remove('animate');
      void numEl.offsetWidth;
      numEl.classList.add('animate');

      // ── Top label entrance ──
      topEl.classList.remove('animate');
      void topEl.offsetWidth;
      topEl.classList.add('animate');

      // Ring stroke color
      if (ringEl) ringEl.setAttribute('stroke', svc.color);
    }

    const model = groups[idx];
    const t = performance.now() / 1000;

    // ── Fade ──
    let a = 1;
    if (lp < 0.08) a = lp / 0.08;
    if (lp > 0.90) a = (1 - lp) / 0.10;
    a = Math.max(0, Math.min(1, a));

    // ── 3D — centered, large ──
    model.position.x = Math.cos(t * 0.2) * 0.05;
    model.position.y = Math.sin(t * 0.45) * 0.15;
    model.rotation.y = t * 0.3;
    model.rotation.x = Math.sin(t * 0.18) * 0.1;

    const sIn = eOQ(Math.min(lp / 0.12, 1));
    const sOut = lp > 0.88 ? eIQ((1 - lp) / 0.12) : 1;
    model.scale.setScalar(sIn * sOut * 1.3);

    camera.position.z = 5.5 - lp * 0.4;
    camera.position.y = Math.sin(t * 0.15) * 0.03;
    camera.position.x = Math.cos(t * 0.12) * 0.03;

    pts.rotation.y = t * 0.012;
    pts.rotation.x = t * 0.006;
    pM.opacity = a * 0.22;

    // ── Fade control (opacity only — don't touch innerHTML) ──
    var btm = document.getElementById('svc3dBottom');
    if (btm) btm.style.opacity = String(a);
    topEl.style.opacity = String(Math.min(a, 0.25));
    numEl.style.opacity = String(Math.min(a, 0.45));

    // Circular progress
    if (ringEl) {
      const offset = CIRC * (1 - lp);
      ringEl.setAttribute('stroke-dashoffset', String(offset));
    }

    // ── Per-model animations ──
    animateModel(model, t, idx);

    R.render(scene, camera);
  };


  // ─── Per-Model Animation ───────────────────────────────────
  function animateModel(m, t, idx) {
    const type = m.userData.type;

    if (type === 'ai') {
      m.children.forEach(c => {
        if (c.userData.ringSpeed) c.rotation.z += c.userData.ringSpeed * 0.01;
        if (c.userData.orbit) {
          const o = c.userData.orbit;
          const a = o.theta + t * o.speed;
          c.position.set(Math.cos(a) * o.radius, Math.sin(a * 1.3) * o.tilt, Math.sin(a) * o.radius);
        }
      });
    }

    if (type === 'code' || type === 'mobile') {
      m.children.forEach(c => {
        if (c.userData.floatSpeed)
          c.position.y += Math.sin(t * c.userData.floatSpeed + c.userData.floatOffset) * 0.0012;
      });
    }

    if (type === 'cloud') {
      m.children.forEach(c => {
        if (c.userData.orbit) {
          const o = c.userData.orbit;
          const a = o.angle + t * o.speed;
          c.position.x = Math.cos(a) * o.r;
          c.position.z = Math.sin(a) * o.r;
        }
      });
    }

    if (type === 'gyro') {
      m.children.forEach(c => {
        if (c.userData.ringSpeed !== undefined) c.rotation.z += c.userData.ringSpeed * 0.008;
      });
    }

    if (type === 'infinity') {
      m.rotation.y = t * 0.2;
      m.rotation.x = Math.sin(t * 0.15) * 0.15;
      m.children.forEach(c => {
        if (c.userData.flowT !== undefined) {
          c.userData.flowT += c.userData.flowSpeed * 0.005;
          if (c.userData.flowT > 1) c.userData.flowT -= 1;
          const phi = c.userData.flowT * Math.PI * 4;
          const r = 0.8, tube = 0.08;
          c.position.set(
            (r + tube * Math.cos(phi)) * Math.cos(2 * phi),
            (r + tube * Math.cos(phi)) * Math.sin(2 * phi),
            tube * Math.sin(phi)
          );
        }
      });
    }
  }


  // ═══════════════════════════════════════════════════════════
  //  3D MODEL FACTORIES
  // ═══════════════════════════════════════════════════════════

  function glassMat(col, o) {
    return new THREE.MeshPhysicalMaterial(Object.assign({
      color: 0x111122, metalness: 0.1, roughness: 0.05,
      transparent: true, opacity: 0.35,
      emissive: new THREE.Color(col), emissiveIntensity: 0.5,
      clearcoat: 1.0, clearcoatRoughness: 0.05,
    }, o || {}));
  }

  function metalMat(col, o) {
    return new THREE.MeshPhysicalMaterial(Object.assign({
      color: 0x1a1a2e, metalness: 0.92, roughness: 0.15,
      emissive: new THREE.Color(col), emissiveIntensity: 0.3,
    }, o || {}));
  }

  function glowWire(col, op) {
    return new THREE.LineBasicMaterial({ color: new THREE.Color(col), transparent: true, opacity: op || 0.6 });
  }

  function glowDot(col, r) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(r || 0.04, 12, 12),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(col), transparent: true, opacity: 0.95 })
    );
  }


  // 1 — AI · Cosmic TorusKnot Brain
  function createAISphere(col) {
    const g = new THREE.Group();
    const c = new THREE.Color(col);

    const tkGeo = new THREE.TorusKnotGeometry(0.55, 0.18, 128, 24, 2, 3);
    g.add(new THREE.Mesh(tkGeo, glassMat(col, { opacity: 0.85, emissiveIntensity: 1.2 })));
    g.add(new THREE.LineSegments(new THREE.WireframeGeometry(tkGeo), glowWire(col, 0.45)));

    // Core
    g.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 32, 32),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.9 })
    ));

    // Orbit rings
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.1 + i * 0.2, 0.006, 8, 80),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.4 - i * 0.05 })
      );
      ring.rotation.x = Math.PI * (0.25 + i * 0.2);
      ring.rotation.z = i * 0.4;
      ring.userData.ringSpeed = 0.15 + i * 0.08;
      g.add(ring);
    }

    // Orbiting nodes
    for (let i = 0; i < 8; i++) {
      const node = glowDot(col, 0.035);
      node.userData.orbit = {
        theta: (i / 8) * Math.PI * 2,
        radius: 1.15 + Math.random() * 0.3,
        speed: 0.3 + Math.random() * 0.2,
        tilt: Math.random() * 0.5
      };
      g.add(node);
    }

    g.userData.type = 'ai';
    return g;
  }


  // 2 — Code · Hexagonal Prism + Floating Screens
  function createCodeConstruct(col) {
    const g = new THREE.Group();
    const c = new THREE.Color(col);

    const hexGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.9, 6);
    const hex = new THREE.Mesh(hexGeo, glassMat(col, { opacity: 0.8, emissiveIntensity: 0.9 }));
    hex.rotation.x = Math.PI / 2;
    g.add(hex);

    const hexLine = new THREE.LineSegments(new THREE.EdgesGeometry(hexGeo), glowWire(col, 1.0));
    hexLine.rotation.x = Math.PI / 2;
    g.add(hexLine);

    const screens = [
      { pos: [-0.9, 0.5, 0.4], rot: [0, -0.35, 0.05], size: [0.55, 0.35] },
      { pos: [0.95, 0.2, 0.3], rot: [0, 0.3, -0.03], size: [0.5, 0.4] },
      { pos: [-0.8, -0.4, 0.5], rot: [0.1, -0.2, 0.08], size: [0.45, 0.28] },
      { pos: [0.85, -0.5, 0.35], rot: [-0.05, 0.25, 0], size: [0.4, 0.3] },
    ];

    screens.forEach((s, i) => {
      const sGeo = new THREE.PlaneGeometry(s.size[0], s.size[1]);
      const scr = new THREE.Mesh(sGeo, new THREE.MeshPhysicalMaterial({
        color: 0x0a0a1e, emissive: c, emissiveIntensity: 0.3 + i * 0.08,
        transparent: true, opacity: 0.85, metalness: 0.1, roughness: 0.1, side: THREE.DoubleSide,
      }));
      scr.position.set(...s.pos); scr.rotation.set(...s.rot);
      g.add(scr);

      const bLine = new THREE.LineSegments(new THREE.EdgesGeometry(sGeo), glowWire(col, 0.5));
      bLine.position.copy(scr.position); bLine.rotation.copy(scr.rotation);
      g.add(bLine);
    });

    for (let i = 0; i < 25; i++) {
      const d = glowDot(col, 0.018);
      d.position.set((Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2.5, (Math.random() - 0.5) * 2);
      d.userData.floatSpeed = 0.2 + Math.random() * 0.4;
      d.userData.floatOffset = Math.random() * Math.PI * 2;
      g.add(d);
    }

    g.userData.type = 'code';
    return g;
  }


  // 3 — Mobile · Holographic Device
  function createMobileHolo(col) {
    const g = new THREE.Group();
    const c = new THREE.Color(col);

    g.add(new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 1.35, 0.06),
      metalMat(col, { emissiveIntensity: 0.08, roughness: 0.1 })
    ));

    const scr = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 1.15),
      new THREE.MeshPhysicalMaterial({
        color: 0x050515, emissive: c, emissiveIntensity: 0.2,
        transparent: true, opacity: 0.9, metalness: 0, roughness: 0.02,
      })
    );
    scr.position.z = 0.031;
    g.add(scr);

    for (let i = 0; i < 5; i++) {
      const lGeo = new THREE.PlaneGeometry(0.5 + i * 0.12, 0.3 + i * 0.06);
      const layer = new THREE.Mesh(lGeo, new THREE.MeshPhysicalMaterial({
        color: 0x0a1a2a, emissive: c, emissiveIntensity: 0.25 - i * 0.03,
        transparent: true, opacity: 0.45 - i * 0.06, side: THREE.DoubleSide,
        metalness: 0, roughness: 0.1,
      }));
      layer.position.set(0, 0.1 + i * 0.15, 0.04 + i * 0.18);
      layer.rotation.x = -0.15 - i * 0.04;
      g.add(layer);

      const lLine = new THREE.LineSegments(new THREE.EdgesGeometry(lGeo), glowWire(col, 0.35 - i * 0.04));
      lLine.position.copy(layer.position); lLine.rotation.copy(layer.rotation);
      g.add(lLine);
    }

    for (let i = 0; i < 6; i++) {
      const dot = glowDot(col, 0.025);
      const a = (i / 6) * Math.PI * 2;
      dot.position.set(Math.cos(a) * (0.6 + Math.random() * 0.3), Math.sin(a) * 0.5 + 0.1, 0.3 + Math.random() * 0.3);
      dot.userData.floatSpeed = 0.3 + Math.random() * 0.3;
      dot.userData.floatOffset = Math.random() * Math.PI * 2;
      g.add(dot);
    }

    g.userData.type = 'mobile';
    return g;
  }


  // 4 — Cloud · Dodecahedron Constellation
  function createCloudNetwork(col) {
    const g = new THREE.Group();
    const c = new THREE.Color(col);

    const dGeo = new THREE.DodecahedronGeometry(0.7, 0);
    g.add(new THREE.Mesh(dGeo, glassMat(col, { opacity: 0.3, emissiveIntensity: 0.4 })));
    g.add(new THREE.LineSegments(new THREE.WireframeGeometry(dGeo), glowWire(col, 0.6)));

    const dp = dGeo.attributes.position;
    const seen = new Set();
    for (let i = 0; i < dp.count; i++) {
      const k = `${dp.getX(i).toFixed(2)},${dp.getY(i).toFixed(2)},${dp.getZ(i).toFixed(2)}`;
      if (seen.has(k)) continue; seen.add(k);
      const n = glowDot(col, 0.04);
      n.position.set(dp.getX(i), dp.getY(i), dp.getZ(i));
      g.add(n);
    }

    const satGeo = new THREE.BoxGeometry(0.12, 0.18, 0.08);
    for (let i = 0; i < 6; i++) {
      const sat = new THREE.Mesh(satGeo, metalMat(col, { emissiveIntensity: 0.4 }));
      const a = (i / 6) * Math.PI * 2, r = 1.4 + Math.random() * 0.3;
      sat.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 0.8, Math.sin(a) * r);
      sat.rotation.set(Math.random(), Math.random(), Math.random());
      sat.userData.orbit = { angle: a, r, speed: 0.1 + Math.random() * 0.15 };

      const sLine = new THREE.LineSegments(new THREE.EdgesGeometry(satGeo), glowWire(col, 0.5));
      sLine.position.copy(sat.position); sLine.rotation.copy(sat.rotation);
      g.add(sat); g.add(sLine);
    }

    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.3 + i * 0.25, 0.005, 8, 64),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.15 })
      );
      ring.rotation.x = Math.PI * (0.4 + i * 0.3);
      g.add(ring);
    }

    g.userData.type = 'cloud';
    return g;
  }


  // 5 — Consulting · Armillary Gyroscope
  function createGyroscope(col) {
    const g = new THREE.Group();
    const c = new THREE.Color(col);

    g.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 32, 32),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.5 })
    ));
    g.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      metalMat(col, { emissiveIntensity: 0.6 })
    ));

    const rings = [
      { r: 0.65, tube: 0.015, rotX: 0, rotZ: 0, speed: 0.4 },
      { r: 0.85, tube: 0.012, rotX: Math.PI / 3, rotZ: 0.3, speed: -0.3 },
      { r: 1.05, tube: 0.01, rotX: Math.PI / 5, rotZ: -0.6, speed: 0.2 },
      { r: 1.25, tube: 0.008, rotX: Math.PI / 2.5, rotZ: 0.8, speed: -0.15 },
    ];

    rings.forEach((rc, i) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(rc.r, rc.tube, 12, 80),
        new THREE.MeshPhysicalMaterial({
          color: 0x2a2a3f, metalness: 0.8, roughness: 0.2,
          emissive: c, emissiveIntensity: 0.3 - i * 0.05, transparent: true, opacity: 0.8,
        })
      );
      ring.rotation.x = rc.rotX; ring.rotation.z = rc.rotZ;
      ring.userData.ringSpeed = rc.speed;
      g.add(ring);

      for (let j = 0; j < 4; j++) {
        const mk = glowDot(col, 0.025);
        const a = (j / 4) * Math.PI * 2;
        mk.position.set(Math.cos(a) * rc.r, Math.sin(a) * rc.r, 0);
        g.add(mk);
      }
    });

    g.userData.type = 'gyro';
    return g;
  }


  // 6 — DevOps · Infinity Pipeline
  function createInfinityLoop(col) {
    const g = new THREE.Group();
    const c = new THREE.Color(col);

    const iGeo = new THREE.TorusKnotGeometry(0.8, 0.08, 200, 16, 2, 1);
    g.add(new THREE.Mesh(iGeo, new THREE.MeshPhysicalMaterial({
      color: 0x1a1a30, metalness: 0.88, roughness: 0.18,
      emissive: c, emissiveIntensity: 0.35, transparent: true, opacity: 0.85,
    })));
    g.add(new THREE.LineSegments(new THREE.WireframeGeometry(iGeo), glowWire(col, 0.12)));
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(iGeo), glowWire(col, 0.35)));

    const flowGeo = new THREE.SphereGeometry(0.025, 8, 8);
    for (let i = 0; i < 40; i++) {
      const p = new THREE.Mesh(flowGeo, new THREE.MeshBasicMaterial({
        color: c, transparent: true, opacity: 0.7 + Math.random() * 0.3
      }));
      p.userData.flowT = i / 40;
      p.userData.flowSpeed = 0.08 + Math.random() * 0.04;
      g.add(p);
    }

    for (let i = 0; i < 2; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.5 + i * 0.2, 0.004, 8, 64),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.12 })
      );
      ring.rotation.x = Math.PI / 2; ring.rotation.z = i * 0.5;
      g.add(ring);
    }

    g.userData.type = 'infinity';
    return g;
  }

})();
