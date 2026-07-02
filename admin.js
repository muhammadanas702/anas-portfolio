/* ============================================
   ADMIN PANEL - SUPER RESPONSIVE CURSOR
   ============================================ */
const ADMIN_PASSWORD_KEY = 'adminPassword';
const DEFAULT_PASSWORD = 'admin123';
function getAdminPassword() { return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD; }

let portfolioData = {};

// ===== PREMIUM SVG ICONS =====
const I = {
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
};

// ===== DEFAULT DATA =====
const defaultData = {
  name: "Muhammad Anas", email: "anasali2988@gmail.com", phone: "+92 347 3534323",
  location: "Lahore, Punjab, Pakistan", resumeLink: "assets/resume/resume.pdf",
  hero: {
    badge: "Available for Internships", greeting: "Hi, I'm", firstName: "Muhammad",
    lastName: "Anas", typingWords: ["Software Engineering Student","Cybersecurity Enthusiast","Problem Solver","AI & Tech Explorer"],
    description: `A passionate <strong>Software Engineering student</strong> at UMT, Lahore...`,
    profileImage: ""
  },
  socials: [
    { platform: "github", url: "https://github.com/muhammadanas702" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/muhammad-anas-175828378" },
    { platform: "x", url: "https://x.com/muhammadanas_20" },
    { platform: "email", url: "mailto:anasali2988@gmail.com" }
  ],
  about: [
    { icon: "clock", title: "My Mission", text: "To become a highly skilled Software Engineer..." },
    { icon: "book", title: "Background", text: "I am Muhammad Anas..." },
    { icon: "bolt", title: "Drive & Ambition", text: "I believe that continuous learning..." },
    { icon: "users", title: "Personality", text: "I am a quick learner, detail‑oriented..." }
  ],
  skills: [
    { name: "C", level: "Intermediate", color: "#A8B9CC", progress: 80, description: "Procedural programming..." },
    { name: "C++", level: "Intermediate", color: "#00599C", progress: 75, description: "Object‑oriented..." },
    { name: "Assembly (EMU8086)", level: "Intermediate", color: "#6E4C1E", progress: 70, description: "Low‑level programming..." },
    { name: "SQL & MySQL", level: "Intermediate", color: "#4479A1", progress: 78, description: "Database design..." },
    { name: "HTML5", level: "Advanced", color: "#E34F26", progress: 92, description: "Semantic markup..." },
    { name: "CSS3", level: "Advanced", color: "#1572B6", progress: 88, description: "Advanced layouts..." },
    { name: "JavaScript", level: "Learning", color: "#F7DF1E", progress: 30, description: "Currently strengthening..." },
    { name: "Git & GitHub", level: "Intermediate", color: "#F05032", progress: 82, description: "Version control..." },
    { name: "VS Code", level: "Advanced", color: "#007ACC", progress: 90, description: "Expert IDE usage..." }
  ],
  education: [
    { start: "2024", end: "Present", title: "BS Software Engineering", institution: "UMT, Lahore", description: "Pursuing...", tags: ["Software Engineering","Cybersecurity","AI"], badge: "Current" },
    { start: "2022", end: "2024", title: "Intermediate — Pre‑Medical", institution: "The Crescent College", description: "Score: 873/1200", tags: [], badge: "" },
    { start: "2020", end: "2022", title: "Matriculation", institution: "Educational School System", description: "Score: 1002/1100", tags: [], badge: "" }
  ],
  projects: [
    { title: "Student Management System", category: "System Programming", description: "CLI‑based C++...", tech: ["C++","File Handling","OOP"], github: "https://github.com/muhammadanas702/student-management", demo: "", imageStyle: "background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);", image: "" },
    { title: "Library Database System", category: "Database", description: "MySQL database...", tech: ["SQL","MySQL"], github: "https://github.com/muhammadanas702/library-db", demo: "", imageStyle: "background: linear-gradient(135deg, #0d1b2a, #1b2838, #1a3a4a);", image: "" },
    { title: "Assembly Programs", category: "Low‑Level", description: "EMU8086 programs...", tech: ["Assembly","EMU8086"], github: "https://github.com/muhammadanas702/assembly-programs", demo: "", imageStyle: "background: linear-gradient(135deg, #1a1a2e, #1a1a3e, #1e1e3e);", image: "" },
    { title: "Portfolio Website", category: "Web Development", description: "This website...", tech: ["HTML5","CSS3","JavaScript"], github: "https://github.com/muhammadanas702/portfolio", demo: "#", imageStyle: "background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);", image: "" }
  ],
  experience: [
    { start: "2024", end: "Present", title: "Software Engineering Student", institution: "UMT", description: "Currently pursuing...", tags: ["Programming","Problem Solving"], badge: "Active", isFuture: false },
    { start: "Upcoming", end: "", title: "Future Internship", institution: "Open to Opportunities", description: "Eager to apply...", tags: ["Seeking Internship"], badge: "", isFuture: true }
  ],
  certifications: [],
  achievements: []
};

// ===== AUTH =====
function login() {
  if (document.getElementById('passwordInput').value === getAdminPassword()) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadData();
    switchTab('hero');
  } else {
    document.getElementById('loginError').textContent = 'Incorrect password!';
  }
}
function logout() { localStorage.removeItem('adminLoggedIn'); location.reload(); }
function previewPortfolio() { window.open('index.html', '_blank'); }
function resetData() { if (confirm('Reset all data to default?')) { portfolioData = JSON.parse(JSON.stringify(defaultData)); saveAllData(); location.reload(); } }

// ===== DATA =====
function loadData() {
  const stored = localStorage.getItem('portfolioData');
  portfolioData = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(defaultData));
}
function saveAllData() {
  const hb = document.getElementById('heroBadge');
  if (hb) {
    portfolioData.hero.badge = hb.value;
    portfolioData.hero.greeting = document.getElementById('heroGreeting').value;
    portfolioData.hero.firstName = document.getElementById('heroFirstName').value;
    portfolioData.hero.lastName = document.getElementById('heroLastName').value;
    portfolioData.hero.typingWords = document.getElementById('heroTypingWords').value.split(',').map(s=>s.trim());
    portfolioData.hero.description = document.getElementById('heroDescription').value;
    portfolioData.hero.profileImage = document.getElementById('heroProfileImage').value;
  }
  const ce = document.getElementById('contactEmail');
  if (ce) {
    portfolioData.email = ce.value;
    portfolioData.phone = document.getElementById('contactPhone').value;
    portfolioData.location = document.getElementById('contactLocation').value;
  }
  localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
  alert('✅ All changes saved!');
}

// ===== TABS =====
const tabs = ['hero','about','skills','education','projects','experience','certifications','achievements','contact','settings'];
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab')[tabs.indexOf(tab)].classList.add('active');
  renderTab(tab);
}

function esc(str) { return (str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function renderTab(tab) {
  const c = document.getElementById('tabContent');
  switch(tab) {
    case 'hero': c.innerHTML = heroHTML(); break;
    case 'contact': c.innerHTML = contactHTML(); break;
    case 'skills': c.innerHTML = skillsHTML(); break;
    case 'projects': c.innerHTML = projectsHTML(); break;
    case 'education': c.innerHTML = educationHTML(); break;
    case 'experience': c.innerHTML = experienceHTML(); break;
    case 'certifications': c.innerHTML = certificationsHTML(); break;
    case 'achievements': c.innerHTML = achievementsHTML(); break;
    case 'about': c.innerHTML = aboutHTML(); break;
    case 'settings': c.innerHTML = settingsHTML(); break;
  }
  refreshCursorHovers();
}

// ===== RENDER FUNCTIONS =====
function heroHTML() { return `<h3>Hero Section</h3><div class="form-group"><label>Badge</label><input id="heroBadge" value="${esc(portfolioData.hero.badge)}"></div><div class="form-group"><label>Greeting</label><input id="heroGreeting" value="${esc(portfolioData.hero.greeting)}"></div><div class="form-group"><label>First Name</label><input id="heroFirstName" value="${esc(portfolioData.hero.firstName)}"></div><div class="form-group"><label>Last Name</label><input id="heroLastName" value="${esc(portfolioData.hero.lastName)}"></div><div class="form-group"><label>Typing Words (comma separated)</label><input id="heroTypingWords" value="${portfolioData.hero.typingWords.join(', ')}"></div><div class="form-group"><label>Description (HTML allowed)</label><textarea id="heroDescription">${esc(portfolioData.hero.description)}</textarea></div><div class="form-group"><label>Profile Image URL</label><input id="heroProfileImage" value="${esc(portfolioData.hero.profileImage||'')}" placeholder="Leave empty for initials"><input type="file" accept="image/*" onchange="uploadImage('heroProfileImage',this)" style="margin-top:0.5rem;"></div>${portfolioData.hero.profileImage?`<img src="${portfolioData.hero.profileImage}" class="preview-thumb">`:''}`; }

function contactHTML() { return `<h3>Contact Info</h3><div class="form-group"><label>Email</label><input id="contactEmail" value="${esc(portfolioData.email)}"></div><div class="form-group"><label>Phone</label><input id="contactPhone" value="${esc(portfolioData.phone)}"></div><div class="form-group"><label>Location</label><input id="contactLocation" value="${esc(portfolioData.location)}"></div><h4>Social Links</h4><div id="socialsList">${portfolioData.socials.map((s,i)=>`<div class="list-item"><div class="form-group"><label>Platform</label><select onchange="portfolioData.socials[${i}].platform=this.value"><option ${s.platform==='github'?'selected':''}>github</option><option ${s.platform==='linkedin'?'selected':''}>linkedin</option><option ${s.platform==='x'?'selected':''}>x</option><option ${s.platform==='email'?'selected':''}>email</option></select></div><div class="form-group"><label>URL</label><input value="${esc(s.url)}" onchange="portfolioData.socials[${i}].url=this.value"></div><button class="remove-btn" onclick="portfolioData.socials.splice(${i},1);renderTab('contact')">${I.trash}</button></div>`).join('')}</div><button class="add-btn" onclick="portfolioData.socials.push({platform:'github',url:''});renderTab('contact')">${I.plus} Add Social</button>`; }

function skillsHTML() { return `<h3>Skills</h3>${portfolioData.skills.map((sk,i)=>`<div class="list-item"><div class="form-group"><label>Name</label><input value="${esc(sk.name)}" onchange="portfolioData.skills[${i}].name=this.value"></div><div class="form-group"><label>Level</label><input value="${esc(sk.level)}" onchange="portfolioData.skills[${i}].level=this.value"></div><div class="form-group"><label>Color (hex)</label><input value="${esc(sk.color)}" onchange="portfolioData.skills[${i}].color=this.value"></div><div class="form-group"><label>Progress (0-100)</label><input type="number" value="${sk.progress}" onchange="portfolioData.skills[${i}].progress=+this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.skills[${i}].description=this.value">${esc(sk.description)}</textarea></div><button class="remove-btn" onclick="portfolioData.skills.splice(${i},1);renderTab('skills')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.skills.push({name:'',level:'Intermediate',color:'#3B82F6',progress:50,description:''});renderTab('skills')">${I.plus} Add Skill</button>`; }

function projectsHTML() { return `<h3>Projects</h3>${portfolioData.projects.map((p,i)=>`<div class="list-item"><div class="form-group"><label>Title</label><input value="${esc(p.title)}" onchange="portfolioData.projects[${i}].title=this.value"></div><div class="form-group"><label>Category</label><input value="${esc(p.category)}" onchange="portfolioData.projects[${i}].category=this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.projects[${i}].description=this.value">${esc(p.description)}</textarea></div><div class="form-group"><label>Tech (comma separated)</label><input value="${(p.tech||[]).join(',')}" onchange="portfolioData.projects[${i}].tech=this.value.split(',').map(t=>t.trim())"></div><div class="form-group"><label>GitHub URL</label><input value="${esc(p.github||'')}" onchange="portfolioData.projects[${i}].github=this.value"></div><div class="form-group"><label>Demo URL</label><input value="${esc(p.demo||'')}" onchange="portfolioData.projects[${i}].demo=this.value"></div><div class="form-group"><label>Project Image</label><input type="file" accept="image/*" onchange="uploadImageToProject(${i},this)">${p.image?`<img src="${p.image}" class="preview-thumb">`:''}</div><button class="remove-btn" onclick="portfolioData.projects.splice(${i},1);renderTab('projects')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.projects.push({title:'',category:'',description:'',tech:[],github:'',demo:'',imageStyle:'',image:''});renderTab('projects')">${I.plus} Add Project</button>`; }

function educationHTML() { return `<h3>Education</h3>${portfolioData.education.map((e,i)=>`<div class="list-item"><div class="form-group"><label>Start</label><input value="${esc(e.start)}" onchange="portfolioData.education[${i}].start=this.value"></div><div class="form-group"><label>End</label><input value="${esc(e.end)}" onchange="portfolioData.education[${i}].end=this.value"></div><div class="form-group"><label>Title</label><input value="${esc(e.title)}" onchange="portfolioData.education[${i}].title=this.value"></div><div class="form-group"><label>Institution</label><input value="${esc(e.institution)}" onchange="portfolioData.education[${i}].institution=this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.education[${i}].description=this.value">${esc(e.description)}</textarea></div><div class="form-group"><label>Tags (comma)</label><input value="${(e.tags||[]).join(',')}" onchange="portfolioData.education[${i}].tags=this.value.split(',').map(t=>t.trim())"></div><div class="form-group"><label>Badge</label><input value="${esc(e.badge||'')}" onchange="portfolioData.education[${i}].badge=this.value"></div><button class="remove-btn" onclick="portfolioData.education.splice(${i},1);renderTab('education')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.education.push({start:'',end:'',title:'',institution:'',description:'',tags:[],badge:''});renderTab('education')">${I.plus} Add Education</button>`; }

function experienceHTML() { return `<h3>Experience</h3>${portfolioData.experience.map((e,i)=>`<div class="list-item"><div class="form-group"><label>Start</label><input value="${esc(e.start)}" onchange="portfolioData.experience[${i}].start=this.value"></div><div class="form-group"><label>End</label><input value="${esc(e.end)}" onchange="portfolioData.experience[${i}].end=this.value"></div><div class="form-group"><label>Title</label><input value="${esc(e.title)}" onchange="portfolioData.experience[${i}].title=this.value"></div><div class="form-group"><label>Institution</label><input value="${esc(e.institution)}" onchange="portfolioData.experience[${i}].institution=this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.experience[${i}].description=this.value">${esc(e.description)}</textarea></div><div class="form-group"><label>Tags (comma)</label><input value="${(e.tags||[]).join(',')}" onchange="portfolioData.experience[${i}].tags=this.value.split(',').map(t=>t.trim())"></div><div class="form-group"><label>Badge</label><input value="${esc(e.badge||'')}" onchange="portfolioData.experience[${i}].badge=this.value"></div><label style="display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem;"><input type="checkbox" ${e.isFuture?'checked':''} onchange="portfolioData.experience[${i}].isFuture=this.checked"> Future Entry</label><button class="remove-btn" onclick="portfolioData.experience.splice(${i},1);renderTab('experience')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.experience.push({start:'',end:'',title:'',institution:'',description:'',tags:[],badge:'',isFuture:false});renderTab('experience')">${I.plus} Add Experience</button>`; }

function certificationsHTML() { return `<h3>Certifications</h3>${(portfolioData.certifications||[]).map((c,i)=>`<div class="list-item"><div class="form-group"><label>Title</label><input value="${esc(c.title||'')}" onchange="portfolioData.certifications[${i}].title=this.value"></div><div class="form-group"><label>Issuer</label><input value="${esc(c.issuer||'')}" onchange="portfolioData.certifications[${i}].issuer=this.value"></div><div class="form-group"><label>Date</label><input value="${esc(c.date||'')}" onchange="portfolioData.certifications[${i}].date=this.value"></div><div class="form-group"><label>Image</label><input type="file" accept="image/*" onchange="uploadImageToCert(${i},this)">${c.image?`<img src="${c.image}" class="preview-thumb">`:''}</div><button class="remove-btn" onclick="portfolioData.certifications.splice(${i},1);renderTab('certifications')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.certifications.push({title:'',issuer:'',date:'',image:''});renderTab('certifications')">${I.plus} Add Certification</button>`; }

function achievementsHTML() { return `<h3>Achievements</h3>${(portfolioData.achievements||[]).map((a,i)=>`<div class="list-item"><div class="form-group"><label>Title</label><input value="${esc(a.title||'')}" onchange="portfolioData.achievements[${i}].title=this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.achievements[${i}].description=this.value">${esc(a.description||'')}</textarea></div><div class="form-group"><label>Date</label><input value="${esc(a.date||'')}" onchange="portfolioData.achievements[${i}].date=this.value"></div><button class="remove-btn" onclick="portfolioData.achievements.splice(${i},1);renderTab('achievements')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.achievements.push({title:'',description:'',date:''});renderTab('achievements')">${I.plus} Add Achievement</button>`; }

function aboutHTML() {
  const iconList = ['clock','book','bolt','users'];
  return `<h3>About Cards</h3>${portfolioData.about.map((a,i)=>`<div class="list-item"><div class="form-group"><label>Icon</label><select onchange="portfolioData.about[${i}].icon=this.value">${iconList.map(ic=>`<option ${a.icon===ic?'selected':''}>${ic}</option>`).join('')}</select></div><div class="form-group"><label>Title</label><input value="${esc(a.title)}" onchange="portfolioData.about[${i}].title=this.value"></div><div class="form-group"><label>Text</label><textarea onchange="portfolioData.about[${i}].text=this.value">${esc(a.text)}</textarea></div><button class="remove-btn" onclick="portfolioData.about.splice(${i},1);renderTab('about')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.about.push({icon:'clock',title:'',text:''});renderTab('about')">${I.plus} Add Card</button>`;
}

function settingsHTML() {
  return `<h3>Settings</h3>
    <div class="form-group"><label>Current Password</label><input id="currentPassword" type="password" placeholder="Enter current password"></div>
    <div class="form-group"><label>New Password</label><input id="newPassword" type="password" placeholder="Enter new password"></div>
    <div class="form-group"><label>Confirm New Password</label><input id="confirmPassword" type="password" placeholder="Confirm new password"></div>
    <button class="btn-primary" onclick="changePassword()">Change Password</button>
    <p id="settingsFeedback" style="margin-top:1rem;"></p>`;
}
function changePassword() {
  const current = document.getElementById('currentPassword').value;
  const newPass = document.getElementById('newPassword').value;
  const confirm = document.getElementById('confirmPassword').value;
  const feedback = document.getElementById('settingsFeedback');
  if (current !== getAdminPassword()) { feedback.style.color='#ff6b6b'; feedback.textContent='Current password is incorrect.'; return; }
  if (!newPass || newPass.length<4) { feedback.style.color='#ff6b6b'; feedback.textContent='New password must be at least 4 characters.'; return; }
  if (newPass !== confirm) { feedback.style.color='#ff6b6b'; feedback.textContent='Passwords do not match.'; return; }
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPass);
  feedback.style.color='#22c55e'; feedback.textContent='Password changed successfully!';
  document.getElementById('currentPassword').value = document.getElementById('newPassword').value = document.getElementById('confirmPassword').value = '';
}

// ===== IMAGE UPLOAD HELPERS =====
function uploadImage(fieldId, input) {
  const file = input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById(fieldId).value = e.target.result; portfolioData.hero.profileImage = e.target.result; renderTab('hero'); };
  reader.readAsDataURL(file);
}
function uploadImageToProject(index, input) {
  const file = input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = e => { portfolioData.projects[index].image = e.target.result; renderTab('projects'); };
  reader.readAsDataURL(file);
}
function uploadImageToCert(index, input) {
  const file = input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = e => { portfolioData.certifications[index].image = e.target.result; renderTab('certifications'); };
  reader.readAsDataURL(file);
}

// ===== SUPER RESPONSIVE CURSOR =====
const c = document.getElementById('cursor');
const cd = document.getElementById('cursorDot');
const mg = document.getElementById('mouseGlow');
let mx=0, my=0, cx=0, cy=0, dx=0, dy=0;

document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });

(function anim() {
  // Outer ring: fast follow (0.5)
  cx += (mx - cx) * 0.5;
  cy += (my - cy) * 0.5;
  c.style.left = cx+'px';
  c.style.top = cy+'px';
  // Inner dot: instant follow (0.8)
  dx += (mx - dx) * 0.8;
  dy += (my - dy) * 0.8;
  cd.style.left = dx+'px';
  cd.style.top = dy+'px';
  // Glow directly on mouse
  mg.style.left = mx+'px';
  mg.style.top = my+'px';
  requestAnimationFrame(anim);
})();

// Click effect
document.addEventListener('mousedown', () => {
  c.style.transform = 'translate(-50%, -50%) scale(0.8)';
  cd.style.transform = 'translate(-50%, -50%) scale(1.2)';
});
document.addEventListener('mouseup', () => {
  c.style.transform = 'translate(-50%, -50%) scale(1)';
  cd.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Magnetic buttons & hover
function applyMagnetic() {
  document.querySelectorAll('.btn-primary, .btn-save, .btn-danger, .btn-logout, .btn-secondary, .add-btn, .remove-btn, .tab').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX-rect.left-rect.width/2)*0.25}px, ${(e.clientY-rect.top-rect.height/2)*0.25}px)`;
      c.style.width='44px'; c.style.height='44px'; c.style.borderColor='var(--primary-blue)';
      cd.style.width='12px'; cd.style.height='12px'; cd.style.background='white';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      c.style.width='32px'; c.style.height='32px'; c.style.borderColor='rgba(255,255,255,0.6)';
      cd.style.width='8px'; cd.style.height='8px'; cd.style.background='var(--primary-blue)';
    });
  });
}

function refreshCursorHovers() {
  document.querySelectorAll('a, button, input, textarea, select, .glass-card, .list-item, .tab').forEach(el => {
    el.addEventListener('mouseenter', () => {
      c.style.width='48px'; c.style.height='48px'; c.style.borderColor='var(--primary-blue)';
      cd.style.width='12px'; cd.style.height='12px';
    });
    el.addEventListener('mouseleave', () => {
      c.style.width='32px'; c.style.height='32px'; c.style.borderColor='rgba(255,255,255,0.6)';
      cd.style.width='8px'; cd.style.height='8px';
    });
  });
  applyMagnetic();
}

document.addEventListener('DOMContentLoaded', () => { applyMagnetic(); refreshCursorHovers(); });
const dashObserver = new MutationObserver(() => {
  if (document.getElementById('dashboard').style.display === 'block') {
    applyMagnetic();
    refreshCursorHovers();
  }
});
dashObserver.observe(document.getElementById('dashboard'), { attributes: true, attributeFilter: ['style'] });