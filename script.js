/* ============================================
   PREMIUM PORTFOLIO SCRIPTS + ADMIN SYNC
   Muhammad Anas - Software Engineering Student
   ============================================ */

// ===== ADMIN DATA SYNC =====
let PORTFOLIO_DATA = null;

// Check if admin data exists in localStorage
(function loadAdminData() {
    const stored = localStorage.getItem('portfolioData');
    if (stored) {
        try {
            PORTFOLIO_DATA = JSON.parse(stored);
        } catch (e) {
            PORTFOLIO_DATA = null;
        }
    }
})();

// ===== FALLBACK CONFIG (used if no admin data) =====
const CONFIG = PORTFOLIO_DATA?.hero?.typingWords ? {
    typingWords: PORTFOLIO_DATA.hero.typingWords,
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseTime: 2000
} : {
    typingWords: [
        'Software Engineering Student',
        'Cybersecurity Enthusiast',
        'Problem Solver',
        'AI & Tech Explorer'
    ],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseTime: 2000
};

// ===== DOM ELEMENTS =====
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileOverlay = document.getElementById('mobileOverlay');
const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
const mouseGlow = document.getElementById('mouseGlow');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const typingText = document.getElementById('typingText');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const currentYearSpan = document.getElementById('currentYear');
let revealElements = document.querySelectorAll('[data-reveal]');
let skillProgressBars = document.querySelectorAll('.skill-progress-bar');
let magneticBtns = document.querySelectorAll('[data-magnetic]');

// ===== ADMIN REBUILD FUNCTIONS =====
function rebuildAllSections() {
    if (!PORTFOLIO_DATA) return;

    // Hero Section
    if (PORTFOLIO_DATA.hero) {
        const h = PORTFOLIO_DATA.hero;
        const badgeEl = document.querySelector('.hero-badge');
        if (badgeEl) badgeEl.innerHTML = `<span class="badge-dot"></span> ${h.badge || 'Available for Internships'}`;
        const greetingEl = document.querySelector('.hero-greeting');
        if (greetingEl) greetingEl.textContent = h.greeting || "Hi, I'm";
        const firstNameEl = document.querySelector('.name-gradient');
        if (firstNameEl) firstNameEl.textContent = h.firstName || 'Muhammad';
        const lastNameEl = document.querySelector('.name-white');
        if (lastNameEl) lastNameEl.textContent = h.lastName || 'Anas';
        const descEl = document.querySelector('.hero-description');
        if (descEl) descEl.innerHTML = h.description || '';
        if (typingText) typingText.textContent = '';

        const imgContainer = document.getElementById('heroProfileImage');
        if (imgContainer) {
            if (h.profileImage) {
                imgContainer.innerHTML = `<img src="${h.profileImage}" alt="Muhammad Anas" class="hero-profile-img">`;
            } else {
                imgContainer.innerHTML = `<div class="profile-avatar"><span class="profile-initials">MA</span></div>`;
            }
        }
    }

    // Social links update in hero and contact
    if (PORTFOLIO_DATA.socials) {
        document.querySelectorAll('.hero-socials, .contact-social-icons').forEach(container => {
            container.innerHTML = PORTFOLIO_DATA.socials.map(s => {
                let icon = '';
                switch(s.platform) {
                    case 'github': icon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>`; break;
                    case 'linkedin': icon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`; break;
                    case 'x': icon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`; break;
                    case 'email': icon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>`; break;
                }
                return `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-icon magnetic-btn" data-magnetic aria-label="${s.platform}">${icon}</a>`;
            }).join('');
        });
    }

    // About Section
    if (PORTFOLIO_DATA.about && PORTFOLIO_DATA.about.length > 0) {
        const aboutGrid = document.querySelector('.about-grid');
        if (aboutGrid) {
            const icons = {
                clock: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
                book: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
                bolt: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
                users: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
            };
            aboutGrid.innerHTML = PORTFOLIO_DATA.about.map(card => `
                <div class="about-card glass-card" data-reveal>
                    <div class="about-card-icon">${icons[card.icon] || icons.clock}</div>
                    <h3>${card.title}</h3>
                    <p>${card.text}</p>
                </div>
            `).join('');
        }
    }

    // Skills Section
    if (PORTFOLIO_DATA.skills && PORTFOLIO_DATA.skills.length > 0) {
        const skillsGrid = document.querySelector('.skills-grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = PORTFOLIO_DATA.skills.map(skill => {
                const hex = skill.color || '#3B82F6';
                const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
                return `
                <div class="skill-card glass-card" data-reveal>
                    <div class="skill-header">
                        <div class="skill-icon" style="background: rgba(${r},${g},${b},0.15);">
                            <span style="font-weight:bold;color:${hex};font-size:1.2rem;">${skill.name.substring(0,3)}</span>
                        </div>
                        <span class="skill-level">${skill.level}</span>
                    </div>
                    <h3>${skill.name}</h3>
                    <p>${skill.description}</p>
                    <div class="skill-progress"><div class="skill-progress-bar" data-progress="${skill.progress}" style="--progress-color: ${hex};"></div></div>
                </div>`;
            }).join('');
        }
    }

    // Education Timeline
    if (PORTFOLIO_DATA.education && PORTFOLIO_DATA.education.length > 0) {
        const eduTimeline = document.querySelector('#education .timeline');
        if (eduTimeline) {
            eduTimeline.innerHTML = PORTFOLIO_DATA.education.map((item, i) => {
                const isLast = i === PORTFOLIO_DATA.education.length - 1;
                const badge = item.badge ? `<div class="timeline-badge">${item.badge}</div>` : '';
                const tags = item.tags && item.tags.length > 0 ? `<div class="timeline-tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</div>` : '';
                return `
                <div class="timeline-item" data-reveal>
                    <div class="timeline-marker">
                        <div class="timeline-dot ${isLast ? 'timeline-dot-end' : ''}"></div>
                        ${!isLast ? '<div class="timeline-line"></div>' : ''}
                    </div>
                    <div class="timeline-card glass-card">
                        ${badge}
                        <span class="timeline-date">${item.start} — ${item.end}</span>
                        <h3>${item.title}</h3>
                        <p class="timeline-institution">${item.institution}</p>
                        <p class="timeline-desc">${item.description}</p>
                        ${tags}
                    </div>
                </div>`;
            }).join('');
        }
    }

    // Projects Section
    if (PORTFOLIO_DATA.projects && PORTFOLIO_DATA.projects.length > 0) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = PORTFOLIO_DATA.projects.map(project => {
                const techTags = (project.tech || []).map(t => `<span>${t}</span>`).join('');
                const githubLink = project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link github-link"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>GitHub</a>` : '';
                const demoLink = project.demo ? `<a href="${project.demo}" class="project-link demo-link"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Live Demo</a>` : '';
                const imageContent = project.image ? `<img src="${project.image}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;">` : `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
                return `
                <div class="project-card glass-card" data-reveal>
                    <div class="project-image-wrapper">
                        <div class="project-image-placeholder" style="${project.imageStyle || 'background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);'}">
                            ${imageContent}
                        </div>
                        <div class="project-image-overlay">
                            <a href="${project.demo || project.github || '#'}" class="project-overlay-btn" aria-label="View Project">View Project</a>
                        </div>
                    </div>
                    <div class="project-content">
                        <span class="project-category">${project.category}</span>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tech">${techTags}</div>
                        <div class="project-links">
                            ${githubLink}
                            ${demoLink}
                        </div>
                    </div>
                </div>`;
            }).join('');
        }
    }

    // Experience Timeline
    if (PORTFOLIO_DATA.experience && PORTFOLIO_DATA.experience.length > 0) {
        const expTimeline = document.querySelector('#experience .timeline');
        if (expTimeline) {
            expTimeline.innerHTML = PORTFOLIO_DATA.experience.map((item, i) => {
                const isLast = i === PORTFOLIO_DATA.experience.length - 1;
                const dotClass = item.isFuture ? 'timeline-dot-future' : (item.badge === 'Active' ? 'timeline-dot-active' : '');
                const cardClass = item.isFuture ? 'timeline-card-future' : '';
                const badgeHtml = item.badge ? `<div class="timeline-badge">${item.badge}</div>` : '';
                const tagsHtml = item.tags && item.tags.length > 0 ? `<div class="timeline-tags">${item.tags.map(t => `<span>${t}</span>`).join('')}</div>` : '';
                return `
                <div class="timeline-item" data-reveal>
                    <div class="timeline-marker">
                        <div class="timeline-dot ${dotClass} ${isLast ? 'timeline-dot-end' : ''}"></div>
                        ${!isLast ? '<div class="timeline-line"></div>' : ''}
                    </div>
                    <div class="timeline-card glass-card ${cardClass}">
                        ${badgeHtml}
                        <span class="timeline-date">${item.start} ${item.end ? '— ' + item.end : ''}</span>
                        <h3>${item.title}</h3>
                        <p class="timeline-institution">${item.institution}</p>
                        <p class="timeline-desc">${item.description}</p>
                        ${tagsHtml}
                    </div>
                </div>`;
            }).join('');
        }
    }

    // Certifications
    if (PORTFOLIO_DATA.certifications !== undefined) {
        const certsGrid = document.getElementById('certsGrid');
        if (certsGrid) {
            if (PORTFOLIO_DATA.certifications.length === 0) {
                certsGrid.innerHTML = `<div class="cert-empty glass-card" data-reveal><div class="cert-empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg></div><h3>Certifications Coming Soon</h3><p>I'm actively pursuing industry‑recognized certifications.</p></div>`;
            } else {
                certsGrid.innerHTML = PORTFOLIO_DATA.certifications.map(cert => `
                    <div class="cert-card glass-card" data-reveal style="text-align:center;">
                        ${cert.image ? `<img src="${cert.image}" alt="${cert.title}" style="width:100%;max-width:200px;border-radius:12px;margin-bottom:1rem;">` : ''}
                        <h3>${cert.title}</h3>
                        <p style="color:#94A3B8;">${cert.issuer || ''}</p>
                        <span style="color:#3B82F6;font-size:0.85rem;">${cert.date || ''}</span>
                    </div>
                `).join('');
            }
        }
    }

    // Achievements
    if (PORTFOLIO_DATA.achievements !== undefined) {
        const achievementsGrid = document.getElementById('achievementsGrid');
        if (achievementsGrid) {
            if (PORTFOLIO_DATA.achievements.length === 0) {
                achievementsGrid.innerHTML = `<div class="achievement-empty glass-card" data-reveal><div class="achievement-empty-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><h3>Achievements Coming Soon</h3><p>Stay tuned for updates!</p></div>`;
            } else {
                achievementsGrid.innerHTML = PORTFOLIO_DATA.achievements.map(ach => `
                    <div class="achievement-card glass-card" data-reveal style="text-align:center;">
                        <h3>${ach.title}</h3>
                        <p style="color:#94A3B8;">${ach.description || ''}</p>
                        <span style="color:#3B82F6;font-size:0.85rem;">${ach.date || ''}</span>
                    </div>
                `).join('');
            }
        }
    }

    // Contact Info
    if (PORTFOLIO_DATA.email || PORTFOLIO_DATA.phone || PORTFOLIO_DATA.location) {
        const contactInfoContainer = document.querySelector('#contact .contact-info');
        if (contactInfoContainer && PORTFOLIO_DATA.email) {
            const emailEl = contactInfoContainer.querySelector('.contact-info-card:nth-child(2) p');
            if (emailEl) emailEl.textContent = PORTFOLIO_DATA.email;
        }
        if (contactInfoContainer && PORTFOLIO_DATA.phone) {
            const phoneEl = contactInfoContainer.querySelector('.contact-info-card:nth-child(3) p');
            if (phoneEl) phoneEl.textContent = PORTFOLIO_DATA.phone;
        }
        if (contactInfoContainer && PORTFOLIO_DATA.location) {
            const locEl = contactInfoContainer.querySelector('.contact-info-card:first-child p');
            if (locEl) locEl.textContent = PORTFOLIO_DATA.location;
        }
    }

    // Re-init scroll reveal and magnetic buttons after rebuilding
    revealElements = document.querySelectorAll('[data-reveal]');
    skillProgressBars = document.querySelectorAll('.skill-progress-bar');
    magneticBtns = document.querySelectorAll('[data-magnetic]');
    initScrollReveal();
    initSkillProgress();
    initMagneticButtons();
    initCursorHover();
}

function initScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
}

function initSkillProgress() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.skill-progress-bar').forEach(bar => {
                    const progress = bar.getAttribute('data-progress') || '0';
                    bar.style.width = progress + '%';
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    observer.observe(skillsSection);
}

function initMagneticButtons() {
    magneticBtns.forEach(btn => {
        btn.removeEventListener('mousemove', magneticMove);
        btn.removeEventListener('mouseleave', magneticLeave);
        btn.addEventListener('mousemove', magneticMove);
        btn.addEventListener('mouseleave', magneticLeave);
    });
}

function magneticMove(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    cursor.style.width = '50px';
    cursor.style.height = '50px';
    cursor.style.borderColor = 'var(--primary-blue)';
    cursorDot.style.width = '12px';
    cursorDot.style.height = '12px';
    cursorDot.style.background = 'white';
}
function magneticLeave(e) {
    e.currentTarget.style.transform = 'translate(0, 0)';
    cursor.style.width = '32px';
    cursor.style.height = '32px';
    cursor.style.borderColor = 'rgba(255,255,255,0.6)';
    cursorDot.style.width = '8px';
    cursorDot.style.height = '8px';
    cursorDot.style.background = 'var(--primary-blue)';
}

function initCursorHover() {
    document.querySelectorAll('a, button, .project-card, .skill-card, .about-card, input, textarea, .social-icon, .magnetic-btn, .hero-floating-card, .glass-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.borderColor = 'var(--primary-blue)';
            cursorDot.style.width = '12px';
            cursorDot.style.height = '12px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '32px';
            cursor.style.height = '32px';
            cursor.style.borderColor = 'rgba(255,255,255,0.6)';
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
        });
    });
}

// ===== RUN REBUILD ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    rebuildAllSections(); // Apply admin data if available
    // Re-init everything
    initScrollReveal();
    initSkillProgress();
    initMagneticButtons();
    initCursorHover();
});

// ===== LOADER =====
window.addEventListener('load', () => {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            loaderBar.style.width = '100%';
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 400);
        }
        loaderBar.style.width = progress + '%';
    }, 200);
});
document.body.style.overflow = 'hidden';

// ===== CURSOR ANIMATION =====
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    mouseGlow.style.left = mouseX + 'px';
    mouseGlow.style.top = mouseY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.2)';
});
document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
});

// ===== SCROLL PROGRESS =====
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
    if (scrollTop > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    if (scrollTop > 600) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
});

// ===== MOBILE MENU =====
mobileMenuBtn.addEventListener('click', () => {
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== BACK TO TOP =====
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== TYPING ANIMATION =====
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = '';

function typeEffect() {
    const words = CONFIG.typingWords;
    const fullWord = words[wordIndex];
    if (isDeleting) {
        currentText = fullWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        currentText = fullWord.substring(0, charIndex + 1);
        charIndex++;
    }
    if (typingText) typingText.textContent = currentText;
    let typeSpeed = isDeleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed;
    if (!isDeleting && charIndex === fullWord.length) {
        typeSpeed = CONFIG.pauseTime;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

const typingObserver = new MutationObserver(() => {
    if (!loader.classList.contains('hidden')) return;
    typeEffect();
    typingObserver.disconnect();
});
typingObserver.observe(loader, { attributes: true, attributeFilter: ['class'] });

// ===== CONTACT FORM =====
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formFeedback.textContent = 'Message sent successfully! (Demo)';
    formFeedback.style.color = '#22c55e';
    contactForm.reset();
    setTimeout(() => formFeedback.textContent = '', 3000);
});

// ===== FOOTER YEAR =====
if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

// ===== PARALLAX AURORA =====
window.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
    document.querySelectorAll('.aurora').forEach((aurora, index) => {
        aurora.style.transform = `translate(${moveX * (index + 1)}px, ${moveY * (index + 1)}px)`;
    });
});

// ===== ACTIVE NAV LINK =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 150;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) link.classList.add('active');
    });
});

// ===== INTERACTIVE TERMINAL (CLI SIMULATOR) =====
const termLauncher = document.getElementById('terminalLauncher');
const termWindow = document.getElementById('terminalWindow');
const termCloseBtn = document.getElementById('terminalClose');
const termBody = document.getElementById('terminalBody');
const termInput = document.getElementById('terminalInput');

let terminalOpen = false;

if (termLauncher) {
    termLauncher.addEventListener('click', () => {
        termWindow.classList.add('open');
        termInput.focus();
        terminalOpen = true;
    });
}

if (termCloseBtn) {
    termCloseBtn.addEventListener('click', () => {
        termWindow.classList.remove('open');
        terminalOpen = false;
    });
}

// Terminal Commands
const commands = {
    help: () => [
        "Available commands:",
        "  about      - About Muhammad Anas",
        "  skills     - Technical skills",
        "  projects   - Recent projects",
        "  contact    - Contact information",
        "  clear      - Clear terminal",
        "  exit       - Close terminal",
        "  hello      - Friendly greeting",
        "  date       - Current date & time"
    ],
    about: () => {
        const data = JSON.parse(localStorage.getItem('portfolioData') || '{}');
        return [
            "══════════════════════════════",
            "  Muhammad Anas",
            "  Software Engineering Student @ UMT, Lahore",
            "  Cybersecurity Enthusiast | Problem Solver",
            "══════════════════════════════",
            (data.hero?.description || "Passionate about software development and security.").replace(/<[^>]*>/g, '')
        ];
    },
    skills: () => {
        const data = JSON.parse(localStorage.getItem('portfolioData') || '{}');
        if (!data.skills || data.skills.length === 0) return ["No skills data loaded yet."];
        return [
            "═══ Technical Skills ═══",
            ...data.skills.map(s => `  ▸ ${s.name} (${s.level}) — ${s.progress}%`)
        ];
    },
    projects: () => {
        const data = JSON.parse(localStorage.getItem('portfolioData') || '{}');
        if (!data.projects || data.projects.length === 0) return ["No projects data loaded yet."];
        return [
            "═══ Featured Projects ═══",
            ...data.projects.map(p => `  ▸ ${p.title} [${p.category}]`)
        ];
    },
    contact: () => {
        const data = JSON.parse(localStorage.getItem('portfolioData') || '{}');
        return [
            "═══ Contact Information ═══",
            `  Email: ${data.email || 'anasali2988@gmail.com'}`,
            `  Phone: ${data.phone || '+92 347 3534323'}`,
            `  Location: ${data.location || 'Lahore, Pakistan'}`
        ];
    },
    clear: () => { if (termBody) termBody.innerHTML = ''; return []; },
    exit: () => { if (termWindow) termWindow.classList.remove('open'); terminalOpen = false; return []; },
    hello: () => [
        "Hey there! 👋",
        "Welcome to Muhammad Anas' interactive terminal.",
        "Type 'help' to see what I can do."
    ],
    date: () => [new Date().toString()]
};

function addTerminalLine(text) {
    if (!termBody) return;
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = text;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
}

function processCommand(cmd) {
    addTerminalLine(`<span class="prompt">guest@anas:~$</span> ${cmd}`);
    const fn = commands[cmd.trim().toLowerCase()];
    if (fn) {
        const output = fn();
        if (Array.isArray(output)) {
            output.forEach(l => addTerminalLine(l));
        }
    } else if (cmd.trim()) {
        addTerminalLine(`Command not found: <span style="color:#ff6b6b;">${cmd}</span>. Type <span class="cmd-highlight">help</span> for available commands.`);
    }
}

if (termInput) {
    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = termInput.value.trim();
            if (cmd) processCommand(cmd);
            termInput.value = '';
        }
    });
}

// Close terminal when clicking outside
document.addEventListener('click', (e) => {
    if (terminalOpen && termWindow && !termWindow.contains(e.target) && termLauncher && e.target !== termLauncher && !termLauncher.contains(e.target)) {
        termWindow.classList.remove('open');
        terminalOpen = false;
    }
});

// Prevent FOUC
document.documentElement.style.visibility = 'visible';