import { PortfolioDesignId } from "@/config/designs";
import { CVTemplateId } from "@/config/cv-templates";

export type ThemeMode = "light" | "dark" | "system";
export type FontStyle = "inter" | "sora" | "poppins" | "roboto" | "mono";

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "x"
  | "instagram"
  | "behance"
  | "dribbble"
  | "youtube"
  | "facebook"
  | "website"
  | "other";

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  professional_title: string | null;
  headline: string | null;
  short_bio: string | null;
  about_me: string | null;
  avatar_url: string | null;
  email_public: string | null;
  phone_public: string | null;
  location: string | null;
  website: string | null;
  open_to_work: boolean;
  years_of_experience: number;
  languages: string[];
  is_published: boolean;
  design_id: PortfolioDesignId;
  cv_template_id: CVTemplateId;
  cv_settings?: CvSettings;
  theme_mode: ThemeMode;
  accent_color: string;
  font_style: FontStyle;
  show_email: boolean;
  show_phone: boolean;
  seo_title: string | null;
  seo_description: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type CvPaperSize = "A4" | "LETTER";
export type CvFontPairing = "classic" | "modern" | "editorial";

export interface CvSectionsToggle {
  summary: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  education: boolean;
  certifications: boolean;
  languages: boolean;
}

export interface CvSettings {
  template_id: CVTemplateId;
  accent_color: string;
  include_photo: boolean;
  paper_size: CvPaperSize;
  font_pairing: CvFontPairing;
  sections: CvSectionsToggle;
  section_order: string[];
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: SocialPlatform;
  url: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  profile_id: string;
  name: string;
  level: number | null; // 1-5
  category: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  profile_id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id: string;
  profile_id: string;
  institution: string;
  degree: string | null;
  field: string | null;
  start_year: string | null;
  end_year: string | null;
  grade: string | null;
  description: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  tech_stack: string[];
  live_url: string | null;
  repo_url: string | null;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Certification {
  id: string;
  profile_id: string;
  name: string;
  issuer: string;
  year: string | null;
  url: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  profile_id: string;
  author: string;
  role: string | null;
  quote: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioView {
  id: string;
  profile_id: string;
  viewed_at: string;
  referrer: string | null;
  country: string | null;
  device: string | null;
}

export interface Message {
  id: string;
  profile_id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  ip_hash?: string | null;
  created_at: string;
}

/**
 * Composite portfolio payload containing all user data
 */
export interface PortfolioPayload {
  profile: Profile;
  social_links: SocialLink[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  testimonials: Testimonial[];
}

export type PortfolioData = PortfolioPayload;
export type FontKey = FontStyle;

