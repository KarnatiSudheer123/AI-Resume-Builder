/* =========================================================
   AI Resume Builder — Vanilla JS
   ========================================================= */
const STORAGE_KEY = "resumeforge.v1";
const SKILL_LIBRARY = [
  "JavaScript","TypeScript","React","Vue","Angular","Svelte","Next.js","Node.js",
  "Express","NestJS","Python","Django","Flask","FastAPI","Java","Spring Boot",
  "Kotlin","Swift","Go","Rust","C++","C#",".NET","PHP","Laravel","Ruby","Rails",
  "HTML","CSS","Tailwind CSS","Sass","Bootstrap","Figma","Adobe XD","Photoshop",
  "Illustrator","SQL","PostgreSQL","MySQL","MongoDB","Redis","GraphQL","REST API",
  "AWS","Azure","GCP","Docker","Kubernetes","CI/CD","Git","GitHub Actions","Jenkins",
  "Linux","Bash","Machine Learning","Deep Learning","TensorFlow","PyTorch","NLP",
  "Data Analysis","Pandas","NumPy","Power BI","Tableau","Excel","Agile","Scrum",
  "Jira","Communication","Leadership","Problem Solving","Teamwork"
];
const state = {
  fullName: "", jobTitle: "", email: "", phone: "", address: "",
  linkedin: "", github: "",
  objective: "",
  education: [],
  skills: [],
  certifications: "",
  experience: [],
  projects: [],
  achievements: "",
  languages: "",
  template: "modern",
};
/* ============== INIT ============== */
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  initNavbar();
  initParticles();
  initTyping();
  initReveal();
  initFormBindings();
  initDynamicLists();
  initSkills();
  initAI();
  initTemplates();
  initDownload();
  initContact();
  initYear();
  render();
});
/* ============== STORAGE ============== */
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn("Save failed", e); }
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    Object.assign(state, parsed);
  } catch (e) { console.warn("Load failed", e); }
}
/* ============== TOASTS ============== */
function toast(message, type = "info") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  document.getElementById("toast-container").appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity .4s, transform .4s";
    el.style.opacity = "0";
    el.style.transform = "translateX(40px)";
    setTimeout(() => el.remove(), 400);
  }, 2800);
}
/* ============== NAVBAR ============== */
function initNavbar() {
  const ham = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  ham.addEventListener("click", () => {
    ham.classList.toggle("open");
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    ham.classList.remove("open"); links.classList.remove("open");
  }));
}
/* ============== PARTICLES ============== */
function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let w, h, particles;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(80, Math.floor((w * h) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.4,
    }));
  }
  resize();
  window.addEventListener("resize", resize);
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(135,206,250,0.55)";
      ctx.fill();
    }
    // links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          ctx.strokeStyle = `rgba(135,206,250,${0.18 * (1 - d2 / 14000)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
}
/* ============== TYPING ============== */
function initTyping() {
  const phrases = [
    "AI Resume Builder",
    "Land Your Dream Job.",
    "Craft Resumes in Seconds.",
    "Stand Out. Get Hired.",
  ];
  const el = document.getElementById("typed");
  let p = 0, i = 0, deleting = false;
  function tick() {
    const word = phrases[p];
    if (!deleting) {
      el.textContent = word.slice(0, ++i);
      if (i === word.length) { deleting = true; setTimeout(tick, 1600); return; }
    } else {
      el.textContent = word.slice(0, --i);
      if (i === 0) { deleting = false; p = (p + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 75);
  }
  tick();
}
/* ============== REVEAL ON SCROLL ============== */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}
/* ============== FORM BINDINGS ============== */
function initFormBindings() {
  const form = document.getElementById("resumeForm");
  const simpleFields = ["fullName","jobTitle","email","phone","address","linkedin","github","objective","certifications","achievements","languages"];
  simpleFields.forEach(name => {
    const el = form.querySelector(`[name="${name}"]`);
    if (!el) return;
    if (state[name]) el.value = state[name];
    el.addEventListener("input", () => {
      state[name] = el.value;
      saveState(); render();
    });
  });
}
/* ============== DYNAMIC LISTS ============== */
const DYNAMIC = {
  education: {
    listId: "educationList",
    blank: () => ({ school: "", degree: "", year: "", details: "" }),
    fields: [
      { key: "school", label: "School / University" },
      { key: "degree", label: "Degree / Field of Study" },
      { key: "year", label: "Year" },
      { key: "details", label: "Details", textarea: true },
    ],
  },
  experience: {
    listId: "experienceList",
    blank: () => ({ company: "", role: "", duration: "", details: "" }),
    fields: [
      { key: "company", label: "Company" },
      { key: "role", label: "Role" },
      { key: "duration", label: "Duration" },
      { key: "details", label: "Responsibilities / Achievements", textarea: true },
    ],
  },
  project: {
    stateKey: "projects",
    listId: "projectsList",
    blank: () => ({ name: "", tech: "", link: "", details: "" }),
    fields: [
      { key: "name", label: "Project Name" },
      { key: "tech", label: "Tech Stack" },
      { key: "link", label: "Link" },
      { key: "details", label: "Description", textarea: true },
    ],
  },
};
function initDynamicLists() {
  document.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.add;
      const cfg = DYNAMIC[kind];
      const key = cfg.stateKey || kind;
      state[key].push(cfg.blank());
      saveState(); renderDynamic(kind); render();
    });
  });
  Object.keys(DYNAMIC).forEach(kind => renderDynamic(kind));
}
function renderDynamic(kind) {
  const cfg = DYNAMIC[kind];
  const key = cfg.stateKey || kind;
  const list = document.getElementById(cfg.listId);
  list.innerHTML = "";
  state[key].forEach((item, idx) => {
    const div = document.createElement("div");
    div.className = "dyn-item";
    div.innerHTML = `
      <button type="button" class="remove" title="Remove">×</button>
      ${cfg.fields.map(f => `
        <label>${f.label}
          ${f.textarea
            ? `<textarea data-field="${f.key}" rows="2">${escapeAttr(item[f.key] || "")}</textarea>`
            : `<input type="text" data-field="${f.key}" value="${escapeAttr(item[f.key] || "")}" />`}
        </label>
      `).join("")}
    `;
    div.querySelector(".remove").addEventListener("click", () => {
      state[key].splice(idx, 1);
      saveState(); renderDynamic(kind); render();
    });
    div.querySelectorAll("[data-field]").forEach(input => {
      input.addEventListener("input", () => {
        item[input.dataset.field] = input.value;
        saveState(); render();
      });
    });
    list.appendChild(div);
  });
}
function escapeAttr(s) { return String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
function escapeHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
/* ============== SKILLS ============== */
function initSkills() {
  const input = document.getElementById("skillSearch");
  const addBtn = document.getElementById("addSkillBtn");
  const suggestions = document.getElementById("skillSuggestions");
  function renderSuggestions(q) {
    suggestions.innerHTML = "";
    if (!q) return;
    const matches = SKILL_LIBRARY
      .filter(s => s.toLowerCase().includes(q.toLowerCase()) && !state.skills.includes(s))
      .slice(0, 8);
    matches.forEach(s => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = s;
      b.addEventListener("click", () => { addSkill(s); input.value = ""; renderSuggestions(""); });
      suggestions.appendChild(b);
    });
  }
  input.addEventListener("input", () => renderSuggestions(input.value.trim()));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(input.value.trim()); input.value = ""; renderSuggestions(""); }
  });
  addBtn.addEventListener("click", () => { addSkill(input.value.trim()); input.value = ""; renderSuggestions(""); });
  renderChips();
}
function addSkill(s) {
  if (!s) return;
  if (state.skills.includes(s)) { toast("Skill already added", "error"); return; }
  state.skills.push(s);
  saveState(); renderChips(); render();
  toast(`Added "${s}"`, "success");
}
function renderChips() {
  const chips = document.getElementById("skillChips");
  chips.innerHTML = "";
  state.skills.forEach((s, i) => {
    const c = document.createElement("span");
    c.className = "chip";
    c.innerHTML = `${escapeHtml(s)} <button type="button" aria-label="Remove">×</button>`;
    c.querySelector("button").addEventListener("click", () => {
      state.skills.splice(i, 1);
      saveState(); renderChips(); render();
    });
    chips.appendChild(c);
  });
}
/* ============== AI SUMMARY ============== */
function initAI() {
  const btn = document.getElementById("generateSummary");
  const useBtn = document.getElementById("useSummary");
  const box = document.getElementById("aiPreview");
  const text = document.getElementById("aiSummaryText");
  btn.addEventListener("click", () => {
    const summary = generateSummary();
    if (!summary) { toast("Fill in your name, title, or skills first.", "error"); return; }
    text.textContent = "";
    box.hidden = false;
    typeInto(text, summary, 12);
    toast("AI summary generated", "success");
  });
  useBtn.addEventListener("click", () => {
    const t = text.textContent;
    const ta = document.querySelector('[name="objective"]');
    ta.value = t; state.objective = t;
    saveState(); render();
    toast("Summary applied to objective", "success");
  });
}
function generateSummary() {
  const name = state.fullName?.split(" ")[0] || "I am a professional";
  const role = state.jobTitle || "passionate professional";
  const yearsExp = state.experience.length;
  const topSkills = state.skills.slice(0, 5);
  const eduTop = state.education[0]?.degree;
  if (!state.fullName && !state.jobTitle && state.skills.length === 0) return null;
  const exp = yearsExp > 0
    ? `With hands-on experience across ${yearsExp} role${yearsExp > 1 ? "s" : ""}, `
    : "";
  const skillsLine = topSkills.length
    ? `Skilled in ${topSkills.join(", ")}, with a track record of delivering measurable impact. `
    : "";
  const eduLine = eduTop ? `Holding a ${eduTop}, ` : "";
  const closer = "Driven by curiosity and a bias for action, I focus on shipping clean, scalable solutions that solve real problems.";
  return `${exp}${eduLine}${name} is a results-oriented ${role}. ${skillsLine}${closer}`;
}
function typeInto(el, text, speed = 15) {
  let i = 0;
  (function tick() {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, speed);
  })();
}
/* ============== TEMPLATES ============== */
function initTemplates() {
  document.querySelectorAll(".template-thumb").forEach(btn => {
    if (btn.dataset.template === state.template) btn.classList.add("active");
    btn.addEventListener("click", () => {
      state.template = btn.dataset.template;
      saveState();
      document.querySelectorAll(".template-thumb").forEach(b => b.classList.toggle("active", b === btn));
      render();
      toast(`Template: ${btn.dataset.template}`, "success");
    });
  });
}
/* ============== RENDER PREVIEW + METERS ============== */
function render() {
  renderPreview();
  renderMeters();
}
function renderMeters() {
  // Profile completion
  const checks = [
    state.fullName, state.email, state.phone, state.address,
    state.linkedin, state.github, state.jobTitle, state.objective,
    state.education.length, state.skills.length, state.experience.length,
    state.projects.length, state.certifications, state.achievements, state.languages
  ];
  const done = checks.filter(Boolean).length;
  const pct = Math.round((done / checks.length) * 100);
  document.getElementById("completionBar").style.width = pct + "%";
  document.getElementById("completionPct").textContent = pct + "%";
  // Strength score
  let score = 0;
  if (state.fullName && state.email) score += 15;
  if (state.jobTitle) score += 5;
  if (state.objective && state.objective.length > 60) score += 15;
  if (state.skills.length >= 5) score += 15; else score += state.skills.length * 2;
  if (state.experience.length) score += Math.min(20, state.experience.length * 10);
  if (state.education.length) score += 10;
  if (state.projects.length) score += Math.min(15, state.projects.length * 5);
  if (state.certifications) score += 5;
  score = Math.min(100, score);
  document.getElementById("strengthBar").style.width = score + "%";
  const lbl = score < 30 ? "Weak" : score < 60 ? "Fair" : score < 85 ? "Strong" : "Excellent";
  document.getElementById("strengthLabel").textContent = `${lbl} (${score})`;
}
function renderPreview() {
  const root = document.getElementById("resumePreview");
  root.className = `resume resume--${state.template}`;
  const fn = TEMPLATES[state.template] || TEMPLATES.modern;
  root.innerHTML = fn(state);
}
/* ============== TEMPLATES (HTML) ============== */
function asList(text) {
  if (!text) return "";
  return `<ul>${text.split("\n").filter(Boolean).map(l => `<li>${escapeHtml(l)}</li>`).join("")}</ul>`;
}
function contactLine(s) {
  return [s.email, s.phone, s.address, s.linkedin, s.github].filter(Boolean).map(escapeHtml).join(" • ");
}
const TEMPLATES = {
  modern(s) {
    return `
      <aside class="col-left">
        <h1 class="name">${escapeHtml(s.fullName || "Your Name")}</h1>
        <div class="title">${escapeHtml(s.jobTitle || "Your Title")}</div>
        <div class="section-block">
          <h3 class="section-title">Contact</h3>
          ${s.email ? `<div>${escapeHtml(s.email)}</div>` : ""}
          ${s.phone ? `<div>${escapeHtml(s.phone)}</div>` : ""}
          ${s.address ? `<div>${escapeHtml(s.address)}</div>` : ""}
          ${s.linkedin ? `<div><a href="${escapeHtml(s.linkedin)}">LinkedIn</a></div>` : ""}
          ${s.github ? `<div><a href="${escapeHtml(s.github)}">GitHub</a></div>` : ""}
        </div>
        ${s.skills.length ? `
          <div class="section-block">
            <h3 class="section-title">Skills</h3>
            ${s.skills.map(k => `<span class="skill-pill">${escapeHtml(k)}</span>`).join("")}
          </div>` : ""}
        ${s.languages ? `
          <div class="section-block">
            <h3 class="section-title">Languages</h3>
            ${asList(s.languages)}
          </div>` : ""}
        ${s.certifications ? `
          <div class="section-block">
            <h3 class="section-title">Certifications</h3>
            ${asList(s.certifications)}
          </div>` : ""}
      </aside>
      <main class="col-right">
        ${s.objective ? `
          <div class="section-block">
            <h3 class="section-title">Profile</h3>
            <p>${escapeHtml(s.objective)}</p>
          </div>` : ""}
        ${s.experience.length ? `
          <div class="section-block">
            <h3 class="section-title">Experience</h3>
            ${s.experience.map(e => `
              <div class="entry">
                <div class="role">${escapeHtml(e.role || "Role")} — ${escapeHtml(e.company || "Company")}</div>
                <div class="meta">${escapeHtml(e.duration || "")}</div>
                ${e.details ? `<p>${escapeHtml(e.details)}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
        ${s.education.length ? `
          <div class="section-block">
            <h3 class="section-title">Education</h3>
            ${s.education.map(e => `
              <div class="entry">
                <div class="role">${escapeHtml(e.degree || "Degree")}</div>
                <div class="meta">${escapeHtml(e.school || "")} ${e.year ? "• " + escapeHtml(e.year) : ""}</div>
                ${e.details ? `<p>${escapeHtml(e.details)}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
        ${s.projects.length ? `
          <div class="section-block">
            <h3 class="section-title">Projects</h3>
            ${s.projects.map(p => `
              <div class="entry">
                <div class="role">${escapeHtml(p.name || "Project")}${p.tech ? " — " + escapeHtml(p.tech) : ""}</div>
                ${p.link ? `<div class="meta"><a href="${escapeHtml(p.link)}">${escapeHtml(p.link)}</a></div>` : ""}
                ${p.details ? `<p>${escapeHtml(p.details)}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
        ${s.achievements ? `
          <div class="section-block">
            <h3 class="section-title">Achievements</h3>
            ${asList(s.achievements)}
          </div>` : ""}
      </main>`;
  },
  classic(s) {
    return `
      <div class="header">
        <div class="name">${escapeHtml(s.fullName || "Your Name")}</div>
        <div class="title">${escapeHtml(s.jobTitle || "")}</div>
        <div class="contact-line">${contactLine(s)}</div>
      </div>
      ${s.objective ? `<h3 class="section-title">Summary</h3><p>${escapeHtml(s.objective)}</p>` : ""}
      ${s.experience.length ? `<h3 class="section-title">Experience</h3>${s.experience.map(e => `
        <div class="entry"><div class="role">${escapeHtml(e.role || "")} — ${escapeHtml(e.company || "")}</div>
        <div class="meta">${escapeHtml(e.duration || "")}</div>
        ${e.details ? `<p>${escapeHtml(e.details)}</p>` : ""}</div>`).join("")}` : ""}
      ${s.education.length ? `<h3 class="section-title">Education</h3>${s.education.map(e => `
        <div class="entry"><div class="role">${escapeHtml(e.degree || "")}</div>
        <div class="meta">${escapeHtml(e.school || "")} ${e.year ? "• " + escapeHtml(e.year) : ""}</div></div>`).join("")}` : ""}
      ${s.skills.length ? `<h3 class="section-title">Skills</h3><p>${s.skills.map(escapeHtml).join(" • ")}</p>` : ""}
      ${s.projects.length ? `<h3 class="section-title">Projects</h3>${s.projects.map(p => `
        <div class="entry"><div class="role">${escapeHtml(p.name || "")}${p.tech ? " — " + escapeHtml(p.tech) : ""}</div>
        ${p.details ? `<p>${escapeHtml(p.details)}</p>` : ""}</div>`).join("")}` : ""}
      ${s.certifications ? `<h3 class="section-title">Certifications</h3>${asList(s.certifications)}` : ""}
      ${s.achievements ? `<h3 class="section-title">Achievements</h3>${asList(s.achievements)}` : ""}
      ${s.languages ? `<h3 class="section-title">Languages</h3>${asList(s.languages)}` : ""}`;
  },
  minimal(s) {
    return `
      <div class="name">${escapeHtml(s.fullName || "Your Name")}</div>
      <div class="title">${escapeHtml(s.jobTitle || "")}</div>
      <div class="contact-line">${contactLine(s)}</div>
      ${s.objective ? `<p>${escapeHtml(s.objective)}</p>` : ""}
      ${s.experience.length ? `<h3 class="section-title">Experience</h3>${s.experience.map(e => `
        <div class="entry"><div class="role">${escapeHtml(e.role || "")} · ${escapeHtml(e.company || "")}</div>
        <div class="meta">${escapeHtml(e.duration || "")}</div>
        ${e.details ? `<p>${escapeHtml(e.details)}</p>` : ""}</div>`).join("")}` : ""}
      ${s.education.length ? `<h3 class="section-title">Education</h3>${s.education.map(e => `
        <div class="entry"><div class="role">${escapeHtml(e.degree || "")}</div>
        <div class="meta">${escapeHtml(e.school || "")} ${e.year ? "· " + escapeHtml(e.year) : ""}</div></div>`).join("")}` : ""}
      ${s.skills.length ? `<h3 class="section-title">Skills</h3><p>${s.skills.map(escapeHtml).join(" · ")}</p>` : ""}
      ${s.projects.length ? `<h3 class="section-title">Projects</h3>${s.projects.map(p => `
        <div class="entry"><div class="role">${escapeHtml(p.name || "")}</div>
        ${p.details ? `<p>${escapeHtml(p.details)}</p>` : ""}</div>`).join("")}` : ""}`;
  },
  bold(s) {
    return `
      <aside class="col-left">
        <h1 class="name">${escapeHtml(s.fullName || "Your Name")}</h1>
        <div class="title">${escapeHtml(s.jobTitle || "")}</div>
        <h3 class="section-title">Contact</h3>
        ${s.email ? `<div>${escapeHtml(s.email)}</div>` : ""}
        ${s.phone ? `<div>${escapeHtml(s.phone)}</div>` : ""}
        ${s.address ? `<div>${escapeHtml(s.address)}</div>` : ""}
        ${s.linkedin ? `<div><a href="${escapeHtml(s.linkedin)}">LinkedIn</a></div>` : ""}
        ${s.github ? `<div><a href="${escapeHtml(s.github)}">GitHub</a></div>` : ""}
        ${s.skills.length ? `<h3 class="section-title">Skills</h3>${s.skills.map(k => `<div>• ${escapeHtml(k)}</div>`).join("")}` : ""}
        ${s.languages ? `<h3 class="section-title">Languages</h3>${asList(s.languages)}` : ""}
      </aside>
      <main class="col-right">
        ${s.objective ? `<h3 class="section-title">Profile</h3><p>${escapeHtml(s.objective)}</p>` : ""}
        ${s.experience.length ? `<h3 class="section-title">Experience</h3>${s.experience.map(e => `
          <div class="entry"><div class="role">${escapeHtml(e.role || "")} — ${escapeHtml(e.company || "")}</div>
          <div class="meta">${escapeHtml(e.duration || "")}</div>
          ${e.details ? `<p>${escapeHtml(e.details)}</p>` : ""}</div>`).join("")}` : ""}
        ${s.education.length ? `<h3 class="section-title">Education</h3>${s.education.map(e => `
          <div class="entry"><div class="role">${escapeHtml(e.degree || "")}</div>
          <div class="meta">${escapeHtml(e.school || "")} ${e.year ? "• " + escapeHtml(e.year) : ""}</div></div>`).join("")}` : ""}
        ${s.projects.length ? `<h3 class="section-title">Projects</h3>${s.projects.map(p => `
          <div class="entry"><div class="role">${escapeHtml(p.name || "")}${p.tech ? " — " + escapeHtml(p.tech) : ""}</div>
          ${p.details ? `<p>${escapeHtml(p.details)}</p>` : ""}</div>`).join("")}` : ""}
        ${s.certifications ? `<h3 class="section-title">Certifications</h3>${asList(s.certifications)}` : ""}
        ${s.achievements ? `<h3 class="section-title">Achievements</h3>${asList(s.achievements)}` : ""}
      </main>`;
  },
};
/* ============== DOWNLOAD / PRINT ============== */
function initDownload() {
  document.getElementById("printResume").addEventListener("click", () => window.print());
  document.getElementById("clearData").addEventListener("click", () => {
    if (!confirm("Clear all resume data? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
  document.getElementById("downloadPdf").addEventListener("click", async () => {
    const btn = document.getElementById("downloadPdf");
    btn.disabled = true; const orig = btn.textContent; btn.textContent = "Generating...";
    try {
      const node = document.getElementById("resumePreview");
      const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;
      let y = 0;
      if (imgH <= pageH) {
        pdf.addImage(imgData, "PNG", 0, 0, imgW, imgH);
      } else {
        // Multi-page
        let remaining = imgH;
        while (remaining > 0) {
          pdf.addImage(imgData, "PNG", 0, y, imgW, imgH);
          remaining -= pageH;
          y -= pageH;
          if (remaining > 0) pdf.addPage();
        }
      }
      const name = (state.fullName || "resume").replace(/\s+/g, "_");
      pdf.save(`${name}.pdf`);
      toast("PDF downloaded", "success");
    } catch (e) {
      console.error(e); toast("PDF generation failed", "error");
    } finally {
      btn.disabled = false; btn.textContent = orig;
    }
  });
}
/* ============== CONTACT ============== */
function initContact() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get("cname"), email = data.get("cemail"), msg = data.get("cmsg");
    if (!name || !email || !msg) { toast("Please fill all fields", "error"); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast("Invalid email", "error"); return; }
    toast("Message sent — thank you!", "success");
    form.reset();
  });
}
/* ============== FOOTER YEAR ============== */
function initYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}