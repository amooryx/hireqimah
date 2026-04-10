import type { UserRole } from "./mockData";

// ===== HASH SIMULATION (prototype only) =====
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return "hq$" + Math.abs(hash).toString(36) + "$" + btoa(str).slice(0, 8);
}
function verifyHash(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

// ===== TYPES =====
export interface ConductRecord {
  type: "cheating" | "warning" | "attendance" | "other";
  description: string;
  date: string;
  impactPoints: number;
}

export interface ActivityRecord {
  name: string;
  points: number;
  date?: string;
}

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole | "university";
  name: string;
  createdAt?: string;
  disabled?: boolean;
  // Student
  university?: string;
  major?: string;
  gpa?: number;
  gpaScale?: "4" | "5";
  nationality?: string;
  transcriptUploaded?: boolean;
  transcriptVerified?: boolean;
  certifications?: { name: string; credlyId?: string; verified?: boolean }[];
  projects?: string[];
  academicScore?: number;
  skillsScore?: number;
  softSkillsScore?: number;
  conductScore?: number;
  roadmapProgress?: number;
  badges?: string[];
  avatar?: string;
  coopEligible?: boolean;
  coopRequired?: boolean;
  activities?: ActivityRecord[];
  conductRecords?: ConductRecord[];
  // HR
  company?: string;
  position?: string;
  industry?: string;
  // University
  universityName?: string;
  officialDomain?: string;
  adminContact?: string;
}

export interface Opportunity {
  id: string;
  hrId: string;
  title: string;
  type: "coop" | "internship" | "part-time" | "junior";
  company: string;
  department: string;
  requiredMajors: string[];
  minERS: number;
  minGPA: number;
  requiredCerts: string[];
  skills: string[];
  location: string;
  workMode: "remote" | "onsite" | "hybrid";
  duration: string;
  deadline: string;
  positions: number;
  description: string;
  status: "open" | "closed";
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  status: "submitted" | "under_review" | "shortlisted" | "rejected" | "accepted" | "interviewed";
  appliedAt: string;
  matchScore: number;
}

export interface Notification {
  id: string;
  userId: string;
  text: string;
  time: string;
  read: boolean;
}

export interface Session {
  userId: string;
  role: UserRole | "university";
  loginAt: number;
  expiresAt: number;
  csrfToken: string;
}

interface RateLimit {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// ===== CONSTANTS =====
const STORAGE_KEYS = {
  USERS: "hq_users",
  SESSION: "hq_session",
  RATE_LIMITS: "hq_rate_limits",
  ACTIVITY_LOG: "hq_activity_log",
  OPPORTUNITIES: "hq_opportunities",
  APPLICATIONS: "hq_applications",
  NOTIFICATIONS: "hq_notifications",
};

const SESSION_TIMEOUT = 30 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000;

function generateCSRF(): string { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function generateId(): string { return Math.random().toString(36).slice(2, 10); }

// ===== CERTIFICATION POINTS (FIXED) =====
export const CERTIFICATION_POINTS: Record<string, number> = {
  "OSCP": 30, "eJPT": 15, "CEH": 22, "CompTIA Security+": 18,
  "PMP": 25, "CAPM": 12,
  "AWS Solutions Architect": 20, "AWS Cloud Practitioner": 10, "Azure AI Engineer": 18,
  "Google Data Analytics": 14, "Google Cloud Associate": 16,
  "TensorFlow Developer": 16, "Deep Learning Specialization": 15,
  "Scrum Master": 12, "CISSP": 30, "CISA": 25,
  "React Developer": 10, "Node.js Certified": 10,
  "SolidWorks CSWA": 12, "PMP Fundamentals": 8,
  "Google Ads Certification": 10, "HubSpot Inbound Marketing": 8,
  "IBM AI Engineering": 14, "Python for Data Science": 10,
  "CFA Level 1": 20, "CCNA": 18, "CCNP": 25,
};

// ===== ACTIVITY POINTS (FIXED) =====
export const ACTIVITY_POINTS: Record<string, number> = {
  "Mentoring freshmen": 5, "Public speaking event": 8,
  "Hackathon participant": 10, "Hackathon winner": 15,
  "Research publication": 20, "Community volunteer": 5,
  "Student club leader": 8, "Competition winner": 12,
  "Open source contribution": 10, "Teaching assistant": 7,
};

// ===== SAUDI UNIVERSITIES & MAJORS =====
export const SAUDI_UNIVERSITIES: Record<string, string[]> = {
  "King Saud University": ["Cybersecurity", "Software Engineering", "Computer Science", "Data Science", "Electrical Engineering", "Mechanical Engineering", "Business Administration", "Marketing", "Finance", "Accounting", "Civil Engineering", "Medicine", "Law"],
  "King Abdulaziz University": ["Software Engineering", "Computer Science", "Data Science", "Marketing", "Business Administration", "Mechanical Engineering", "Electrical Engineering", "Medicine", "Dentistry", "Law", "Finance"],
  "KFUPM": ["Computer Science", "Software Engineering", "Cybersecurity", "Data Science", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering", "Petroleum Engineering", "Civil Engineering", "Industrial Engineering"],
  "Princess Nourah University": ["Computer Science", "Data Science", "Artificial Intelligence", "Software Engineering", "Business Administration", "Marketing", "Finance", "Law", "Education", "Nursing"],
  "Imam Mohammad Ibn Saud University": ["Software Engineering", "Computer Science", "Cybersecurity", "Business Administration", "Law", "Marketing", "Finance", "Accounting", "Media Studies"],
  "King Fahd University of Petroleum and Minerals": ["Computer Science", "Software Engineering", "Cybersecurity", "Data Science", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering", "Petroleum Engineering"],
  "Umm Al-Qura University": ["Computer Science", "Software Engineering", "Business Administration", "Medicine", "Law", "Education", "Marketing"],
  "King Khalid University": ["Computer Science", "Software Engineering", "Business Administration", "Medicine", "Engineering", "Education"],
  "Taibah University": ["Computer Science", "Software Engineering", "Business Administration", "Medicine", "Nursing", "Education"],
  "Qassim University": ["Computer Science", "Software Engineering", "Business Administration", "Medicine", "Engineering", "Agriculture"],
  "Taif University": ["Computer Science", "Software Engineering", "Business Administration", "Medicine", "Engineering", "Education"],
  "Jazan University": ["Computer Science", "Software Engineering", "Business Administration", "Medicine", "Engineering"],
  "Ha'il University": ["Computer Science", "Software Engineering", "Business Administration", "Medicine", "Engineering"],
  "Najran University": ["Computer Science", "Software Engineering", "Business Administration", "Medicine", "Engineering"],
  "Northern Borders University": ["Computer Science", "Business Administration", "Medicine", "Engineering"],
  "Prince Sattam bin Abdulaziz University": ["Computer Science", "Software Engineering", "Business Administration", "Engineering"],
  "Shaqra University": ["Computer Science", "Software Engineering", "Business Administration", "Engineering"],
  "Al-Baha University": ["Computer Science", "Business Administration", "Medicine", "Engineering"],
  "Al-Jouf University": ["Computer Science", "Business Administration", "Medicine", "Engineering"],
  "Majmaah University": ["Computer Science", "Software Engineering", "Business Administration", "Engineering"],
  "Saudi Electronic University": ["Computer Science", "Software Engineering", "Data Science", "Business Administration", "Finance", "Cybersecurity"],
  "Prince Sultan University": ["Computer Science", "Software Engineering", "Artificial Intelligence", "Business Administration", "Law", "Finance"],
  "Alfaisal University": ["Computer Science", "Software Engineering", "Medicine", "Business Administration", "Engineering"],
  "Effat University": ["Computer Science", "Software Engineering", "Business Administration", "Architecture", "Design"],
  "Dar Al-Hekma University": ["Computer Science", "Business Administration", "Design", "Law"],
  "Prince Mohammad bin Fahd University": ["Computer Science", "Software Engineering", "Business Administration", "Engineering"],
  "Arab Open University": ["Computer Science", "Business Administration", "Education"],
  "KAUST (Graduate)": ["Computer Science", "Data Science", "Artificial Intelligence", "Engineering", "Bioscience"],
};

export const UNIVERSITIES = Object.keys(SAUDI_UNIVERSITIES);

export function getMajorsForUniversity(university: string): string[] {
  return SAUDI_UNIVERSITIES[university] || [];
}

export const ALL_MAJORS = [...new Set(Object.values(SAUDI_UNIVERSITIES).flat())].sort();

// ===== DEFAULT USERS =====
function getDefaultUsers(): StoredUser[] {
  return [
    {
      id: "s1", email: "abdullah@ksu.edu.sa", passwordHash: simpleHash("Student@123"), role: "student",
      name: "Abdullah Al-Harbi", university: "King Saud University", major: "Cybersecurity", gpa: 3.85, gpaScale: "4",
      nationality: "Saudi", transcriptUploaded: true, transcriptVerified: true,
      certifications: [{ name: "OSCP", credlyId: "CR-OSCP-001", verified: true }, { name: "CEH", credlyId: "CR-CEH-002", verified: true }, { name: "eJPT", verified: true }],
      projects: ["Threat Detection System", "Vulnerability Scanner"], academicScore: 95, skillsScore: 90, softSkillsScore: 88,
      conductScore: 100, roadmapProgress: 78, badges: ["Top 1%", "Rising Star"], avatar: "AH",
      coopEligible: true, coopRequired: true,
      activities: [{ name: "Hackathon winner", points: 15 }, { name: "Mentoring freshmen", points: 5 }],
      conductRecords: [],
    },
    {
      id: "s2", email: "reem@pnu.edu.sa", passwordHash: simpleHash("Student@123"), role: "student",
      name: "Reem Al-Qahtani", university: "Princess Nourah University", major: "Data Science", gpa: 3.92, gpaScale: "4",
      nationality: "Saudi", transcriptUploaded: true, transcriptVerified: true,
      certifications: [{ name: "Google Data Analytics", verified: true }, { name: "TensorFlow Developer", credlyId: "CR-TF-003", verified: true }],
      projects: ["Sentiment Analysis Tool", "Predictive Analytics Dashboard"], academicScore: 96, skillsScore: 85, softSkillsScore: 82,
      conductScore: 100, roadmapProgress: 65, badges: ["Academic Excellence"], avatar: "RQ",
      coopEligible: true, coopRequired: false,
      activities: [{ name: "Research publication", points: 20 }],
      conductRecords: [],
    },
    {
      id: "s3", email: "fahad@kfupm.edu.sa", passwordHash: simpleHash("Student@123"), role: "student",
      name: "Fahad Al-Mutairi", university: "KFUPM", major: "Mechanical Engineering", gpa: 3.78, gpaScale: "4",
      nationality: "Saudi", transcriptUploaded: true, transcriptVerified: true,
      certifications: [{ name: "SolidWorks CSWA", verified: true }, { name: "PMP Fundamentals", verified: false }],
      projects: ["Robotic Arm Control System"], academicScore: 90, skillsScore: 74, softSkillsScore: 72,
      conductScore: 95, roadmapProgress: 45, badges: [], avatar: "FM",
      coopEligible: true, coopRequired: true,
      activities: [{ name: "Competition winner", points: 12 }],
      conductRecords: [{ type: "attendance", description: "Below 80% attendance in semester 6", date: "2025-06-15", impactPoints: 5 }],
    },
    {
      id: "s4", email: "sara@kau.edu.sa", passwordHash: simpleHash("Student@123"), role: "student",
      name: "Sara Al-Dosari", university: "King Abdulaziz University", major: "Marketing", gpa: 3.60, gpaScale: "4",
      nationality: "Saudi", transcriptUploaded: true, transcriptVerified: false,
      certifications: [{ name: "Google Ads Certification", verified: true }, { name: "HubSpot Inbound Marketing", verified: true }],
      projects: ["Social Media Campaign Analysis"], academicScore: 84, skillsScore: 70, softSkillsScore: 80,
      conductScore: 100, roadmapProgress: 38, badges: ["Team Player"], avatar: "SD",
      coopEligible: false, coopRequired: true,
      activities: [{ name: "Public speaking event", points: 8 }, { name: "Community volunteer", points: 5 }],
      conductRecords: [],
    },
    {
      id: "s5", email: "mohammed@imamu.edu.sa", passwordHash: simpleHash("Student@123"), role: "student",
      name: "Mohammed Al-Otaibi", university: "Imam Mohammad Ibn Saud University", major: "Software Engineering", gpa: 3.70, gpaScale: "4",
      nationality: "Saudi", transcriptUploaded: true, transcriptVerified: true,
      certifications: [{ name: "AWS Solutions Architect", credlyId: "CR-AWS-005", verified: true }, { name: "Scrum Master", verified: true }, { name: "React Developer", verified: false }],
      projects: ["E-commerce Platform", "Mobile Banking App"], academicScore: 88, skillsScore: 82, softSkillsScore: 76,
      conductScore: 100, roadmapProgress: 55, badges: ["Innovation Award"], avatar: "MO",
      coopEligible: true, coopRequired: false,
      activities: [{ name: "Open source contribution", points: 10 }, { name: "Hackathon participant", points: 10 }],
      conductRecords: [],
    },
    // HR
    { id: "h1", email: "hr@aramco.com", passwordHash: simpleHash("Company@123"), role: "hr", name: "Nasser Al-Ghamdi", company: "Saudi Aramco", position: "HR Manager", industry: "Energy", avatar: "NG" },
    { id: "h2", email: "talent@stc.com.sa", passwordHash: simpleHash("Company@123"), role: "hr", name: "Huda Al-Salem", company: "STC", position: "Talent Acquisition Lead", industry: "Telecom", avatar: "HS" },
    { id: "h3", email: "recruit@sabic.com", passwordHash: simpleHash("Company@123"), role: "hr", name: "Turki Al-Rashidi", company: "SABIC", position: "Recruitment Lead", industry: "Petrochemicals", avatar: "TR" },
    { id: "h4", email: "hr@neom.com", passwordHash: simpleHash("Company@123"), role: "hr", name: "Layla Al-Anazi", company: "NEOM", position: "HR Specialist", industry: "Technology", avatar: "LA" },
    { id: "h5", email: "jobs@riyadbank.com", passwordHash: simpleHash("Company@123"), role: "hr", name: "Faisal Al-Dossary", company: "Riyad Bank", position: "HR Officer", industry: "Banking", avatar: "FD" },
    // Admin
    { id: "a1", email: "admin@hireqimah.com", passwordHash: simpleHash("Admin@2026"), role: "admin", name: "Platform Admin", avatar: "PA" },
    // University
    { id: "u1", email: "admin@ksu.edu.sa", passwordHash: simpleHash("Uni@2026"), role: "university", name: "Dr. Ahmad Al-Shehri", universityName: "King Saud University", officialDomain: "ksu.edu.sa", adminContact: "+966-11-467-0000", avatar: "AS" },
    { id: "u2", email: "admin@kau.edu.sa", passwordHash: simpleHash("Uni@2026"), role: "university", name: "Dr. Fatimah Al-Zahrani", universityName: "King Abdulaziz University", officialDomain: "kau.edu.sa", adminContact: "+966-12-695-0000", avatar: "FZ" },
  ];
}

function getDefaultOpportunities(): Opportunity[] {
  return [
    {
      id: "opp1", hrId: "h1", title: "Cybersecurity CO-OP Trainee", type: "coop", company: "Saudi Aramco",
      department: "IT Security", requiredMajors: ["Cybersecurity", "Computer Science"], minERS: 70, minGPA: 3.0,
      requiredCerts: ["CompTIA Security+"], skills: ["Network Security", "SIEM", "Python"],
      location: "Dhahran", workMode: "onsite", duration: "6 months", deadline: "2026-04-15",
      positions: 3, description: "Join Aramco's cybersecurity team for a hands-on CO-OP experience protecting critical infrastructure.",
      status: "open", createdAt: "2026-02-01",
    },
    {
      id: "opp2", hrId: "h2", title: "Junior Software Engineer", type: "junior", company: "STC",
      department: "Digital Products", requiredMajors: ["Software Engineering", "Computer Science"], minERS: 65, minGPA: 3.2,
      requiredCerts: [], skills: ["React", "TypeScript", "Node.js"],
      location: "Riyadh", workMode: "hybrid", duration: "Full-time", deadline: "2026-05-01",
      positions: 5, description: "Build next-generation digital products for Saudi Arabia's largest telecom.",
      status: "open", createdAt: "2026-02-05",
    },
    {
      id: "opp3", hrId: "h3", title: "Data Analytics Intern", type: "internship", company: "SABIC",
      department: "Business Intelligence", requiredMajors: ["Data Science", "Computer Science"], minERS: 60, minGPA: 3.0,
      requiredCerts: ["Google Data Analytics"], skills: ["SQL", "Python", "Tableau"],
      location: "Riyadh", workMode: "onsite", duration: "3 months", deadline: "2026-03-30",
      positions: 2, description: "Analyze industrial data and build dashboards for SABIC's business intelligence team.",
      status: "open", createdAt: "2026-02-08",
    },
    {
      id: "opp4", hrId: "h4", title: "AI Research CO-OP", type: "coop", company: "NEOM",
      department: "AI & Robotics", requiredMajors: ["Artificial Intelligence", "Computer Science", "Data Science"], minERS: 75, minGPA: 3.5,
      requiredCerts: [], skills: ["TensorFlow", "NLP", "Computer Vision"],
      location: "NEOM", workMode: "onsite", duration: "6 months", deadline: "2026-04-20",
      positions: 2, description: "Work on cutting-edge AI projects for the city of the future.",
      status: "open", createdAt: "2026-02-10",
    },
    {
      id: "opp5", hrId: "h5", title: "Finance & Risk Part-time Analyst", type: "part-time", company: "Riyad Bank",
      department: "Risk Management", requiredMajors: ["Finance", "Business Administration", "Accounting"], minERS: 55, minGPA: 3.0,
      requiredCerts: [], skills: ["Excel", "Financial Modeling", "Risk Analysis"],
      location: "Riyadh", workMode: "hybrid", duration: "Part-time", deadline: "2026-06-01",
      positions: 3, description: "Support the risk management team with financial analysis and reporting.",
      status: "open", createdAt: "2026-02-12",
    },
  ];
}

// ===== INIT =====
function initStore() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(getDefaultUsers()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES)) {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(getDefaultOpportunities()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
}

// ===== USER CRUD =====
export function getAllUsers(): StoredUser[] { initStore(); return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]"); }
export function getUserByEmail(email: string): StoredUser | undefined { return getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase()); }
export function getUserById(id: string): StoredUser | undefined { return getAllUsers().find(u => u.id === id); }
export function getStudents(): StoredUser[] { return getAllUsers().filter(u => u.role === "student"); }

export function updateUser(id: string, updates: Partial<StoredUser>) {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) { users[idx] = { ...users[idx], ...updates }; localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }
}

export function registerUser(data: Omit<StoredUser, "id" | "passwordHash" | "createdAt"> & { password: string }): { success: boolean; error?: string } {
  const { password, ...rest } = data;
  if (getUserByEmail(rest.email)) return { success: false, error: "Email already registered." };
  if (password.length < 8) return { success: false, error: "Password must be at least 8 characters." };
  if (!/[A-Z]/.test(password)) return { success: false, error: "Password must include an uppercase letter." };
  if (!/[0-9]/.test(password)) return { success: false, error: "Password must include a number." };
  if (!/[^A-Za-z0-9]/.test(password)) return { success: false, error: "Password must include a special character." };

  const users = getAllUsers();
  const newUser: StoredUser = {
    ...rest, id: generateId(), passwordHash: simpleHash(password), createdAt: new Date().toISOString(),
    ...(rest.role === "student" ? {
      academicScore: 0, skillsScore: 0, softSkillsScore: 0, conductScore: 100,
      roadmapProgress: 0, badges: [], certifications: [], projects: [],
      transcriptUploaded: false, transcriptVerified: false,
      activities: [], conductRecords: [], coopEligible: false, coopRequired: false,
    } : {}),
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  addActivityLog(`New ${rest.role} registered: ${rest.email}`);
  return { success: true };
}

// ===== RATE LIMITING =====
function getRateLimits(): Record<string, RateLimit> { return JSON.parse(localStorage.getItem(STORAGE_KEYS.RATE_LIMITS) || "{}"); }
function setRateLimits(limits: Record<string, RateLimit>) { localStorage.setItem(STORAGE_KEYS.RATE_LIMITS, JSON.stringify(limits)); }

function checkRateLimit(email: string): { allowed: boolean; remainingAttempts: number; lockedUntil?: number } {
  const limits = getRateLimits();
  const limit = limits[email.toLowerCase()];
  if (!limit) return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  if (limit.lockedUntil && Date.now() < limit.lockedUntil) return { allowed: false, remainingAttempts: 0, lockedUntil: limit.lockedUntil };
  if (limit.lockedUntil && Date.now() >= limit.lockedUntil) { delete limits[email.toLowerCase()]; setRateLimits(limits); return { allowed: true, remainingAttempts: MAX_ATTEMPTS }; }
  return { allowed: limit.attempts < MAX_ATTEMPTS, remainingAttempts: MAX_ATTEMPTS - limit.attempts };
}

function recordAttempt(email: string, success: boolean) {
  const limits = getRateLimits();
  const key = email.toLowerCase();
  if (success) { delete limits[key]; } else {
    const current = limits[key] || { attempts: 0, lastAttempt: 0 };
    current.attempts += 1; current.lastAttempt = Date.now();
    if (current.attempts >= MAX_ATTEMPTS) current.lockedUntil = Date.now() + LOCKOUT_DURATION;
    limits[key] = current;
  }
  setRateLimits(limits);
}

// ===== LOGIN =====
export function login(email: string, password: string, expectedRole?: string): { success: boolean; error?: string; user?: StoredUser } {
  email = email.trim().toLowerCase();
  if (!email || !password) return { success: false, error: "Please fill in all fields." };
  if (email.length > 255 || password.length > 128) return { success: false, error: "Invalid input." };
  const rateCheck = checkRateLimit(email);
  if (!rateCheck.allowed) {
    const remaining = rateCheck.lockedUntil ? Math.ceil((rateCheck.lockedUntil - Date.now()) / 1000) : 0;
    return { success: false, error: `Too many attempts. Try again in ${remaining}s.` };
  }
  const user = getUserByEmail(email);
  if (!user) { recordAttempt(email, false); return { success: false, error: `Invalid credentials. ${rateCheck.remainingAttempts - 1} attempts remaining.` }; }
  if (user.disabled) return { success: false, error: "This account has been disabled. Contact admin." };
  if (!verifyHash(password, user.passwordHash)) { recordAttempt(email, false); return { success: false, error: `Invalid credentials. ${rateCheck.remainingAttempts - 1} attempts remaining.` }; }

  // Strict role validation - prevent cross-role login
  if (expectedRole && user.role !== expectedRole) {
    return { success: false, error: "Invalid credentials for this login portal." };
  }

  recordAttempt(email, true);
  const session: Session = { userId: user.id, role: user.role, loginAt: Date.now(), expiresAt: Date.now() + SESSION_TIMEOUT, csrfToken: generateCSRF() };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  addActivityLog(`Login: ${user.email} (${user.role})`);
  return { success: true, user };
}

// ===== SESSION =====
export function getSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!raw) return null;
  const session: Session = JSON.parse(raw);
  if (Date.now() > session.expiresAt) { logout(); return null; }
  return session;
}
export function refreshSession() { const s = getSession(); if (s) { s.expiresAt = Date.now() + SESSION_TIMEOUT; localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(s)); } }
export function getCurrentUser(): StoredUser | null { const s = getSession(); if (!s) return null; return getUserById(s.userId) || null; }
export function logout() { const u = getCurrentUser(); if (u) addActivityLog(`Logout: ${u.email}`); localStorage.removeItem(STORAGE_KEYS.SESSION); }

// ===== ERS CALCULATION (NEW FORMULA) =====
export function calculateERS(user: StoredUser): number {
  const academic = user.academicScore || 0;

  // Certification score from fixed points
  const certPoints = (user.certifications || [])
    .filter(c => c.verified)
    .reduce((sum, c) => sum + (CERTIFICATION_POINTS[c.name] || 5), 0);
  const certScore = Math.min(100, (certPoints / 60) * 100); // 60 pts = 100%

  // Projects score
  const projectCount = (user.projects || []).length;
  const projectScore = Math.min(100, projectCount * 25); // 4 projects = 100

  // Soft skills / activities
  const activityPoints = (user.activities || []).reduce((sum, a) => sum + a.points, 0);
  const softScore = Math.min(100, (activityPoints / 40) * 100); // 40 pts = 100%

  // Conduct (default 100, reduced by incidents)
  const conductDeductions = (user.conductRecords || []).reduce((sum, r) => sum + r.impactPoints, 0);
  const conduct = Math.max(0, 100 - conductDeductions);

  const ers = Math.round(
    (0.40 * academic) + (0.25 * certScore) + (0.15 * projectScore) + (0.10 * softScore) + (0.10 * conduct)
  );
  return Math.min(100, Math.max(0, ers));
}

// ===== OPPORTUNITIES =====
export function getOpportunities(): Opportunity[] { initStore(); return JSON.parse(localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES) || "[]"); }
export function getOpportunityById(id: string): Opportunity | undefined { return getOpportunities().find(o => o.id === id); }

export function createOpportunity(opp: Omit<Opportunity, "id" | "createdAt">): Opportunity {
  const opps = getOpportunities();
  const newOpp: Opportunity = { ...opp, id: generateId(), createdAt: new Date().toISOString() };
  opps.push(newOpp);
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  addActivityLog(`Opportunity created: ${newOpp.title} by ${newOpp.company}`);
  // Notify matching students
  const students = getStudents();
  students.forEach(s => {
    if (newOpp.requiredMajors.length === 0 || newOpp.requiredMajors.includes(s.major || "")) {
      addNotification(s.id, `🆕 New ${newOpp.type} opportunity: ${newOpp.title} at ${newOpp.company}`);
    }
  });
  return newOpp;
}

export function updateOpportunity(id: string, updates: Partial<Opportunity>) {
  const opps = getOpportunities();
  const idx = opps.findIndex(o => o.id === id);
  if (idx !== -1) { opps[idx] = { ...opps[idx], ...updates }; localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps)); }
}

export function deleteOpportunity(id: string) {
  const opps = getOpportunities().filter(o => o.id !== id);
  localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
}

// ===== APPLICATIONS =====
export function getApplications(): Application[] { initStore(); return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]"); }

export function applyToOpportunity(studentId: string, opportunityId: string): { success: boolean; error?: string } {
  const apps = getApplications();
  if (apps.find(a => a.studentId === studentId && a.opportunityId === opportunityId)) {
    return { success: false, error: "Already applied." };
  }
  const student = getUserById(studentId);
  const opp = getOpportunityById(opportunityId);
  if (!student || !opp) return { success: false, error: "Not found." };
  if (opp.status !== "open") return { success: false, error: "Opportunity is closed." };

  const matchScore = calculateMatchScore(student, opp);
  const app: Application = { id: generateId(), opportunityId, studentId, status: "submitted", appliedAt: new Date().toISOString(), matchScore };
  apps.push(app);
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  addNotification(studentId, `✅ Application submitted for ${opp.title} at ${opp.company}`);
  addNotification(opp.hrId, `📩 New application for ${opp.title} from ${student.name}`);
  addActivityLog(`Application: ${student.name} → ${opp.title}`);
  return { success: true };
}

export function updateApplicationStatus(appId: string, status: Application["status"]) {
  const apps = getApplications();
  const idx = apps.findIndex(a => a.id === appId);
  if (idx !== -1) {
    apps[idx].status = status;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    const student = getUserById(apps[idx].studentId);
    const opp = getOpportunityById(apps[idx].opportunityId);
    if (student && opp) {
      const statusText = status === "shortlisted" ? "🌟 Shortlisted" : status === "accepted" ? "🎉 Accepted" : status === "rejected" ? "❌ Not selected" : status === "interviewed" ? "📋 Marked for interview" : `Status: ${status}`;
      addNotification(student.id, `${statusText} for ${opp.title} at ${opp.company}`);
      // Gamification
      if (status === "shortlisted") {
        const badges = student.badges || [];
        if (!badges.includes("Shortlisted")) { updateUser(student.id, { badges: [...badges, "Shortlisted"] }); }
      }
      if (status === "accepted") {
        const badges = student.badges || [];
        if (!badges.includes("Offer Received")) { updateUser(student.id, { badges: [...badges, "Offer Received"] }); }
      }
    }
  }
}

export function withdrawApplication(appId: string, studentId: string): boolean {
  const apps = getApplications();
  const idx = apps.findIndex(a => a.id === appId && a.studentId === studentId && (a.status === "submitted" || a.status === "under_review"));
  if (idx !== -1) { apps.splice(idx, 1); localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps)); return true; }
  return false;
}

export function getStudentApplications(studentId: string): Application[] { return getApplications().filter(a => a.studentId === studentId); }
export function getOpportunityApplications(opportunityId: string): Application[] { return getApplications().filter(a => a.opportunityId === opportunityId); }

// ===== MATCH SCORING =====
export function calculateMatchScore(student: StoredUser, opp: Opportunity): number {
  let skillMatch = 0;
  if (opp.skills.length > 0) {
    const studentCerts = (student.certifications || []).map(c => c.name.toLowerCase());
    const studentProjects = (student.projects || []).map(p => p.toLowerCase());
    const all = [...studentCerts, ...studentProjects, (student.major || "").toLowerCase()];
    const matched = opp.skills.filter(s => all.some(a => a.includes(s.toLowerCase()) || s.toLowerCase().includes(a)));
    skillMatch = (matched.length / opp.skills.length) * 100;
  } else { skillMatch = 80; }

  let certMatch = 100;
  if (opp.requiredCerts.length > 0) {
    const studentCerts = (student.certifications || []).filter(c => c.verified).map(c => c.name);
    const matched = opp.requiredCerts.filter(rc => studentCerts.includes(rc));
    certMatch = (matched.length / opp.requiredCerts.length) * 100;
  }

  const ers = calculateERS(student);
  const gpa = student.gpa || 0;
  const gpaScore = (gpa / 4) * 100;
  const activityPoints = (student.activities || []).reduce((sum, a) => sum + a.points, 0);
  const activityScore = Math.min(100, (activityPoints / 40) * 100);

  return Math.round((0.40 * skillMatch) + (0.25 * certMatch) + (0.20 * ers) + (0.10 * gpaScore) + (0.05 * activityScore));
}

// ===== NOTIFICATIONS =====
export function getNotifications(userId: string): Notification[] {
  initStore();
  return (JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]") as Notification[]).filter(n => n.userId === userId);
}

export function addNotification(userId: string, text: string) {
  initStore();
  const all: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]");
  all.unshift({ id: generateId(), userId, text, time: new Date().toISOString(), read: false });
  if (all.length > 500) all.length = 500;
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
}

export function markNotificationRead(id: string) {
  const all: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || "[]");
  const n = all.find(n => n.id === id);
  if (n) { n.read = true; localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all)); }
}

// ===== ACTIVITY LOG =====
export function addActivityLog(message: string) {
  const logs: { message: string; time: string }[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG) || "[]");
  logs.unshift({ message, time: new Date().toISOString() });
  if (logs.length > 100) logs.length = 100;
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOG, JSON.stringify(logs));
}
export function getActivityLog(): { message: string; time: string }[] { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOG) || "[]"); }

// ===== FILE VALIDATION =====
export function validateFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
  const allowedExts = [".pdf", ".png", ".jpg", ".jpeg"];
  const maxSize = 5 * 1024 * 1024;
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!allowedExts.includes(ext)) return { valid: false, error: "Only PDF, PNG, and JPEG files are allowed." };
  if (!allowedTypes.includes(file.type)) return { valid: false, error: "Invalid file type." };
  if (file.size > maxSize) return { valid: false, error: "File size exceeds 5 MB limit." };
  return { valid: true };
}

// ===== SANITIZE =====
export function sanitizeInput(input: string): string {
  return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").trim();
}
