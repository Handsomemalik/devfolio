import { create } from "zustand";
import {
  Profile,
  SocialLink,
  SocialPlatform,
  Skill,
  Experience,
  Education,
  Project,
  Certification,
  Testimonial,
  PortfolioPayload,
} from "@/types/database";

export interface EditorSnapshot {
  profile: Profile;
  social_links: SocialLink[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  testimonials: Testimonial[];
}

export const INITIAL_DEFAULT_PROFILE: Profile = {
  id: "demo-profile-id",
  user_id: "demo-user-id",
  username: "alex-vance",
  full_name: "Alex Vance",
  professional_title: "Principal Creative Technologist",
  headline: "Crafting fluid digital experiences at the intersection of motion, code & aesthetics.",
  short_bio: "8+ years turning complex systems into cinematic web interfaces.",
  about_me:
    "I believe great software should feel alive. My focus is on high-performance web applications, procedural animations, and design systems that scale effortlessly across devices.",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  email_public: "alex@example.com",
  phone_public: "+1 (555) 382-9012",
  location: "San Francisco, CA",
  website: "https://folionova.io",
  open_to_work: true,
  years_of_experience: 8,
  languages: ["English (Native)", "French (Conversational)"],
  is_published: true,
  design_id: "aurora",
  cv_template_id: "executive",
  theme_mode: "dark",
  accent_color: "#6366F1",
  font_style: "inter",
  show_email: true,
  show_phone: false,
  seo_title: "Alex Vance — Creative Technologist & UI Engineer",
  seo_description: "Portfolio of Alex Vance. Engineering fluid motion and robust web applications.",
  view_count: 1240,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const INITIAL_DEFAULT_SKILLS: Skill[] = [
  { id: "s-1", profile_id: "demo", name: "TypeScript", level: 5, category: "Languages", sort_order: 0 },
  { id: "s-2", profile_id: "demo", name: "Next.js / React", level: 5, category: "Frameworks", sort_order: 1 },
  { id: "s-3", profile_id: "demo", name: "Framer Motion", level: 5, category: "Creative", sort_order: 2 },
  { id: "s-4", profile_id: "demo", name: "GSAP & ScrollTrigger", level: 4, category: "Creative", sort_order: 3 },
  { id: "s-5", profile_id: "demo", name: "PostgreSQL & Supabase", level: 4, category: "Backend", sort_order: 4 },
  { id: "s-6", profile_id: "demo", name: "Design Systems", level: 5, category: "Design", sort_order: 5 },
  { id: "s-7", profile_id: "demo", name: "Tailwind CSS", level: 5, category: "Styling", sort_order: 6 },
  { id: "s-8", profile_id: "demo", name: "WebGL / Three.js", level: 3, category: "Graphics", sort_order: 7 },
];

export const INITIAL_DEFAULT_EXPERIENCES: Experience[] = [
  {
    id: "e-1",
    profile_id: "demo",
    company: "Vanguard Studio",
    role: "Lead Creative Technologist",
    location: "San Francisco, CA",
    start_date: "2023",
    end_date: "Present",
    is_current: true,
    description: "• Architected high-performance design system adopted by 12 cross-functional teams.\n• Built kinetic marketing experiences driving 42% lift in conversion rates.\n• Led engineering quality, accessibility, and sub-100ms response targets.",
    sort_order: 0,
  },
  {
    id: "e-2",
    profile_id: "demo",
    company: "Hyperion Labs",
    role: "Senior Frontend Engineer",
    location: "New York, NY",
    start_date: "2020",
    end_date: "2023",
    is_current: false,
    description: "• Spearheaded core UI re-architecture using React and TypeScript.\n• Mentored 6 junior engineers and authored front-end best practice RFCs.\n• Reduced web app bundle size by 38% through route-level code splitting.",
    sort_order: 1,
  },
];

export const INITIAL_DEFAULT_EDUCATION: Education[] = [
  {
    id: "ed-1",
    profile_id: "demo",
    institution: "University of California, Berkeley",
    degree: "B.S. in Computer Science",
    field: "Human-Computer Interaction",
    start_year: "2016",
    end_year: "2020",
    grade: "3.9 GPA / Honors",
    description: "Specialized in computer graphics, interface design, and distributed algorithms.",
    sort_order: 0,
  },
];

export const INITIAL_DEFAULT_PROJECTS: Project[] = [
  {
    id: "p-1",
    profile_id: "demo",
    title: "Aura Motion Studio",
    description: "Procedural layout engine allowing real-time CSS spring tuning with exportable code.",
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    live_url: "https://example.com/aura",
    repo_url: "https://github.com/example/aura",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    featured: true,
    sort_order: 0,
  },
  {
    id: "p-2",
    profile_id: "demo",
    title: "Lumina Design System",
    description: "Token-driven component system with automatic contrast audits and dark-mode sync.",
    tech_stack: ["React", "Radix UI", "Zustand", "Tailwind"],
    live_url: "https://example.com/lumina",
    repo_url: "https://github.com/example/lumina",
    image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    featured: true,
    sort_order: 1,
  },
  {
    id: "p-3",
    profile_id: "demo",
    title: "Vortex Analytics",
    description: "Sub-millisecond event streaming visualization engine built for high throughput telemetry.",
    tech_stack: ["TypeScript", "Canvas", "Supabase", "WebSockets"],
    live_url: "https://example.com/vortex",
    repo_url: "https://github.com/example/vortex",
    image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    featured: false,
    sort_order: 2,
  },
];

export const INITIAL_DEFAULT_SOCIALS: SocialLink[] = [
  { id: "sl-1", profile_id: "demo", platform: "github", url: "https://github.com", sort_order: 0 },
  { id: "sl-2", profile_id: "demo", platform: "linkedin", url: "https://linkedin.com", sort_order: 1 },
  { id: "sl-3", profile_id: "demo", platform: "x", url: "https://x.com", sort_order: 2 },
];

export const INITIAL_DEFAULT_CERTIFICATIONS: Certification[] = [
  { id: "c-1", profile_id: "demo", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2023", url: "https://aws.amazon.com", sort_order: 0 },
];

export const INITIAL_DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "t-1", profile_id: "demo", author: "Sarah Lin", role: "VP of Product, Vanguard", quote: "Alex is that rare technologist who delivers pristine engineering while maintaining world-class design taste. An absolute powerhouse.", sort_order: 0 },
];

interface EditorState {
  // Current data
  profile: Profile;
  social_links: SocialLink[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  testimonials: Testimonial[];

  // Editor Meta State
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  activeTab: string;
  previewDevice: "desktop" | "tablet" | "mobile";
  previewTheme: "dark" | "light";

  // History Stack (Undo / Redo)
  past: EditorSnapshot[];
  future: EditorSnapshot[];

  // Actions
  setInitialData: (data: Partial<EditorSnapshot>) => void;
  updateProfile: (partial: Partial<Profile>) => void;
  
  // Skills
  addSkill: (skill: { name: string; level?: number | null; category?: string | null }) => void;
  updateSkill: (id: string, partial: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (skills: Skill[]) => void;

  // Experiences
  addExperience: (exp: { company: string; role: string; location?: string | null; start_date?: string; end_date?: string | null; is_current?: boolean; description?: string | null }) => void;
  updateExperience: (id: string, partial: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;

  // Education
  addEducation: (edu: { institution: string; degree?: string | null; field?: string | null; start_year?: string | null; end_year?: string | null; grade?: string | null; description?: string | null }) => void;
  updateEducation: (id: string, partial: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (education: Education[]) => void;

  // Projects
  addProject: (proj: { title: string; description?: string | null; tech_stack?: string[]; live_url?: string | null; repo_url?: string | null; image_url?: string | null; featured?: boolean }) => void;
  updateProject: (id: string, partial: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (projects: Project[]) => void;

  // Social Links
  addSocialLink: (link: { platform: SocialPlatform; url: string }) => void;
  updateSocialLink: (id: string, partial: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;

  // Certifications & Testimonials
  addCertification: (cert: { name: string; issuer: string; year?: string | null; url?: string | null }) => void;
  removeCertification: (id: string) => void;
  addTestimonial: (test: { author: string; quote: string; role?: string | null }) => void;
  removeTestimonial: (id: string) => void;

  // Editor controls
  setActiveTab: (tab: string) => void;
  setPreviewDevice: (device: "desktop" | "tablet" | "mobile") => void;
  setPreviewTheme: (theme: "dark" | "light") => void;
  setSaving: (isSaving: boolean) => void;
  markSaved: () => void;
  resetToDefault: () => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const MAX_HISTORY = 25;

function createSnapshot(state: EditorState): EditorSnapshot {
  return {
    profile: { ...state.profile },
    social_links: [...state.social_links],
    skills: [...state.skills],
    experiences: [...state.experiences],
    education: [...state.education],
    projects: [...state.projects],
    certifications: [...state.certifications],
    testimonials: [...state.testimonials],
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  profile: INITIAL_DEFAULT_PROFILE,
  social_links: INITIAL_DEFAULT_SOCIALS,
  skills: INITIAL_DEFAULT_SKILLS,
  experiences: INITIAL_DEFAULT_EXPERIENCES,
  education: INITIAL_DEFAULT_EDUCATION,
  projects: INITIAL_DEFAULT_PROJECTS,
  certifications: INITIAL_DEFAULT_CERTIFICATIONS,
  testimonials: INITIAL_DEFAULT_TESTIMONIALS,

  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  activeTab: "personal",
  previewDevice: "desktop",
  previewTheme: "dark",

  past: [],
  future: [],

  setInitialData: (data) => {
    set((state) => ({
      profile: data.profile ? { ...state.profile, ...data.profile } : state.profile,
      social_links: data.social_links ?? state.social_links,
      skills: data.skills ?? state.skills,
      experiences: data.experiences ?? state.experiences,
      education: data.education ?? state.education,
      projects: data.projects ?? state.projects,
      certifications: data.certifications ?? state.certifications,
      testimonials: data.testimonials ?? state.testimonials,
      past: [],
      future: [],
      isDirty: false,
    }));
  },

  updateProfile: (partial) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      profile: { ...state.profile, ...partial },
    }));
  },

  addSkill: (skill) => {
    const currentSnapshot = createSnapshot(get());
    const newSkill: Skill = {
      id: "skill-" + Math.random().toString(36).substring(2, 9),
      profile_id: get().profile.id,
      name: skill.name,
      level: skill.level ?? null,
      category: skill.category ?? null,
      sort_order: get().skills.length,
    };
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      skills: [...state.skills, newSkill],
    }));
  },

  updateSkill: (id, partial) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      skills: state.skills.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    }));
  },

  removeSkill: (id) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      skills: state.skills.filter((s) => s.id !== id),
    }));
  },

  reorderSkills: (skills) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      skills: skills.map((s, idx) => ({ ...s, sort_order: idx })),
    }));
  },

  addExperience: (exp) => {
    const currentSnapshot = createSnapshot(get());
    const newExp: Experience = {
      id: "exp-" + Math.random().toString(36).substring(2, 9),
      profile_id: get().profile.id,
      company: exp.company,
      role: exp.role,
      location: exp.location ?? null,
      start_date: exp.start_date || "2024",
      end_date: exp.end_date ?? null,
      is_current: exp.is_current ?? false,
      description: exp.description ?? null,
      sort_order: get().experiences.length,
    };
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      experiences: [newExp, ...state.experiences],
    }));
  },

  updateExperience: (id, partial) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      experiences: state.experiences.map((e) => (e.id === id ? { ...e, ...partial } : e)),
    }));
  },

  removeExperience: (id) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      experiences: state.experiences.filter((e) => e.id !== id),
    }));
  },

  reorderExperiences: (experiences) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      experiences: experiences.map((e, idx) => ({ ...e, sort_order: idx })),
    }));
  },

  addEducation: (edu) => {
    const currentSnapshot = createSnapshot(get());
    const newEdu: Education = {
      id: "edu-" + Math.random().toString(36).substring(2, 9),
      profile_id: get().profile.id,
      institution: edu.institution,
      degree: edu.degree ?? null,
      field: edu.field ?? null,
      start_year: edu.start_year ?? null,
      end_year: edu.end_year ?? null,
      grade: edu.grade ?? null,
      description: edu.description ?? null,
      sort_order: get().education.length,
    };
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      education: [newEdu, ...state.education],
    }));
  },

  updateEducation: (id, partial) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      education: state.education.map((ed) => (ed.id === id ? { ...ed, ...partial } : ed)),
    }));
  },

  removeEducation: (id) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      education: state.education.filter((ed) => ed.id !== id),
    }));
  },

  reorderEducation: (education) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      education: education.map((ed, idx) => ({ ...ed, sort_order: idx })),
    }));
  },

  addProject: (proj) => {
    const currentSnapshot = createSnapshot(get());
    const newProj: Project = {
      id: "proj-" + Math.random().toString(36).substring(2, 9),
      profile_id: get().profile.id,
      title: proj.title,
      description: proj.description ?? null,
      tech_stack: proj.tech_stack ?? [],
      live_url: proj.live_url ?? null,
      repo_url: proj.repo_url ?? null,
      image_url: proj.image_url ?? null,
      featured: proj.featured ?? false,
      sort_order: get().projects.length,
    };
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      projects: [newProj, ...state.projects],
    }));
  },

  updateProject: (id, partial) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    }));
  },

  removeProject: (id) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      projects: state.projects.filter((p) => p.id !== id),
    }));
  },

  reorderProjects: (projects) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      projects: projects.map((p, idx) => ({ ...p, sort_order: idx })),
    }));
  },

  addSocialLink: (link) => {
    const currentSnapshot = createSnapshot(get());
    const newLink: SocialLink = {
      id: "soc-" + Math.random().toString(36).substring(2, 9),
      profile_id: get().profile.id,
      platform: link.platform,
      url: link.url,
      sort_order: get().social_links.length,
    };
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      social_links: [...state.social_links, newLink],
    }));
  },

  updateSocialLink: (id, partial) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      social_links: state.social_links.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    }));
  },

  removeSocialLink: (id) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      social_links: state.social_links.filter((s) => s.id !== id),
    }));
  },

  addCertification: (cert) => {
    const currentSnapshot = createSnapshot(get());
    const newCert: Certification = {
      id: "cert-" + Math.random().toString(36).substring(2, 9),
      profile_id: get().profile.id,
      name: cert.name,
      issuer: cert.issuer,
      year: cert.year ?? null,
      url: cert.url ?? null,
      sort_order: get().certifications.length,
    };
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      certifications: [...state.certifications, newCert],
    }));
  },

  removeCertification: (id) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      certifications: state.certifications.filter((c) => c.id !== id),
    }));
  },

  addTestimonial: (test) => {
    const currentSnapshot = createSnapshot(get());
    const newTest: Testimonial = {
      id: "test-" + Math.random().toString(36).substring(2, 9),
      profile_id: get().profile.id,
      author: test.author,
      role: test.role ?? null,
      quote: test.quote,
      sort_order: get().testimonials.length,
    };
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      testimonials: [...state.testimonials, newTest],
    }));
  },

  removeTestimonial: (id) => {
    const currentSnapshot = createSnapshot(get());
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY), currentSnapshot],
      future: [],
      isDirty: true,
      testimonials: state.testimonials.filter((t) => t.id !== id),
    }));
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  setPreviewDevice: (previewDevice) => set({ previewDevice }),
  setPreviewTheme: (previewTheme) => set({ previewTheme }),
  setSaving: (isSaving) => set({ isSaving }),
  markSaved: () => set({ isDirty: false, lastSavedAt: new Date().toLocaleTimeString() }),

  resetToDefault: () => {
    set({
      profile: INITIAL_DEFAULT_PROFILE,
      social_links: INITIAL_DEFAULT_SOCIALS,
      skills: INITIAL_DEFAULT_SKILLS,
      experiences: INITIAL_DEFAULT_EXPERIENCES,
      education: INITIAL_DEFAULT_EDUCATION,
      projects: INITIAL_DEFAULT_PROJECTS,
      certifications: INITIAL_DEFAULT_CERTIFICATIONS,
      testimonials: INITIAL_DEFAULT_TESTIMONIALS,
      isDirty: true,
      past: [],
      future: [],
    });
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    const currentSnapshot = createSnapshot(get());

    set({
      profile: previous.profile,
      social_links: previous.social_links,
      skills: previous.skills,
      experiences: previous.experiences,
      education: previous.education,
      projects: previous.projects,
      certifications: previous.certifications,
      testimonials: previous.testimonials,
      past: newPast,
      future: [currentSnapshot, ...future],
      isDirty: true,
    });
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);
    const currentSnapshot = createSnapshot(get());

    set({
      profile: next.profile,
      social_links: next.social_links,
      skills: next.skills,
      experiences: next.experiences,
      education: next.education,
      projects: next.projects,
      certifications: next.certifications,
      testimonials: next.testimonials,
      past: [...past, currentSnapshot],
      future: newFuture,
      isDirty: true,
    });
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
