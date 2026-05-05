/* ============================================================
   Intros — welcome animations for Micorriza
   - Mounts a full-screen overlay into #intro-root.
   - 4 concepts: mycelium, logo, spores, emergence.
   - Selection order on home: ?intro=<id> → localStorage → default.
   - Once per session via sessionStorage (skipped when forced).
   - prefers-reduced-motion → no intro.
   ============================================================ */

const STORAGE_DEFAULT = "micorriza:intro:default";
const STORAGE_PLAYED  = "micorriza:intro:played";

export const INTROS = [
  {
    id: "mycelium",
    label: "Arrayán, bosque y micorriza",
    summary: "Las raíces brotan, se entrelazan en una red neuronal y reciben nutrientes; un arrayán crece, hongos fructifican a sus pies, y luego un bosque entero emerge interconectado por la micorriza.",
    play: playMycelium,
    thumb: thumbMycelium,
  },
  {
    id: "logo",
    label: "Construcción del logo",
    summary: "Los nodos del logo Micorriza aparecen, se trazan sus líneas y emerge el wordmark.",
    play: playLogo,
    thumb: thumbLogo,
  },
  {
    id: "spores",
    label: "Esporas germinando",
    summary: "Esporas que caen, aterrizan en el suelo y germinan en pequeños micelios entrelazados.",
    play: playSpores,
    thumb: thumbSpores,
  },
  {
    id: "emergence",
    label: "Emergencia subterránea",
    summary: "Una capa de tierra con raíces colgantes se repliega hacia arriba revelando el sitio.",
    play: playEmergence,
    thumb: thumbEmergence,
  },
];

const VALID_IDS = INTROS.map((i) => i.id);

export function getIntroById(id) {
  return INTROS.find((i) => i.id === id) || null;
}

export function getDefaultIntro() {
  const stored = localStorage.getItem(STORAGE_DEFAULT);
  return VALID_IDS.includes(stored) ? stored : "mycelium";
}

export function setDefaultIntro(id) {
  if (!VALID_IDS.includes(id)) return false;
  localStorage.setItem(STORAGE_DEFAULT, id);
  return true;
}

export async function playIntro(id, { container, force = false } = {}) {
  const intro = getIntroById(id);
  if (!intro) return;
  const root = container || document.getElementById("intro-root");
  if (!root) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce && !force) return;

  const stage = document.createElement("div");
  stage.className = `intro-stage intro-${id}`;
  stage.setAttribute("role", "presentation");
  stage.setAttribute("aria-hidden", "true");
  root.appendChild(stage);
  root.classList.add("is-active");

  const skipBtn = document.createElement("button");
  skipBtn.type = "button";
  skipBtn.className = "intro-skip";
  skipBtn.textContent = "Saltar";
  stage.appendChild(skipBtn);

  let skipped = false;
  const skip = () => { skipped = true; };
  skipBtn.addEventListener("click", skip);
  const onKey = (e) => { if (e.key === "Escape") skip(); };
  document.addEventListener("keydown", onKey);
  stage.addEventListener("click", (e) => { if (e.target === stage) skip(); });

  try {
    await intro.play(stage, { isSkipped: () => skipped });
  } catch (err) {
    console.warn("[intros] error during", id, err);
  } finally {
    document.removeEventListener("keydown", onKey);
    stage.classList.add("is-leaving");
    await wait(280);
    stage.remove();
    root.classList.remove("is-active");
  }
}

/* ---------- 1) Mycelium ----------
   Narrative (~2.9s):
     0–700ms   : roots fan out from a central spore (stroke-dashoffset draw)
     500–1100  : sub-branches sprout at root tips
     900–1300  : tier-1 nodes pop in at root tips, tier-2 at sub-tips
     1300–1900 : neural cross-connections draw between distant nodes
     1400–2200 : nutrient particles travel from outer endpoints inward (SMIL)
     1700–2400 : stem grows upward from the spore
     1900–2700 : leaves unfurl one by one
     2580–2900 : whole canvas fades, page revealed
*/
function playMycelium(stage, { isSkipped }) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 600 600");
  svg.setAttribute("class", "myc-canvas");
  svg.setAttribute("aria-hidden", "true");

  // soil reference line (subtle)
  const soil = line(NS, 60, 320, 540, 320, "#DCC8A8", 1, "myc-soil");
  soil.setAttribute("stroke-dasharray", "3 5");
  svg.appendChild(soil);

  // 8 main roots radiating down/sideways from the central spore
  const rootDefs = [
    "M300,320 Q 250,360 200,420",
    "M300,320 Q 350,360 400,420",
    "M300,320 Q 220,400 160,460",
    "M300,320 Q 380,400 440,460",
    "M300,320 Q 290,420 290,500",
    "M300,320 Q 310,420 320,520",
    "M300,320 Q 230,335 150,340",
    "M300,320 Q 370,335 450,340",
  ];
  const rootColors = ["#898561","#B07A4A","#898561","#B07A4A","#66B7C9","#66B7C9","#898561","#B07A4A"];
  rootDefs.forEach((d, i) => {
    svg.appendChild(path(NS, d, rootColors[i], 2, `myc-line l${i + 1}`));
  });

  // sub-branches at root endpoints
  const subs = [
    "M200,420 Q 170,440 140,460",
    "M400,420 Q 430,440 460,460",
    "M160,460 Q 130,490 110,520",
    "M440,460 Q 470,490 490,520",
    "M290,500 Q 280,540 280,570",
    "M320,520 Q 330,550 340,580",
    "M150,340 Q 110,340 80,345",
    "M450,340 Q 490,340 520,345",
  ];
  subs.forEach((d, i) => {
    svg.appendChild(path(NS, d, i % 2 ? "#B07A4A" : "#66B7C9", 1.4, "myc-sub"));
  });

  // central spore (above roots in z-order)
  svg.appendChild(circle(NS, 300, 320, 12, "#1F3B5B", "myc-spore"));

  // tier-1 nodes at root tips, tier-2 at sub-branch tips
  const nodes = [
    [200, 420, 5, "#3B2E26", "tier-1"],
    [400, 420, 5, "#B07A4A", "tier-1"],
    [160, 460, 5, "#66B7C9", "tier-1"],
    [440, 460, 5, "#66B7C9", "tier-1"],
    [290, 500, 4, "#1F3B5B", "tier-1"],
    [320, 520, 4, "#1F3B5B", "tier-1"],
    [150, 340, 4, "#898561", "tier-1"],
    [450, 340, 4, "#B07A4A", "tier-1"],
    [140, 460, 3, "#B07A4A", "tier-2"],
    [460, 460, 3, "#B07A4A", "tier-2"],
    [110, 520, 3, "#66B7C9", "tier-2"],
    [490, 520, 3, "#66B7C9", "tier-2"],
    [280, 570, 3, "#1F3B5B", "tier-2"],
    [340, 580, 3, "#1F3B5B", "tier-2"],
    [80,  345, 3, "#898561", "tier-2"],
    [520, 345, 3, "#898561", "tier-2"],
  ];
  nodes.forEach(([cx, cy, r, fill, tier]) => {
    svg.appendChild(circle(NS, cx, cy, r, fill, `myc-node ${tier}`));
  });

  // neural cross-connections: dashed lines between distant nodes,
  // suggesting the mycelial junctions becoming a neural network
  const neural = [
    "M200,420 L 400,420",
    "M160,460 L 440,460",
    "M150,340 L 450,340",
    "M200,420 L 160,460",
    "M400,420 L 440,460",
    "M290,500 L 320,520",
    "M150,340 L 200,420",
    "M450,340 L 400,420",
  ];
  neural.forEach((d, i) => {
    const p = path(NS, d, "#66B7C9", 0.9, `myc-neural neu-${i + 1}`);
    p.setAttribute("stroke-dasharray", "3 4");
    svg.appendChild(p);
  });

  // nutrient particles flow inward along each root (SMIL animateMotion + opacity)
  rootDefs.forEach((d, i) => {
    const n = circle(NS, 0, 0, 2.6, "#DCC8A8", "myc-nutrient");
    n.setAttribute("opacity", "0");
    const begin = 1.4 + i * 0.08;

    const fadeIn = document.createElementNS(NS, "animate");
    fadeIn.setAttribute("attributeName", "opacity");
    fadeIn.setAttribute("begin", `${begin}s`);
    fadeIn.setAttribute("dur", "0.15s");
    fadeIn.setAttribute("from", "0");
    fadeIn.setAttribute("to", "1");
    fadeIn.setAttribute("fill", "freeze");
    n.appendChild(fadeIn);

    const motion = document.createElementNS(NS, "animateMotion");
    motion.setAttribute("dur", "0.7s");
    motion.setAttribute("begin", `${begin}s`);
    motion.setAttribute("fill", "freeze");
    motion.setAttribute("keyPoints", "1;0");
    motion.setAttribute("keyTimes", "0;1");
    motion.setAttribute("path", d);
    n.appendChild(motion);

    const fadeOut = document.createElementNS(NS, "animate");
    fadeOut.setAttribute("attributeName", "opacity");
    fadeOut.setAttribute("begin", `${begin + 0.55}s`);
    fadeOut.setAttribute("dur", "0.15s");
    fadeOut.setAttribute("from", "1");
    fadeOut.setAttribute("to", "0");
    fadeOut.setAttribute("fill", "freeze");
    n.appendChild(fadeOut);

    svg.appendChild(n);
  });

  // === arrayán plant: scales progressively from sapling to tree ===
  const plant = document.createElementNS(NS, "g");
  plant.setAttribute("class", "myc-plant");

  // arrayán-style stem: cinnamon bark, slight sway
  plant.appendChild(path(NS, "M300,320 Q 296,270 304,220 Q 295,170 302,120 Q 299,100 300,82", "#b56a3e", 4.5, "myc-stem"));

  // bark highlights: cream patches on the trunk (arrayán's peeling bark)
  const barkSpots = [
    { cx: 299, cy: 280, rx: 4,   ry: 2 },
    { cx: 302, cy: 240, rx: 3.2, ry: 1.6 },
    { cx: 298, cy: 180, rx: 4,   ry: 2 },
    { cx: 302, cy: 130, rx: 3,   ry: 1.5 },
  ];
  barkSpots.forEach((s, i) => {
    const e = document.createElementNS(NS, "ellipse");
    e.setAttribute("cx", s.cx); e.setAttribute("cy", s.cy);
    e.setAttribute("rx", s.rx); e.setAttribute("ry", s.ry);
    e.setAttribute("fill", "#e8c8a4");
    e.setAttribute("class", `myc-bark-spot bs-${i + 1}`);
    plant.appendChild(e);
  });

  // bigger arrayán leaves along the stem
  const leafD = "M0 0 Q -26 -32 0 -76 Q 26 -32 0 0 Z";
  const veinD = "M 0 -3 L 0 -68";
  const leaves = [
    { y: 255, rot: -58, size: 1.30, fill: "#6da25a" },
    { y: 265, rot:  52, size: 1.30, fill: "#5e8b4a" },
    { y: 190, rot: -50, size: 1.10, fill: "#7ab063" },
    { y: 185, rot:  45, size: 1.10, fill: "#6da25a" },
    { y: 115, rot: -22, size: 0.95, fill: "#7ab063" },
  ];
  leaves.forEach((l, i) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("transform", `translate(300 ${l.y}) rotate(${l.rot}) scale(${l.size})`);
    const inner = document.createElementNS(NS, "g");
    inner.setAttribute("class", `myc-leaf myc-leaf-${i + 1}`);
    const blade = document.createElementNS(NS, "path");
    blade.setAttribute("d", leafD);
    blade.setAttribute("fill", l.fill);
    inner.appendChild(blade);
    const vein = document.createElementNS(NS, "path");
    vein.setAttribute("d", veinD);
    vein.setAttribute("stroke", "#3a5e2f");
    vein.setAttribute("stroke-width", "0.7");
    vein.setAttribute("stroke-linecap", "round");
    inner.appendChild(vein);
    g.appendChild(inner);
    plant.appendChild(g);
  });

  // attach the plant group last so leaves render above the trunk
  svg.appendChild(plant);

  // mushrooms fruiting at the base of the arrayán (mycelium → fruiting body)
  // Sized big and placed wide so they read clearly on mobile.
  const mushrooms = [
    { x: 230, capRx: 26, capRy: 16, stemH: 30, stemW: 9,   capColor: "#c83030", outline: "#7a1f1f" },
    { x: 372, capRx: 22, capRy: 14, stemH: 26, stemW: 7.5, capColor: "#d85530", outline: "#7a1f1f" },
    { x: 196, capRx: 16, capRy: 11, stemH: 20, stemW: 5.5, capColor: "#b02828", outline: "#6a1818" },
  ];
  mushrooms.forEach((m, i) => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", `myc-mushroom mush-${i + 1}`);
    g.setAttribute("data-x", m.x);

    // ground shadow under the cap
    const shadow = document.createElementNS(NS, "ellipse");
    shadow.setAttribute("cx", m.x);
    shadow.setAttribute("cy", 322);
    shadow.setAttribute("rx", m.capRx * 0.85);
    shadow.setAttribute("ry", 2.5);
    shadow.setAttribute("fill", "#3B2E26");
    shadow.setAttribute("opacity", "0.18");
    g.appendChild(shadow);

    // stem (rounded rect)
    const stemRect = document.createElementNS(NS, "rect");
    stemRect.setAttribute("x", m.x - m.stemW / 2);
    stemRect.setAttribute("y", 320 - m.stemH);
    stemRect.setAttribute("width", m.stemW);
    stemRect.setAttribute("height", m.stemH);
    stemRect.setAttribute("rx", m.stemW / 2);
    stemRect.setAttribute("fill", "#f4ead8");
    stemRect.setAttribute("stroke", "#c8b88a");
    stemRect.setAttribute("stroke-width", "0.6");
    g.appendChild(stemRect);

    // cap
    const cap = document.createElementNS(NS, "ellipse");
    cap.setAttribute("cx", m.x);
    cap.setAttribute("cy", 320 - m.stemH);
    cap.setAttribute("rx", m.capRx);
    cap.setAttribute("ry", m.capRy);
    cap.setAttribute("fill", m.capColor);
    cap.setAttribute("stroke", m.outline);
    cap.setAttribute("stroke-width", "0.8");
    g.appendChild(cap);

    // cap highlight (lighter top stripe)
    const hi = document.createElementNS(NS, "ellipse");
    hi.setAttribute("cx", m.x - m.capRx * 0.2);
    hi.setAttribute("cy", 320 - m.stemH - m.capRy * 0.45);
    hi.setAttribute("rx", m.capRx * 0.55);
    hi.setAttribute("ry", m.capRy * 0.18);
    hi.setAttribute("fill", "#ffffff");
    hi.setAttribute("opacity", "0.25");
    g.appendChild(hi);

    // white spots on cap (5, larger)
    const spots = [
      [m.x - m.capRx * 0.55, 320 - m.stemH - m.capRy * 0.20, m.capRx * 0.16],
      [m.x + m.capRx * 0.45, 320 - m.stemH - m.capRy * 0.45, m.capRx * 0.13],
      [m.x - m.capRx * 0.05, 320 - m.stemH - m.capRy * 0.75, m.capRx * 0.14],
      [m.x - m.capRx * 0.30, 320 - m.stemH - m.capRy * 0.55, m.capRx * 0.10],
      [m.x + m.capRx * 0.20, 320 - m.stemH - m.capRy * 0.10, m.capRx * 0.10],
    ];
    spots.forEach(([sx, sy, sr]) => {
      const dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", sx); dot.setAttribute("cy", sy);
      dot.setAttribute("r", sr);  dot.setAttribute("fill", "#fff7e6");
      g.appendChild(dot);
    });
    svg.appendChild(g);
  });

  // === FOREST: full-canopy side trees emerge after the central arrayán ===
  // Each tree has a taller cinnamon trunk, bark patches and a canopy of 11
  // overlapping leaves arranged in upper / mid / lower rings, so it reads
  // as a mature tree rather than a sapling even at small scale.
  const forestSpec = [
    { x: 140, scale: 0.72, dense: true  },
    { x: 460, scale: 0.72, dense: true  },
    { x:  76, scale: 0.55, dense: false },
    { x: 524, scale: 0.55, dense: false },
  ];
  const treeLeafD = "M0 0 Q -22 -28 0 -64 Q 22 -28 0 0 Z";
  const treeVeinD = "M 0 -3 L 0 -56";
  const fullCanopy = [
    { dx:   0, dy: -22, rot:   0, size: 1.00, fill: "#7ab063" },
    { dx: -22, dy: -10, rot: -30, size: 1.00, fill: "#6da25a" },
    { dx:  22, dy: -10, rot:  30, size: 1.00, fill: "#6da25a" },
    { dx: -38, dy:   8, rot: -55, size: 1.05, fill: "#5e8b4a" },
    { dx:  38, dy:   8, rot:  55, size: 1.05, fill: "#5e8b4a" },
    { dx: -28, dy:  -4, rot: -42, size: 1.00, fill: "#7ab063" },
    { dx:  28, dy:  -4, rot:  42, size: 1.00, fill: "#7ab063" },
    { dx: -34, dy:  24, rot: -78, size: 0.90, fill: "#6da25a" },
    { dx:  34, dy:  24, rot:  78, size: 0.90, fill: "#6da25a" },
    { dx:  -8, dy:  32, rot: -10, size: 0.90, fill: "#5e8b4a" },
    { dx:   8, dy:  32, rot:  10, size: 0.90, fill: "#5e8b4a" },
  ];
  const lightCanopy = [
    { dx:   0, dy: -22, rot:   0, size: 1.00, fill: "#7ab063" },
    { dx: -28, dy:  -2, rot: -42, size: 1.00, fill: "#6da25a" },
    { dx:  28, dy:  -2, rot:  42, size: 1.00, fill: "#6da25a" },
    { dx: -32, dy:  20, rot: -72, size: 0.92, fill: "#5e8b4a" },
    { dx:  32, dy:  20, rot:  72, size: 0.92, fill: "#5e8b4a" },
    { dx:  -6, dy:  28, rot: -10, size: 0.85, fill: "#6da25a" },
    { dx:   6, dy:  28, rot:  10, size: 0.85, fill: "#6da25a" },
  ];

  forestSpec.forEach((t, i) => {
    const tree = document.createElementNS(NS, "g");
    tree.setAttribute("class", `myc-forest-tree ft-${i + 1}`);

    // 3 short roots fanning into the soil
    const rs = 60 * t.scale;
    [
      `M${t.x},320 Q ${t.x - rs * 0.5},${320 + rs * 0.5} ${t.x - rs * 0.7},${320 + rs}`,
      `M${t.x},320 Q ${t.x + rs * 0.5},${320 + rs * 0.5} ${t.x + rs * 0.7},${320 + rs}`,
      `M${t.x},320 Q ${t.x - rs * 0.1},${320 + rs * 0.7} ${t.x},${320 + rs * 1.2}`,
    ].forEach((d) => {
      tree.appendChild(path(NS, d, "#898561", 1.4 * t.scale, "ft-root"));
    });

    // taller cinnamon trunk
    const stemH = 200 * t.scale;
    const sTop = 320 - stemH;
    const stemD =
      `M${t.x},320 ` +
      `Q ${t.x - 3},${320 - stemH * 0.4}  ${t.x + 3},${320 - stemH * 0.7} ` +
      `Q ${t.x - 2},${sTop + 8} ${t.x},${sTop}`;
    tree.appendChild(path(NS, stemD, "#b56a3e", 4 * t.scale, "ft-stem"));

    // a couple of bark patches
    [
      [t.x - 1, sTop + stemH * 0.4, 2.6 * t.scale, 1.3 * t.scale],
      [t.x + 1, sTop + stemH * 0.7, 2.4 * t.scale, 1.2 * t.scale],
    ].forEach(([cx, cy, rx, ry]) => {
      const e = document.createElementNS(NS, "ellipse");
      e.setAttribute("cx", cx); e.setAttribute("cy", cy);
      e.setAttribute("rx", rx); e.setAttribute("ry", ry);
      e.setAttribute("fill", "#e8c8a4");
      e.setAttribute("opacity", "0.75");
      tree.appendChild(e);
    });

    // canopy
    const canopy = t.dense ? fullCanopy : lightCanopy;
    canopy.forEach((l) => {
      const g = document.createElementNS(NS, "g");
      const lx = t.x + l.dx * t.scale;
      const ly = sTop + l.dy * t.scale;
      g.setAttribute(
        "transform",
        `translate(${lx} ${ly}) rotate(${l.rot}) scale(${l.size * t.scale})`
      );
      const blade = document.createElementNS(NS, "path");
      blade.setAttribute("d", treeLeafD);
      blade.setAttribute("fill", l.fill);
      g.appendChild(blade);
      const vein = document.createElementNS(NS, "path");
      vein.setAttribute("d", treeVeinD);
      vein.setAttribute("stroke", "#3a5e2f");
      vein.setAttribute("stroke-width", "0.6");
      vein.setAttribute("stroke-linecap", "round");
      vein.setAttribute("opacity", "0.7");
      g.appendChild(vein);
      tree.appendChild(g);
    });

    svg.appendChild(tree);
  });

  // === INTER-TREE MYCORRIZA NETWORK: a single mycelium connecting them all ===
  const networkPaths = [
    "M300,320 Q 220,360 140,332",  // central → tree-1 (left medium)
    "M300,320 Q 380,360 460,332",  // central → tree-2 (right medium)
    "M140,332 Q 108,355  76,338",  // tree-1 → tree-3 (far left)
    "M460,332 Q 492,355 524,338",  // tree-2 → tree-4 (far right)
    "M300,320 Q 200,420  76,338",  // central → tree-3 (deep arc)
    "M300,320 Q 400,420 524,338",  // central → tree-4 (deep arc)
  ];
  networkPaths.forEach((d, i) => {
    const p = path(NS, d, "#4f9eb0", 1.6, `myc-network mn-${i + 1}`);
    svg.appendChild(p);
  });

  // small "signal" pulses travel from each side tree toward the central spore,
  // showing the forest "talking" through the network
  networkPaths.slice(0, 4).forEach((d, i) => {
    const pulse = circle(NS, 0, 0, 2.4, "#9be0ee", "myc-pulse");
    pulse.setAttribute("opacity", "0");
    const begin = 4.4 + i * 0.12;

    const fadeIn = document.createElementNS(NS, "animate");
    fadeIn.setAttribute("attributeName", "opacity");
    fadeIn.setAttribute("begin", `${begin}s`);
    fadeIn.setAttribute("dur", "0.15s");
    fadeIn.setAttribute("from", "0"); fadeIn.setAttribute("to", "1");
    fadeIn.setAttribute("fill", "freeze");
    pulse.appendChild(fadeIn);

    const motion = document.createElementNS(NS, "animateMotion");
    motion.setAttribute("dur", "0.7s");
    motion.setAttribute("begin", `${begin}s`);
    motion.setAttribute("fill", "freeze");
    motion.setAttribute("keyPoints", "1;0");
    motion.setAttribute("keyTimes", "0;1");
    motion.setAttribute("path", d);
    pulse.appendChild(motion);

    const fadeOut = document.createElementNS(NS, "animate");
    fadeOut.setAttribute("attributeName", "opacity");
    fadeOut.setAttribute("begin", `${begin + 0.55}s`);
    fadeOut.setAttribute("dur", "0.15s");
    fadeOut.setAttribute("from", "1"); fadeOut.setAttribute("to", "0");
    fadeOut.setAttribute("fill", "freeze");
    pulse.appendChild(fadeOut);

    svg.appendChild(pulse);
  });

  stage.appendChild(svg);
  return raceWithSkip(5900, isSkipped);
}

/* ---------- 2) Logo build-up ---------- */
function playLogo(stage, { isSkipped }) {
  const NS = "http://www.w3.org/2000/svg";
  const wrap = document.createElement("div");
  wrap.className = "lg-canvas";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("aria-hidden", "true");

  // 6 lines (drawn after nodes)
  const lines = [
    [32, 32, 14, 18, "#898561", "d1"],
    [32, 32, 48, 14, "#B07A4A", "d2"],
    [32, 32, 52, 32, "#898561", "d3"],
    [32, 32, 14, 46, "#66B7C9", "d4"],
    [32, 32, 32, 54, "#66B7C9", "d5"],
    [32, 32, 50, 50, "#66B7C9", "d6"],
  ];
  lines.forEach(([x1, y1, x2, y2, stroke, cls]) => {
    const l = document.createElementNS(NS, "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1);
    l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    l.setAttribute("stroke", stroke);
    l.setAttribute("stroke-width", "1.4");
    l.setAttribute("stroke-linecap", "round");
    l.setAttribute("class", `lg-line ${cls}`);
    svg.appendChild(l);
  });

  // 7 nodes (animated first via :nth-of-type)
  const nodes = [
    [32, 32, 4,   "#1F3B5B"],
    [14, 18, 2.5, "#3B2E26"],
    [48, 14, 2.5, "#B07A4A"],
    [52, 32, 2.5, "#DCC8A8"],
    [14, 46, 2.5, "#66B7C9"],
    [32, 54, 2.5, "#1F3B5B"],
    [50, 50, 2.5, "#66B7C9"],
  ];
  nodes.forEach(([cx, cy, r, fill]) => {
    svg.appendChild(circle(NS, cx, cy, r, fill, "lg-node"));
  });

  const word = document.createElement("div");
  word.className = "lg-wordmark";
  word.textContent = "Micorriza";

  wrap.appendChild(svg);
  wrap.appendChild(word);
  stage.appendChild(wrap);
  return raceWithSkip(2250, isSkipped);
}

/* ---------- 3) Spores germinating (WAAPI) ---------- */
function playSpores(stage, { isSkipped }) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 600 600");
  svg.setAttribute("class", "sp-canvas");
  svg.setAttribute("aria-hidden", "true");

  // soil line
  const soil = document.createElementNS(NS, "ellipse");
  soil.setAttribute("cx", "300"); soil.setAttribute("cy", "440");
  soil.setAttribute("rx", "260"); soil.setAttribute("ry", "10");
  soil.setAttribute("fill", "#DCC8A8");
  soil.setAttribute("class", "sp-soil");
  svg.appendChild(soil);

  // 6 spores: x positions
  const spores = [
    { x: 140, color: "#B07A4A", delay: 0,    fall: 950,  drift: -10 },
    { x: 220, color: "#66B7C9", delay: 120,  fall: 870,  drift:  6  },
    { x: 300, color: "#1F3B5B", delay: 80,   fall: 1020, drift:  0  },
    { x: 380, color: "#B07A4A", delay: 220,  fall: 920,  drift: -4  },
    { x: 460, color: "#66B7C9", delay: 60,   fall: 1080, drift:  10 },
    { x: 200, color: "#898561", delay: 320,  fall: 880,  drift: -8  },
  ];
  const landingY = 432;
  const sprouts = [];
  spores.forEach((s, i) => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", s.x); c.setAttribute("cy", -20);
    c.setAttribute("r", 5);    c.setAttribute("fill", s.color);
    c.setAttribute("class", "sp-spore");
    svg.appendChild(c);

    // pre-build sprout (hidden via stroke-dashoffset)
    const sprout = document.createElementNS(NS, "path");
    const sx = s.x + s.drift;
    const tipY = landingY - 40 - (i % 3) * 18;
    const tipX = sx + (i % 2 === 0 ? -22 : 22);
    sprout.setAttribute("d", `M${sx},${landingY} Q ${(sx+tipX)/2},${landingY - 20} ${tipX},${tipY}`);
    sprout.setAttribute("stroke", "#5e8b4a");
    sprout.setAttribute("stroke-width", "1.6");
    sprout.setAttribute("fill", "none");
    sprout.setAttribute("stroke-linecap", "round");
    sprout.setAttribute("class", "sp-sprout");
    svg.appendChild(sprout);
    sprouts.push({ tipX, tipY, sprout });

    // animate fall via WAAPI
    c.animate(
      [
        { cy: -20,             offset: 0    },
        { cy: landingY - 8,    offset: 0.85 },
        { cy: landingY,        offset: 1    },
      ],
      { duration: s.fall, delay: s.delay, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" }
    );
    // small horizontal drift via cx
    c.animate(
      [{ cx: s.x }, { cx: s.x + s.drift }],
      { duration: s.fall, delay: s.delay, easing: "ease-out", fill: "forwards" }
    );

    // sprout grows shortly after landing
    sprout.animate(
      [{ strokeDashoffset: 80 }, { strokeDashoffset: 0 }],
      { duration: 520, delay: s.delay + s.fall - 60, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" }
    );
  });

  // connecting threads between sprout tips
  for (let i = 0; i < sprouts.length - 1; i++) {
    const a = sprouts[i], b = sprouts[i + 1];
    const t = document.createElementNS(NS, "path");
    const midX = (a.tipX + b.tipX) / 2;
    const midY = Math.min(a.tipY, b.tipY) - 16;
    t.setAttribute("d", `M${a.tipX},${a.tipY} Q ${midX},${midY} ${b.tipX},${b.tipY}`);
    t.setAttribute("stroke", "#66B7C9");
    t.setAttribute("stroke-width", "1");
    t.setAttribute("fill", "none");
    t.setAttribute("stroke-linecap", "round");
    t.setAttribute("opacity", "0.7");
    t.setAttribute("class", "sp-thread");
    svg.appendChild(t);
    t.animate(
      [{ strokeDashoffset: 160 }, { strokeDashoffset: 0 }],
      { duration: 520, delay: 1500 + i * 60, easing: "cubic-bezier(.2,.7,.2,1)", fill: "forwards" }
    );
  }

  stage.appendChild(svg);
  return raceWithSkip(2250, isSkipped);
}

/* ---------- 4) Underground emergence ---------- */
function playEmergence(stage, { isSkipped }) {
  const wrap = document.createElement("div");
  wrap.className = "intro-emergence em-canvas";

  const curtain = document.createElement("div");
  curtain.className = "em-curtain";

  // hanging roots SVG anchored at bottom
  const NS = "http://www.w3.org/2000/svg";
  const roots = document.createElementNS(NS, "svg");
  roots.setAttribute("class", "em-roots");
  roots.setAttribute("viewBox", "0 0 1000 80");
  roots.setAttribute("preserveAspectRatio", "none");
  roots.setAttribute("aria-hidden", "true");
  const rootDefs = [
    "M50,0 Q 60,30 50,80",
    "M120,0 Q 100,30 130,80",
    "M200,0 Q 220,40 200,80",
    "M280,0 Q 260,40 290,80",
    "M360,0 Q 380,30 360,80",
    "M440,0 Q 420,40 450,80",
    "M520,0 Q 540,30 520,80",
    "M600,0 Q 580,40 610,80",
    "M680,0 Q 700,30 680,80",
    "M760,0 Q 740,40 770,80",
    "M840,0 Q 860,30 840,80",
    "M920,0 Q 900,40 930,80",
    "M970,0 Q 980,30 960,80",
  ];
  rootDefs.forEach((d) => {
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("stroke", "#DCC8A8");
    p.setAttribute("stroke-width", "1.6");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("fill", "none");
    p.setAttribute("opacity", "0.85");
    p.setAttribute("class", "em-root");
    roots.appendChild(p);
  });
  curtain.appendChild(roots);

  // dirt particles falling behind the rising curtain
  for (let i = 0; i < 12; i++) {
    const d = document.createElement("span");
    d.className = "em-dirt";
    d.style.left = `${5 + i * 8 + Math.random() * 6}%`;
    d.style.top = `${50 + Math.random() * 25}%`;
    d.style.setProperty("--dx", `${(Math.random() - 0.5) * 30}px`);
    d.style.animationDelay = `${300 + Math.random() * 600}ms`;
    d.style.background = i % 2 ? "#B07A4A" : "#898561";
    d.style.width = d.style.height = `${4 + Math.random() * 4}px`;
    wrap.appendChild(d);
  }

  wrap.appendChild(curtain);
  stage.appendChild(wrap);
  return raceWithSkip(2200, isSkipped);
}

/* ---------- thumbnails for the gallery ---------- */
function thumbMycelium() {
  return `
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="220" x2="580" y2="220" stroke="#DCC8A8" stroke-width="1" stroke-dasharray="3 5" opacity="0.55"/>
      <!-- forest: 4 side trees -->
      <g stroke-linecap="round" fill="none">
        <path d="M150,220 Q 148,190 152,160 Q 147,140 150,128" stroke="#b56a3e" stroke-width="2"/>
        <path d="M450,220 Q 448,190 452,160 Q 447,140 450,128" stroke="#b56a3e" stroke-width="2"/>
        <path d="M85,220  Q 83,200  87,182 Q 84,168  85,160"   stroke="#b56a3e" stroke-width="1.5"/>
        <path d="M515,220 Q 513,200 517,182 Q 514,168 515,160"  stroke="#b56a3e" stroke-width="1.5"/>
      </g>
      <g transform="translate(150 152) rotate(-50) scale(0.6)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#6da25a"/></g>
      <g transform="translate(150 156) rotate(50)  scale(0.6)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#5e8b4a"/></g>
      <g transform="translate(150 130) rotate(-25) scale(0.5)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#7ab063"/></g>
      <g transform="translate(150 130) rotate(25)  scale(0.5)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#6da25a"/></g>
      <g transform="translate(450 152) rotate(-50) scale(0.6)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#6da25a"/></g>
      <g transform="translate(450 156) rotate(50)  scale(0.6)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#5e8b4a"/></g>
      <g transform="translate(450 130) rotate(-25) scale(0.5)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#7ab063"/></g>
      <g transform="translate(450 130) rotate(25)  scale(0.5)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#6da25a"/></g>
      <g transform="translate(85  175) rotate(-45) scale(0.45)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#6da25a"/></g>
      <g transform="translate(85  175) rotate(45)  scale(0.45)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#5e8b4a"/></g>
      <g transform="translate(515 175) rotate(-45) scale(0.45)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#6da25a"/></g>
      <g transform="translate(515 175) rotate(45)  scale(0.45)"><path d="M0 0 Q -20 -22 0 -52 Q 20 -22 0 0 Z" fill="#5e8b4a"/></g>
      <!-- central arrayán -->
      <path d="M300,220 Q 296,180 304,140 Q 295,110 302,80" stroke="#b56a3e" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="299" cy="190" rx="3.5" ry="1.8" fill="#e8c8a4"/>
      <ellipse cx="302" cy="150" rx="3"   ry="1.5" fill="#e8c8a4"/>
      <g transform="translate(300 180) rotate(-58) scale(1.0)"><path d="M0 0 Q -22 -28 0 -68 Q 22 -28 0 0 Z" fill="#6da25a"/></g>
      <g transform="translate(300 184) rotate(52)  scale(1.0)"><path d="M0 0 Q -22 -28 0 -68 Q 22 -28 0 0 Z" fill="#5e8b4a"/></g>
      <g transform="translate(300 115) rotate(-40) scale(0.8)"><path d="M0 0 Q -22 -28 0 -68 Q 22 -28 0 0 Z" fill="#7ab063"/></g>
      <g transform="translate(300 110) rotate(40)  scale(0.8)"><path d="M0 0 Q -22 -28 0 -68 Q 22 -28 0 0 Z" fill="#6da25a"/></g>
      <!-- inter-tree mycorriza network -->
      <g stroke="#4f9eb0" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.85">
        <path d="M300,220 Q 220,250 150,225"/>
        <path d="M300,220 Q 380,250 450,225"/>
        <path d="M150,225 Q 110,238  85,228"/>
        <path d="M450,225 Q 490,238 515,228"/>
        <path d="M300,220 Q 200,275  85,228"/>
        <path d="M300,220 Q 400,275 515,228"/>
      </g>
      <!-- mushrooms at the base of central tree -->
      <ellipse cx="240" cy="222" rx="14" ry="2" fill="#3B2E26" opacity="0.18"/>
      <rect x="236.5" y="200" width="7" height="20" rx="3.5" fill="#f4ead8" stroke="#c8b88a" stroke-width="0.6"/>
      <ellipse cx="240" cy="200" rx="16" ry="10" fill="#c83030" stroke="#7a1f1f" stroke-width="0.7"/>
      <circle cx="232" cy="198" r="2.4" fill="#fff7e6"/>
      <circle cx="247" cy="195" r="2.0" fill="#fff7e6"/>
      <circle cx="240" cy="190" r="2.0" fill="#fff7e6"/>
      <ellipse cx="362" cy="222" rx="11" ry="1.6" fill="#3B2E26" opacity="0.18"/>
      <rect x="359" y="206" width="6" height="14" rx="3" fill="#f4ead8" stroke="#c8b88a" stroke-width="0.6"/>
      <ellipse cx="362" cy="206" rx="13" ry="8" fill="#d85530" stroke="#7a1f1f" stroke-width="0.7"/>
      <circle cx="356" cy="204" r="1.8" fill="#fff7e6"/>
      <circle cx="367" cy="202" r="1.6" fill="#fff7e6"/>
      <!-- central node + a couple of root tips -->
      <circle cx="300" cy="220" r="6" fill="#1F3B5B"/>
    </svg>
  `;
}
function thumbLogo() {
  return `
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(170 90)">
        <g stroke-linecap="round">
          <line x1="100" y1="100" x2="40" y2="40" stroke="#898561" stroke-width="2"/>
          <line x1="100" y1="100" x2="160" y2="40" stroke="#B07A4A" stroke-width="2"/>
          <line x1="100" y1="100" x2="180" y2="100" stroke="#898561" stroke-width="2"/>
          <line x1="100" y1="100" x2="40" y2="160" stroke="#66B7C9" stroke-width="2"/>
          <line x1="100" y1="100" x2="160" y2="160" stroke="#66B7C9" stroke-width="2"/>
        </g>
        <circle cx="100" cy="100" r="8" fill="#1F3B5B"/>
        <circle cx="40"  cy="40"  r="4" fill="#3B2E26"/>
        <circle cx="160" cy="40"  r="4" fill="#B07A4A"/>
        <circle cx="180" cy="100" r="4" fill="#DCC8A8"/>
        <circle cx="40"  cy="160" r="4" fill="#66B7C9"/>
        <circle cx="160" cy="160" r="4" fill="#66B7C9"/>
      </g>
      <text x="300" y="320" text-anchor="middle"
        font-family="Fraunces, serif" font-weight="600" font-size="38" fill="#1F3B5B"
        letter-spacing="1">Micorriza</text>
    </svg>
  `;
}
function thumbSpores() {
  return `
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="300" cy="290" rx="220" ry="6" fill="#DCC8A8" opacity="0.7"/>
      <g stroke="#5e8b4a" stroke-width="1.6" fill="none" stroke-linecap="round">
        <path d="M150,290 Q 140,260 120,220"/>
        <path d="M220,290 Q 230,260 240,230"/>
        <path d="M300,290 Q 290,250 305,210"/>
        <path d="M380,290 Q 390,260 400,220"/>
        <path d="M450,290 Q 440,260 425,230"/>
      </g>
      <g stroke="#66B7C9" stroke-width="1" fill="none" opacity="0.6">
        <path d="M120,220 Q 180,200 240,230"/>
        <path d="M240,230 Q 270,210 305,210"/>
        <path d="M305,210 Q 350,200 400,220"/>
        <path d="M400,220 Q 415,210 425,230"/>
      </g>
      <g>
        <circle cx="120" cy="220" r="4" fill="#B07A4A"/>
        <circle cx="240" cy="230" r="4" fill="#66B7C9"/>
        <circle cx="305" cy="210" r="4" fill="#1F3B5B"/>
        <circle cx="400" cy="220" r="4" fill="#B07A4A"/>
        <circle cx="425" cy="230" r="4" fill="#66B7C9"/>
      </g>
    </svg>
  `;
}
function thumbEmergence() {
  return `
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="emG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stop-color="#3B2E26"/>
          <stop offset="55%" stop-color="#898561"/>
          <stop offset="100%" stop-color="#DCC8A8"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="600" height="220" fill="url(#emG)"/>
      <g stroke="#DCC8A8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.85">
        <path d="M40,220 Q 50,260 40,300"/>
        <path d="M120,220 Q 100,260 130,300"/>
        <path d="M200,220 Q 220,270 200,310"/>
        <path d="M280,220 Q 260,270 290,310"/>
        <path d="M360,220 Q 380,260 360,300"/>
        <path d="M440,220 Q 420,270 450,310"/>
        <path d="M520,220 Q 540,260 520,300"/>
      </g>
      <text x="300" y="345" text-anchor="middle"
        font-family="Sora, sans-serif" font-weight="500" font-size="14" fill="#4a5160"
        letter-spacing="1">Sitio emergente</text>
    </svg>
  `;
}

/* ---------- helpers ---------- */
function path(NS, d, stroke, sw, cls) {
  const p = document.createElementNS(NS, "path");
  p.setAttribute("d", d);
  p.setAttribute("stroke", stroke);
  p.setAttribute("stroke-width", sw);
  p.setAttribute("fill", "none");
  p.setAttribute("stroke-linecap", "round");
  if (cls) p.setAttribute("class", cls);
  return p;
}
function circle(NS, cx, cy, r, fill, cls) {
  const c = document.createElementNS(NS, "circle");
  c.setAttribute("cx", cx); c.setAttribute("cy", cy);
  c.setAttribute("r", r);   c.setAttribute("fill", fill);
  if (cls) c.setAttribute("class", cls);
  return c;
}
function line(NS, x1, y1, x2, y2, stroke, sw, cls) {
  const l = document.createElementNS(NS, "line");
  l.setAttribute("x1", x1); l.setAttribute("y1", y1);
  l.setAttribute("x2", x2); l.setAttribute("y2", y2);
  l.setAttribute("stroke", stroke);
  l.setAttribute("stroke-width", sw);
  if (cls) l.setAttribute("class", cls);
  return l;
}
function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
function raceWithSkip(durationMs, isSkipped) {
  return new Promise((resolve) => {
    const start = performance.now();
    const id = setInterval(() => {
      if (isSkipped() || performance.now() - start >= durationMs) {
        clearInterval(id);
        resolve();
      }
    }, 60);
  });
}

/* ---------- Auto-arranque en index ---------- */
if (typeof document !== "undefined" && document.getElementById("intro-root") && !document.body.dataset.introManual) {
  const url = new URL(location.href);
  const forced = url.searchParams.get("intro");
  const portada = url.searchParams.get("portada"); // future-proof
  const seen   = sessionStorage.getItem(STORAGE_PLAYED) === "1";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let id = forced;
  if (!id) id = seen ? null : getDefaultIntro();

  if (id && id !== "none" && VALID_IDS.includes(id) && !reduce) {
    // mark portada selection (for future when there is more than one)
    if (portada) document.body.setAttribute("data-portada", portada);
    const run = playIntro(id);
    if (!forced) run.finally(() => sessionStorage.setItem(STORAGE_PLAYED, "1"));
  }
}
