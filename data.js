// Default data – used only if localStorage is empty
const DEFAULT_DATA = {
  name: "Muhammad Anas",
  email: "anasali2988@gmail.com",
  phone: "+92 347 3534323",
  location: "Lahore, Punjab, Pakistan",
  resumeLink: "assets/resume/resume.pdf",
  hero: {
    badge: "Available for Internships",
    greeting: "Hi, I'm",
    firstName: "Muhammad",
    lastName: "Anas",
    typingWords: ["Software Engineering Student", "Cybersecurity Enthusiast", "Problem Solver", "AI & Tech Explorer"],
    description: `A passionate <strong>Software Engineering student</strong> at UMT, Lahore...`,
    profileImage: "" // empty string = initials "MA" dikhenge
  },
  socials: [
    { platform: "github", url: "https://github.com/muhammadanas702" },
    { platform: "linkedin", url: "https://www.linkedin.com/in/muhammad-anas-175828378" },
    { platform: "x", url: "https://x.com/muhammadanas_20" },
    { platform: "email", url: "mailto:anasali2988@gmail.com" }
  ],
  about: [
    { icon: "clock", title: "My Mission", text: "To become a highly skilled Software Engineer..." },
    { icon: "book", title: "Background", text: "I am Muhammad Anas, a Software Engineering student..." },
    { icon: "bolt", title: "Drive & Ambition", text: "I believe that continuous learning..." },
    { icon: "users", title: "Personality", text: "I am a quick learner, detail‑oriented..." }
  ],
  skills: [
    { name: "C", level: "Intermediate", color: "#A8B9CC", progress: 80, description: "Procedural programming..." },
    { name: "C++", level: "Intermediate", color: "#00599C", progress: 75, description: "Object‑oriented programming..." },
    // ...baaki skills same as before
  ],
  education: [
    { start: "2024", end: "Present", title: "BS Software Engineering", institution: "UMT, Lahore", description: "Pursuing...", tags: ["Software Engineering","Cybersecurity"], badge: "Current" },
    // ...
  ],
  projects: [
    { title: "Student Management System", category: "System Programming", description: "CLI‑based...", tech: ["C++","File Handling"], github: "https://...", demo: "", image: "" },
    // ...
  ],
  experience: [
    { start: "2024", end: "Present", title: "Software Engineering Student", institution: "UMT", description: "Currently pursuing...", tags: ["Programming"], badge: "Active", isFuture: false },
    { start: "Upcoming", end: "", title: "Future Internship", institution: "Open to Opportunities", description: "Eager to apply...", tags: ["Seeking"], isFuture: true }
  ],
  certifications: [],   // empty initially
  achievements: []
};