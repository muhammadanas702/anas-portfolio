/* ============================================
   ADMIN PANEL – FULL WORKING VERSION
   ============================================ */
const PW_KEY = 'adminPwHash';      // "salt:hash" (PBKDF2-SHA256) - never the plain password
const SESSION_KEY = 'adminSession';
let failedLogins = 0;
let portfolioData = {};

// ===== PREMIUM SVG ICONS =====
const I = {
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
};

// ===== HELPERS =====
const clone = o => JSON.parse(JSON.stringify(o));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hex = buf => [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
function safeImgSrc(u) { u = String(u || ''); return (/^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(u) || /^(https:\/\/|assets\/)[^\s"'<>]*$/i.test(u)) ? u : ''; }
function safeResume(u) { u = String(u || ''); return (/^data:application\/pdf;base64,[A-Za-z0-9+/=]+$/.test(u) || /^(https:\/\/|assets\/)[^\s"'<>]*$/i.test(u)) ? u : ''; }

// ===== AUTH (client-side only - see README: this is a convenience lock, not real security) =====
async function hashPw(pw, saltHex) {
  const salt = saltHex ? Uint8Array.from(saltHex.match(/../g).map(h => parseInt(h, 16))) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, key, 256);
  return hex(salt) + ':' + hex(bits);
}
async function checkPw(pw) {
  const stored = localStorage.getItem(PW_KEY);
  if (!stored) return false;
  const [salt, h] = stored.split(':');
  return (await hashPw(pw, salt)).split(':')[1] === h;
}
function initLogin() {
  try { localStorage.removeItem('adminPassword'); } catch (e) {} // old insecure plaintext password / default "admin123"
  if (!window.crypto || !crypto.subtle) {
    document.getElementById('loginError').textContent = 'Secure context required: open this page over HTTPS (or localhost).';
    return;
  }
  const first = !localStorage.getItem(PW_KEY);
  document.getElementById('loginTitle').textContent = first ? 'Create Admin Password' : 'Admin Login';
  document.getElementById('loginHint').textContent = first ? 'First time here: choose a password (min 8 characters).' : 'Enter password to access dashboard';
  if (sessionStorage.getItem(SESSION_KEY) === '1' && !first) showDashboard();
}
async function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  await loadData();
  switchTab('sections');
}
async function login() {
  const input = document.getElementById('passwordInput'), err = document.getElementById('loginError');
  const pw = input.value;
  if (!window.crypto || !crypto.subtle) return;
  if (!localStorage.getItem(PW_KEY)) {
    if (pw.length < 8) { err.textContent = 'Password must be at least 8 characters.'; return; }
    localStorage.setItem(PW_KEY, await hashPw(pw));
    sessionStorage.setItem(SESSION_KEY, '1'); input.value = ''; showDashboard(); return;
  }
  if (failedLogins) await sleep(Math.min(failedLogins * 1000, 8000)); // slow down guessing
  if (await checkPw(pw)) { failedLogins = 0; sessionStorage.setItem(SESSION_KEY, '1'); input.value = ''; err.textContent = ''; showDashboard(); }
  else { failedLogins++; err.textContent = 'Incorrect password!'; }
}
function logout() { sessionStorage.removeItem(SESSION_KEY); location.reload(); }
function previewPortfolio() { window.open('index.html', '_blank', 'noopener'); }
function resetData() {
  if (!confirm('Reset the editor to the defaults from data.js? Nothing goes live until you click Publish.')) return;
  portfolioData = clone(DEFAULT_DATA); portfolioData.sections = {}; portfolioData.theme = {};
  switchTab('sections');
}

// ===== GITHUB SYNC (makes edits global: commits data.json / images / resume to your repo) =====
const GH_KEY = 'ghCfg';
function ghCfg() {
  const d = { owner: 'muhammadanas702', repo: 'anas-portfolio', branch: 'master', token: '' };
  try { return Object.assign(d, JSON.parse(localStorage.getItem(GH_KEY) || '{}')); } catch (e) { return d; }
}
const b64 = str => btoa(unescape(encodeURIComponent(str)));
async function ghPut(path, contentB64, msg) {
  const c = ghCfg();
  if (!c.token) throw new Error('Add your GitHub token in the "Connect" tab first.');
  const url = 'https://api.github.com/repos/' + encodeURIComponent(c.owner) + '/' + encodeURIComponent(c.repo) + '/contents/' + path;
  const h = { Authorization: 'Bearer ' + c.token, Accept: 'application/vnd.github+json' };
  let sha;
  const g = await fetch(url + '?ref=' + encodeURIComponent(c.branch), { headers: h });
  if (g.ok) sha = (await g.json()).sha; else if (g.status !== 404) throw new Error('GitHub error ' + g.status + ' - check token, owner, repo and branch.');
  const r = await fetch(url, { method: 'PUT', headers: h, body: JSON.stringify({ message: msg, content: contentB64, branch: c.branch, sha }) });
  if (!r.ok) throw new Error('GitHub error ' + r.status + ': ' + (((await r.json().catch(() => ({}))).message) || ''));
}
async function publishData() {
  collectCurrentTab();
  try { await ghPut('data.json', b64(JSON.stringify(portfolioData, null, 2)), 'Update portfolio content via admin panel'); alert('✅ Published! It will be live for everyone in about 1 minute.'); }
  catch (e) { alert('❌ ' + e.message); }
}
async function pushImage(prefix, dataUrl) {
  const path = 'assets/images/' + prefix + '-' + Date.now() + '.jpg';
  await ghPut(path, dataUrl.split(',')[1], 'Upload ' + path);
  return path;
}
function saveGh() {
  const v = id => document.getElementById(id).value.trim();
  if (!/^[\w.-]+$/.test(v('ghOwner')) || !/^[\w.-]+$/.test(v('ghRepo')) || !/^[\w./-]+$/.test(v('ghBranch'))) { alert('Owner / repo / branch contain invalid characters.'); return; }
  const old = ghCfg();
  localStorage.setItem(GH_KEY, JSON.stringify({ owner: v('ghOwner'), repo: v('ghRepo'), branch: v('ghBranch'), token: v('ghToken') || old.token }));
  alert('Saved in this browser.');
}
function connectHTML() {
  const c = ghCfg();
  return `<h3>Connect to GitHub (needed to Publish)</h3>
    <p style="color:#94A3B8;font-size:.9rem">Create a fine-grained token: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → only this repo → <b>Contents: Read and write</b>. It is stored only in this browser.</p>
    <div class="form-group"><label>Owner</label><input id="ghOwner" value="${esc(c.owner)}"></div>
    <div class="form-group"><label>Repository</label><input id="ghRepo" value="${esc(c.repo)}"></div>
    <div class="form-group"><label>Branch</label><input id="ghBranch" value="${esc(c.branch)}"></div>
    <div class="form-group"><label>Token ${c.token ? '(saved - leave empty to keep)' : ''}</label><input id="ghToken" type="password" autocomplete="off" placeholder="github_pat_..."></div>
    <button class="btn-primary" onclick="saveGh()">Save connection</button>`;
}

// ===== DATA =====
async function loadData() {
  const base = clone(DEFAULT_DATA); let d = null;
  try { const r = await fetch('data.json?t=' + Date.now(), { cache: 'no-store' }); if (r.ok) d = await r.json(); } catch (e) {}
  portfolioData = (d && typeof d === 'object' && !Array.isArray(d)) ? Object.assign(base, d) : base;
  portfolioData.hero = Object.assign(clone(DEFAULT_DATA.hero), portfolioData.hero || {});
  if (!Array.isArray(portfolioData.hero.typingWords)) portfolioData.hero.typingWords = [];
  ['socials','about','skills','education','projects','experience','certifications','achievements'].forEach(k => { if (!Array.isArray(portfolioData[k])) portfolioData[k] = []; });
  portfolioData.sections = portfolioData.sections || {}; portfolioData.theme = portfolioData.theme || {};
}
function persist() {
  try { localStorage.setItem('portfolioData', JSON.stringify(portfolioData)); return true; }
  catch (e) { alert('Could not save: browser storage is full or blocked. Use smaller images / PDF.'); return false; }
}
// Read whatever form fields of the CURRENT tab are on screen into portfolioData (so switching tabs never loses edits)
function collectCurrentTab() {
  const g = id => document.getElementById(id);
  if (g('heroBadge')) {
    const h = portfolioData.hero;
    h.badge = g('heroBadge').value; h.greeting = g('heroGreeting').value;
    h.firstName = g('heroFirstName').value; h.lastName = g('heroLastName').value;
    h.typingWords = g('heroTypingWords').value.split(',').map(x => x.trim()).filter(Boolean);
    h.description = g('heroDescription').value;
    const img = g('heroProfileImage').value.trim();
    if (img === '' || safeImgSrc(img)) h.profileImage = img;
  }
  if (g('contactEmail')) {
    portfolioData.email = g('contactEmail').value.trim();
    portfolioData.phone = g('contactPhone').value.trim();
    portfolioData.location = g('contactLocation').value.trim();
  }
  if (g('resumeLabel')) portfolioData.resumeLabel = g('resumeLabel').value.trim().slice(0, 40) || 'Download Resume';
  if (g('contactKey')) { const k = g('contactKey').value.trim(); if (k === '' || /^[0-9a-f-]{20,}$/i.test(k)) portfolioData.contactKey = k; else alert('That does not look like a valid Web3Forms access key.'); }
  if (g('resumeLink')) {
    const r = g('resumeLink').value.trim();
    if (safeResume(r)) portfolioData.resumeLink = r; else if (r) alert('Resume link must start with https:// or assets/ - keeping the previous value.');
  }
}
function saveAllData() { return publishData(); }

// ===== TABS =====
const tabs = ['sections','hero','about','skills','education','projects','experience','certifications','achievements','contact','resume','theme','connect','settings'];
function switchTab(tab) {
  collectCurrentTab();
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab')[tabs.indexOf(tab)].classList.add('active');
  renderTab(tab);
}

function esc(str) { return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

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
    case 'resume': c.innerHTML = resumeHTML(); break;
    case 'settings': c.innerHTML = settingsHTML(); break;
    case 'sections': c.innerHTML = sectionsHTML(); break;
    case 'theme': c.innerHTML = themeHTML(); break;
    case 'connect': c.innerHTML = connectHTML(); break;
  }
}

// ===== RENDER FUNCTIONS =====
function heroHTML() { return `<h3>Hero Section</h3><div class="form-group"><label>Badge</label><input id="heroBadge" value="${esc(portfolioData.hero.badge)}"></div><div class="form-group"><label>Greeting</label><input id="heroGreeting" value="${esc(portfolioData.hero.greeting)}"></div><div class="form-group"><label>First Name</label><input id="heroFirstName" value="${esc(portfolioData.hero.firstName)}"></div><div class="form-group"><label>Last Name</label><input id="heroLastName" value="${esc(portfolioData.hero.lastName)}"></div><div class="form-group"><label>Typing Words (comma separated)</label><input id="heroTypingWords" value="${esc(portfolioData.hero.typingWords.join(', '))}"></div><div class="form-group"><label>Description (HTML allowed)</label><textarea id="heroDescription">${esc(portfolioData.hero.description)}</textarea></div><div class="form-group"><label>Profile Image URL</label><input id="heroProfileImage" value="${esc(portfolioData.hero.profileImage||'')}" placeholder="Leave empty for initials"><input type="file" accept="image/*" onchange="uploadImage('heroProfileImage',this)" style="margin-top:0.5rem;"></div>${safeImgSrc(portfolioData.hero.profileImage)?`<img src="${esc(portfolioData.hero.profileImage)}" class="preview-thumb" alt="">`:''}`; }

function contactHTML() { return `<h3>Contact Info</h3><div class="form-group"><label>Email</label><input id="contactEmail" value="${esc(portfolioData.email)}"></div><div class="form-group"><label>Phone</label><input id="contactPhone" value="${esc(portfolioData.phone)}"></div><div class="form-group"><label>Location</label><input id="contactLocation" value="${esc(portfolioData.location)}"></div><div class="form-group"><label>Web3Forms access key (makes the contact form email you directly - get a free key at web3forms.com)</label><input id="contactKey" value="${esc(portfolioData.contactKey||'')}" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"></div><h4>Social Links</h4><div id="socialsList">${portfolioData.socials.map((s,i)=>`<div class="list-item"><div class="form-group"><label>Platform</label><select onchange="portfolioData.socials[${i}].platform=this.value"><option ${s.platform==='github'?'selected':''}>github</option><option ${s.platform==='linkedin'?'selected':''}>linkedin</option><option ${s.platform==='x'?'selected':''}>x</option><option ${s.platform==='email'?'selected':''}>email</option></select></div><div class="form-group"><label>URL</label><input value="${esc(s.url)}" onchange="portfolioData.socials[${i}].url=this.value"></div><button class="remove-btn" onclick="portfolioData.socials.splice(${i},1);renderTab('contact')">${I.trash}</button></div>`).join('')}</div><button class="add-btn" onclick="portfolioData.socials.push({platform:'github',url:''});renderTab('contact')">${I.plus} Add Social</button>`; }

function skillsHTML() { return `<h3>Skills</h3>${portfolioData.skills.map((sk,i)=>`<div class="list-item"><label style="display:flex;gap:.5rem;align-items:center;margin-bottom:.6rem;color:#94A3B8;font-size:.85rem"><input type="checkbox" ${portfolioData.skills[i].hidden?'checked':''} onchange="portfolioData.skills[${i}].hidden=this.checked"> Hide on site</label><div class="form-group"><label>Name</label><input value="${esc(sk.name)}" onchange="portfolioData.skills[${i}].name=this.value"></div><div class="form-group"><label>Level</label><input value="${esc(sk.level)}" onchange="portfolioData.skills[${i}].level=this.value"></div><div class="form-group"><label>Color (hex)</label><input value="${esc(sk.color)}" onchange="portfolioData.skills[${i}].color=/^#[0-9a-f]{6}$/i.test(this.value.trim())?this.value.trim():'#3B82F6'"></div><div class="form-group"><label>Progress (0-100)</label><input type="number" value="${esc(sk.progress)}" min="0" max="100" onchange="portfolioData.skills[${i}].progress=Math.max(0,Math.min(100,+this.value||0))"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.skills[${i}].description=this.value">${esc(sk.description)}</textarea></div><button class="remove-btn" onclick="portfolioData.skills.splice(${i},1);renderTab('skills')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.skills.push({name:'',level:'Intermediate',color:'#3B82F6',progress:50,description:''});renderTab('skills')">${I.plus} Add Skill</button>`; }

function projectsHTML() { return `<h3>Projects</h3>${portfolioData.projects.map((p,i)=>`<div class="list-item"><label style="display:flex;gap:.5rem;align-items:center;margin-bottom:.6rem;color:#94A3B8;font-size:.85rem"><input type="checkbox" ${portfolioData.projects[i].hidden?'checked':''} onchange="portfolioData.projects[${i}].hidden=this.checked"> Hide on site</label><div class="form-group"><label>Title</label><input value="${esc(p.title)}" onchange="portfolioData.projects[${i}].title=this.value"></div><div class="form-group"><label>Category</label><input value="${esc(p.category)}" onchange="portfolioData.projects[${i}].category=this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.projects[${i}].description=this.value">${esc(p.description)}</textarea></div><div class="form-group"><label>Tech (comma separated)</label><input value="${esc((p.tech||[]).join(','))}" onchange="portfolioData.projects[${i}].tech=this.value.split(',').map(t=>t.trim()).filter(Boolean)"></div><div class="form-group"><label>GitHub URL</label><input value="${esc(p.github||'')}" onchange="portfolioData.projects[${i}].github=this.value"></div><div class="form-group"><label>Demo URL</label><input value="${esc(p.demo||'')}" onchange="portfolioData.projects[${i}].demo=this.value"></div><div class="form-group"><label>Project Image</label><input type="file" accept="image/*" onchange="uploadImageToProject(${i},this)">${safeImgSrc(p.image)?`<img src="${esc(p.image)}" class="preview-thumb" alt="">`:''}</div><button class="remove-btn" onclick="portfolioData.projects.splice(${i},1);renderTab('projects')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.projects.push({title:'',category:'',description:'',tech:[],github:'',demo:'',imageStyle:'',image:''});renderTab('projects')">${I.plus} Add Project</button>`; }

function educationHTML() { return `<h3>Education</h3>${portfolioData.education.map((e,i)=>`<div class="list-item"><label style="display:flex;gap:.5rem;align-items:center;margin-bottom:.6rem;color:#94A3B8;font-size:.85rem"><input type="checkbox" ${portfolioData.education[i].hidden?'checked':''} onchange="portfolioData.education[${i}].hidden=this.checked"> Hide on site</label><div class="form-group"><label>Start</label><input value="${esc(e.start)}" onchange="portfolioData.education[${i}].start=this.value"></div><div class="form-group"><label>End</label><input value="${esc(e.end)}" onchange="portfolioData.education[${i}].end=this.value"></div><div class="form-group"><label>Title</label><input value="${esc(e.title)}" onchange="portfolioData.education[${i}].title=this.value"></div><div class="form-group"><label>Institution</label><input value="${esc(e.institution)}" onchange="portfolioData.education[${i}].institution=this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.education[${i}].description=this.value">${esc(e.description)}</textarea></div><div class="form-group"><label>Tags (comma)</label><input value="${esc((e.tags||[]).join(','))}" onchange="portfolioData.education[${i}].tags=this.value.split(',').map(t=>t.trim()).filter(Boolean)"></div><div class="form-group"><label>Badge</label><input value="${esc(e.badge||'')}" onchange="portfolioData.education[${i}].badge=this.value"></div><button class="remove-btn" onclick="portfolioData.education.splice(${i},1);renderTab('education')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.education.push({start:'',end:'',title:'',institution:'',description:'',tags:[],badge:''});renderTab('education')">${I.plus} Add Education</button>`; }

function experienceHTML() { return `<h3>Experience</h3>${portfolioData.experience.map((e,i)=>`<div class="list-item"><label style="display:flex;gap:.5rem;align-items:center;margin-bottom:.6rem;color:#94A3B8;font-size:.85rem"><input type="checkbox" ${portfolioData.experience[i].hidden?'checked':''} onchange="portfolioData.experience[${i}].hidden=this.checked"> Hide on site</label><div class="form-group"><label>Start</label><input value="${esc(e.start)}" onchange="portfolioData.experience[${i}].start=this.value"></div><div class="form-group"><label>End</label><input value="${esc(e.end)}" onchange="portfolioData.experience[${i}].end=this.value"></div><div class="form-group"><label>Title</label><input value="${esc(e.title)}" onchange="portfolioData.experience[${i}].title=this.value"></div><div class="form-group"><label>Institution</label><input value="${esc(e.institution)}" onchange="portfolioData.experience[${i}].institution=this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.experience[${i}].description=this.value">${esc(e.description)}</textarea></div><div class="form-group"><label>Tags (comma)</label><input value="${esc((e.tags||[]).join(','))}" onchange="portfolioData.experience[${i}].tags=this.value.split(',').map(t=>t.trim()).filter(Boolean)"></div><div class="form-group"><label>Badge</label><input value="${esc(e.badge||'')}" onchange="portfolioData.experience[${i}].badge=this.value"></div><label style="display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem;"><input type="checkbox" ${e.isFuture?'checked':''} onchange="portfolioData.experience[${i}].isFuture=this.checked"> Future Entry</label><button class="remove-btn" onclick="portfolioData.experience.splice(${i},1);renderTab('experience')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.experience.push({start:'',end:'',title:'',institution:'',description:'',tags:[],badge:'',isFuture:false});renderTab('experience')">${I.plus} Add Experience</button>`; }

function certificationsHTML() { return `<h3>Certifications</h3>${(portfolioData.certifications||[]).map((c,i)=>`<div class="list-item"><label style="display:flex;gap:.5rem;align-items:center;margin-bottom:.6rem;color:#94A3B8;font-size:.85rem"><input type="checkbox" ${portfolioData.certifications[i].hidden?'checked':''} onchange="portfolioData.certifications[${i}].hidden=this.checked"> Hide on site</label><div class="form-group"><label>Title</label><input value="${esc(c.title||'')}" onchange="portfolioData.certifications[${i}].title=this.value"></div><div class="form-group"><label>Issuer</label><input value="${esc(c.issuer||'')}" onchange="portfolioData.certifications[${i}].issuer=this.value"></div><div class="form-group"><label>Date</label><input value="${esc(c.date||'')}" onchange="portfolioData.certifications[${i}].date=this.value"></div><div class="form-group"><label>Image</label><input type="file" accept="image/*" onchange="uploadImageToCert(${i},this)">${safeImgSrc(c.image)?`<img src="${esc(c.image)}" class="preview-thumb" alt="">`:''}</div><button class="remove-btn" onclick="portfolioData.certifications.splice(${i},1);renderTab('certifications')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.certifications.push({title:'',issuer:'',date:'',image:''});renderTab('certifications')">${I.plus} Add Certification</button>`; }

function achievementsHTML() { return `<h3>Achievements</h3>${(portfolioData.achievements||[]).map((a,i)=>`<div class="list-item"><label style="display:flex;gap:.5rem;align-items:center;margin-bottom:.6rem;color:#94A3B8;font-size:.85rem"><input type="checkbox" ${portfolioData.achievements[i].hidden?'checked':''} onchange="portfolioData.achievements[${i}].hidden=this.checked"> Hide on site</label><div class="form-group"><label>Title</label><input value="${esc(a.title||'')}" onchange="portfolioData.achievements[${i}].title=this.value"></div><div class="form-group"><label>Description</label><textarea onchange="portfolioData.achievements[${i}].description=this.value">${esc(a.description||'')}</textarea></div><div class="form-group"><label>Date</label><input value="${esc(a.date||'')}" onchange="portfolioData.achievements[${i}].date=this.value"></div><button class="remove-btn" onclick="portfolioData.achievements.splice(${i},1);renderTab('achievements')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.achievements.push({title:'',description:'',date:''});renderTab('achievements')">${I.plus} Add Achievement</button>`; }

function aboutHTML() {
  const iconList = ['clock','book','bolt','users'];
  return `<h3>About Cards</h3>${portfolioData.about.map((a,i)=>`<div class="list-item"><label style="display:flex;gap:.5rem;align-items:center;margin-bottom:.6rem;color:#94A3B8;font-size:.85rem"><input type="checkbox" ${portfolioData.about[i].hidden?'checked':''} onchange="portfolioData.about[${i}].hidden=this.checked"> Hide on site</label><div class="form-group"><label>Icon</label><select onchange="portfolioData.about[${i}].icon=this.value">${iconList.map(ic=>`<option ${a.icon===ic?'selected':''}>${ic}</option>`).join('')}</select></div><div class="form-group"><label>Title</label><input value="${esc(a.title)}" onchange="portfolioData.about[${i}].title=this.value"></div><div class="form-group"><label>Text</label><textarea onchange="portfolioData.about[${i}].text=this.value">${esc(a.text)}</textarea></div><button class="remove-btn" onclick="portfolioData.about.splice(${i},1);renderTab('about')">${I.trash}</button></div>`).join('')}<button class="add-btn" onclick="portfolioData.about.push({icon:'clock',title:'',text:''});renderTab('about')">${I.plus} Add Card</button>`;
}

const SECTION_LABELS = { about: 'About', skills: 'Skills', education: 'Education', projects: 'Projects', experience: 'Experience', certifications: 'Certifications', achievements: 'Achievements', contact: 'Contact' };
function sectionsHTML() {
  const sec = portfolioData.sections || {};
  const row = (label, checked, onchange, edit) => `<div class="list-item" style="display:flex;align-items:center;gap:.8rem;"><input type="checkbox" ${checked ? 'checked' : ''} onchange="${onchange}"><span>${label}</span>${edit ? `<button class="add-btn" style="margin:0 0 0 auto" onclick="switchTab('${edit}')">Edit</button>` : ''}</div>`;
  return `<h3>All Options</h3><p style="color:#94A3B8;font-size:.9rem">Tick = visible on the site, untick = hidden (you can show it again any time). Remember to click <b>Publish</b>. Individual items can also be hidden inside each tab.</p>`
    + Object.entries(SECTION_LABELS).map(([k, l]) => row(l + ' section', sec[k] !== false, `portfolioData.sections=portfolioData.sections||{};portfolioData.sections.${k}=this.checked`, k)).join('')
    + row('"Download Resume" button', portfolioData.resumeEnabled !== false, 'portfolioData.resumeEnabled=this.checked', 'resume');
}
function themeHTML() {
  return `<h3>Theme</h3><div class="form-group"><label>Main accent colour</label><input type="color" value="${esc(portfolioData.theme.primary || '#3B82F6')}" onchange="portfolioData.theme=Object.assign({},portfolioData.theme,{primary:this.value})"></div><p style="color:#94A3B8;font-size:.9rem">Click Publish to apply to the live site.</p>`;
}
// ===== RESUME TAB =====
function resumeHTML() {
  const rl = portfolioData.resumeLink || 'assets/resume/resume.pdf';
  return `<h3>Resume / CV</h3>
    <label style="display:flex;gap:.6rem;align-items:center;margin-bottom:1rem"><input type="checkbox" ${portfolioData.resumeEnabled === false ? '' : 'checked'} onchange="portfolioData.resumeEnabled=this.checked"> Show the "Download Resume" button on the site</label>
    <div class="form-group"><label>Button label</label><input id="resumeLabel" value="${esc(portfolioData.resumeLabel || 'Download Resume')}"></div>
    <div class="form-group"><label>Resume link (https://... or assets/...)</label><input id="resumeLink" value="${esc(rl)}"></div>
    <div class="form-group"><label>Upload a new PDF (max 5MB, saved straight to your GitHub repo)</label><input type="file" accept=".pdf" onchange="uploadResume(this)"></div>
    <p style="color:#94A3B8;font-size:.85rem">After uploading, the live site updates in about 1 minute.</p>
    ${safeResume(rl) ? `<a class="add-btn" href="${esc(safeResume(rl))}" target="_blank" rel="noopener" style="display:inline-block;text-decoration:none">Open current resume</a>` : ''}`;
}

async function uploadResume(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') { alert('Please select a valid PDF file.'); input.value = ''; return; }
  if (file.size > 5 * 1024 * 1024) { alert('File is larger than 5MB.'); input.value = ''; return; }
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      collectCurrentTab();
      await ghPut('assets/resume/resume.pdf', e.target.result.split(',')[1], 'Update resume');
      portfolioData.resumeLink = 'assets/resume/resume.pdf';
      renderTab('resume'); alert('✅ Resume uploaded. Live in about 1 minute.');
    } catch (err) { alert('❌ ' + err.message); }
  };
  reader.readAsDataURL(file);
}

// ===== SETTINGS =====
function settingsHTML() {
  return `<h3>Settings</h3>
    <div class="form-group"><label>Current Password</label><input id="currentPassword" type="password" placeholder="Enter current password"></div>
    <div class="form-group"><label>New Password</label><input id="newPassword" type="password" placeholder="Enter new password"></div>
    <div class="form-group"><label>Confirm New Password</label><input id="confirmPassword" type="password" placeholder="Confirm new password"></div>
    <button class="btn-primary" onclick="changePassword()">Change Password</button>
    <p id="settingsFeedback" style="margin-top:1rem;"></p>`;
}
async function changePassword() {
  const v = id => document.getElementById(id).value, fb = document.getElementById('settingsFeedback');
  const bad = m => { fb.style.color = '#ff6b6b'; fb.textContent = m; };
  if (!(await checkPw(v('currentPassword')))) return bad('Current password is incorrect.');
  if (v('newPassword').length < 8) return bad('New password must be at least 8 characters.');
  if (v('newPassword') !== v('confirmPassword')) return bad('Passwords do not match.');
  localStorage.setItem(PW_KEY, await hashPw(v('newPassword')));
  fb.style.color = '#22c55e'; fb.textContent = 'Password changed successfully!';
  ['currentPassword','newPassword','confirmPassword'].forEach(id => document.getElementById(id).value = '');
}

// ===== IMAGE UPLOAD HELPERS (validated + downscaled so localStorage does not overflow) =====
function readImage(file, cb) {
  if (!file) return;
  if (!/^image\/(png|jpe?g|gif|webp)$/.test(file.type)) { alert('Please choose a PNG, JPG, GIF or WebP image.'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 900 / Math.max(img.width, img.height));
      const cv = document.createElement('canvas');
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      cb(cv.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => alert('Could not read that image.');
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function uploadImage(fieldId, input) {
  readImage(input.files[0], async d => { try { collectCurrentTab(); portfolioData.hero.profileImage = await pushImage('profile', d); renderTab('hero'); } catch (e) { alert('❌ ' + e.message); } });
}
function uploadImageToProject(index, input) {
  readImage(input.files[0], async d => { try { portfolioData.projects[index].image = await pushImage('project', d); renderTab('projects'); } catch (e) { alert('❌ ' + e.message); } });
}
function uploadImageToCert(index, input) {
  readImage(input.files[0], async d => { try { portfolioData.certifications[index].image = await pushImage('cert', d); renderTab('certifications'); } catch (e) { alert('❌ ' + e.message); } });
}

// ===== CURSOR + MAGNETIC EFFECT (one delegated set of listeners, fine pointers only) =====
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cur = document.getElementById('cursor'), dot = document.getElementById('cursorDot'), glow = document.getElementById('mouseGlow');
  let mx = 0, my = 0, cx = 0, cy = 0, dx = 0, dy = 0;
  const HOVER = 'a, button, input, textarea, select, .tab, .list-item';
  const MAGNET = '.btn-primary, .btn-save, .btn-danger, .btn-logout, .btn-secondary, .add-btn, .remove-btn, .tab';
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    const m = e.target.closest && e.target.closest(MAGNET);
    if (m) { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`; }
  });
  document.addEventListener('mouseover', e => {
    if (e.target.closest && e.target.closest(HOVER)) { cur.style.width = cur.style.height = '48px'; cur.style.borderColor = 'var(--primary-blue)'; dot.style.width = dot.style.height = '12px'; }
  });
  document.addEventListener('mouseout', e => {
    const m = e.target.closest && e.target.closest(MAGNET);
    if (m && !m.contains(e.relatedTarget)) m.style.transform = '';
    if (e.target.closest && e.target.closest(HOVER)) { cur.style.width = cur.style.height = '32px'; cur.style.borderColor = 'rgba(255,255,255,0.6)'; dot.style.width = dot.style.height = '8px'; }
  });
  document.addEventListener('mousedown', () => { cur.style.transform = 'translate(-50%, -50%) scale(0.8)'; dot.style.transform = 'translate(-50%, -50%) scale(1.2)'; });
  document.addEventListener('mouseup', () => { cur.style.transform = 'translate(-50%, -50%) scale(1)'; dot.style.transform = 'translate(-50%, -50%) scale(1)'; });
  (function anim() {
    cx += (mx - cx) * 0.5; cy += (my - cy) * 0.5; dx += (mx - dx) * 0.8; dy += (my - dy) * 0.8;
    cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
    glow.style.left = mx + 'px'; glow.style.top = my + 'px';
    requestAnimationFrame(anim);
  })();
}

initLogin();
