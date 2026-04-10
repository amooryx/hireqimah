export type UserRole = "student" | "hr" | "admin";

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  gpa: number;
  ers: number;
  academicScore: number;
  skillsScore: number;
  softSkillsScore: number;
  certifications: string[];
  badges: string[];
  avatar: string;
  roadmapProgress: number;
  projects: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: "internship" | "job" | "project";
  location: string;
  skills: string[];
  posted: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  type: "certification" | "course" | "project" | "skill";
  priority: "high" | "medium" | "low";
  completed: boolean;
  description: string;
}

export const students: Student[] = [
  { id: "1", name: "Ahmed Al-Farsi", email: "ahmed@kau.edu.sa", university: "King Abdulaziz University", major: "Cybersecurity", gpa: 3.85, ers: 92, academicScore: 95, skillsScore: 90, softSkillsScore: 88, certifications: ["OSCP", "eJPT", "CEH"], badges: ["Top 1%", "Rising Star"], avatar: "AF", roadmapProgress: 78, projects: ["Threat Detection System", "Vulnerability Scanner"] },
  { id: "2", name: "Sara Al-Mutairi", email: "sara@ksu.edu.sa", university: "King Saud University", major: "Software Engineering", gpa: 3.92, ers: 89, academicScore: 96, skillsScore: 85, softSkillsScore: 82, certifications: ["AWS Solutions Architect", "Scrum Master"], badges: ["Academic Excellence"], avatar: "SM", roadmapProgress: 65, projects: ["E-commerce Platform", "Mobile Banking App"] },
  { id: "3", name: "Mohammed Al-Zahrani", email: "mohammed@kfupm.edu.sa", university: "KFUPM", major: "Data Science", gpa: 3.78, ers: 86, academicScore: 90, skillsScore: 84, softSkillsScore: 80, certifications: ["Google Data Analytics", "TensorFlow Developer"], badges: ["Data Champion"], avatar: "MZ", roadmapProgress: 55, projects: ["Sentiment Analysis Tool"] },
  { id: "4", name: "Noura Al-Harbi", email: "noura@psu.edu.sa", university: "Prince Sultan University", major: "Artificial Intelligence", gpa: 3.88, ers: 84, academicScore: 92, skillsScore: 80, softSkillsScore: 76, certifications: ["Azure AI Engineer", "Deep Learning Specialization"], badges: ["Innovation Award"], avatar: "NH", roadmapProgress: 70, projects: ["Chatbot Framework", "Image Recognition"] },
  { id: "5", name: "Khalid Al-Otaibi", email: "khalid@kau.edu.sa", university: "King Abdulaziz University", major: "Cybersecurity", gpa: 3.65, ers: 81, academicScore: 85, skillsScore: 78, softSkillsScore: 78, certifications: ["CompTIA Security+", "eJPT"], badges: [], avatar: "KO", roadmapProgress: 42, projects: ["Network Monitor"] },
  { id: "6", name: "Fatimah Al-Rashid", email: "fatimah@ksu.edu.sa", university: "King Saud University", major: "Software Engineering", gpa: 3.70, ers: 79, academicScore: 88, skillsScore: 72, softSkillsScore: 74, certifications: ["React Developer", "Node.js Certified"], badges: ["Team Player"], avatar: "FR", roadmapProgress: 38, projects: ["Portfolio Website"] },
  { id: "7", name: "Omar Al-Dosari", email: "omar@kfupm.edu.sa", university: "KFUPM", major: "Data Science", gpa: 3.55, ers: 75, academicScore: 82, skillsScore: 70, softSkillsScore: 70, certifications: ["Python for Data Science"], badges: [], avatar: "OD", roadmapProgress: 30, projects: [] },
  { id: "8", name: "Lina Al-Qahtani", email: "lina@psu.edu.sa", university: "Prince Sultan University", major: "Artificial Intelligence", gpa: 3.60, ers: 73, academicScore: 84, skillsScore: 66, softSkillsScore: 65, certifications: ["IBM AI Engineering"], badges: [], avatar: "LQ", roadmapProgress: 25, projects: ["Voice Assistant"] },
];

export const opportunities: Opportunity[] = [
  { id: "1", title: "Cybersecurity Intern", company: "Saudi Aramco", type: "internship", location: "Dhahran", skills: ["Network Security", "SIEM", "Python"], posted: "2 days ago" },
  { id: "2", title: "Junior Software Engineer", company: "NEOM", type: "job", location: "Riyadh", skills: ["React", "TypeScript", "Node.js"], posted: "1 week ago" },
  { id: "3", title: "Data Analyst", company: "STC", type: "job", location: "Riyadh", skills: ["SQL", "Python", "Tableau"], posted: "3 days ago" },
  { id: "4", title: "AI Research Assistant", company: "KAUST", type: "project", location: "Thuwal", skills: ["TensorFlow", "NLP", "Research"], posted: "5 days ago" },
  { id: "5", title: "Cloud Engineer Intern", company: "Zain KSA", type: "internship", location: "Riyadh", skills: ["AWS", "Docker", "Linux"], posted: "1 day ago" },
];

export const roadmapItems: RoadmapItem[] = [
  { id: "1", title: "Complete OSCP Certification", type: "certification", priority: "high", completed: true, description: "Advanced penetration testing certification" },
  { id: "2", title: "Build Threat Intelligence Dashboard", type: "project", priority: "high", completed: false, description: "Create a real-time threat monitoring dashboard using SIEM data" },
  { id: "3", title: "AWS Security Specialty", type: "certification", priority: "medium", completed: false, description: "Cloud security certification for AWS environments" },
  { id: "4", title: "Leadership & Communication Workshop", type: "skill", priority: "medium", completed: true, description: "Develop soft skills for team leadership" },
  { id: "5", title: "Malware Analysis Course", type: "course", priority: "low", completed: false, description: "Learn reverse engineering and malware analysis techniques" },
  { id: "6", title: "Contribute to Open Source Security Tool", type: "project", priority: "high", completed: false, description: "Contribute to an open-source security project on GitHub" },
];

export const universities = ["King Abdulaziz University", "King Saud University", "KFUPM", "Prince Sultan University"];
export const majors = ["Cybersecurity", "Software Engineering", "Data Science", "Artificial Intelligence"];

export const ersWeights = {
  academic: 0.5,
  skills: 0.3,
  softSkills: 0.2,
};

export const companies = [
  { name: "Saudi Aramco", sector: "Energy", openRoles: 12 },
  { name: "NEOM", sector: "Technology", openRoles: 8 },
  { name: "STC", sector: "Telecom", openRoles: 15 },
];
