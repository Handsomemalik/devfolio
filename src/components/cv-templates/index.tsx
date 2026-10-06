"use client";

import * as React from "react";
import { CVTemplateId } from "@/config/cv-templates";
import { PortfolioPayload, Skill, Experience, Education } from "@/types/database";

export interface CVTemplateRendererProps {
  data: PortfolioPayload;
}

/* ========================================================================= */
/* 1. EXECUTIVE CV (CLASSIC SINGLE COLUMN)                                   */
/* ========================================================================= */
export function ExecutiveCV({ data }: CVTemplateRendererProps) {
  const { profile, skills, experiences, education } = data;

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-md rounded-lg font-serif text-left space-y-6">
      {/* Header */}
      <div className="text-center border-b border-slate-300 pb-5 space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {profile.full_name || "Alex Vance"}
        </h1>
        <p className="text-sm font-semibold text-slate-700 tracking-wide uppercase font-sans">
          {profile.professional_title || "Executive Director & Technology Leader"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 font-sans pt-1">
          {profile.email_public && <span>{profile.email_public}</span>}
          {profile.phone_public && <span>• {profile.phone_public}</span>}
          {profile.location && <span>• {profile.location}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {(profile.about_me || profile.short_bio) && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 font-sans">
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 font-sans">
            {profile.about_me || profile.short_bio}
          </p>
        </div>
      )}

      {/* Experience History */}
      {experiences && experiences.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1 text-xs font-sans">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                  <span className="font-mono text-[11px] text-slate-600">
                    {exp.start_date} – {exp.is_current ? "Present" : exp.end_date}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-slate-700 leading-relaxed text-[11.5px]">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Competencies */}
      {skills && skills.length > 0 && (
        <div className="space-y-1.5 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Core Competencies &amp; Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.map((s) => (
              <span key={s.id} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-2 font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline text-xs">
              <span className="font-bold text-slate-800">
                {edu.institution} {edu.degree && `— ${edu.degree}`}
              </span>
              <span className="font-mono text-slate-600 text-[11px]">{edu.start_year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 2. MODERN CV (TWO-COLUMN WITH ACCENT SIDEBAR)                             */
/* ========================================================================= */
export function ModernCV({ data }: CVTemplateRendererProps) {
  const { profile, skills, experiences, education } = data;

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-slate-900 shadow-md rounded-lg grid grid-cols-1 md:grid-cols-12 overflow-hidden text-left font-sans">
      {/* Left Sidebar */}
      <div className="md:col-span-4 bg-slate-100 p-6 sm:p-8 space-y-6 border-r border-slate-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            {profile.full_name || "Alex Vance"}
          </h1>
          <p className="text-xs font-semibold text-indigo-600">
            {profile.professional_title}
          </p>
        </div>

        {/* Contact Coordinates */}
        <div className="space-y-2 text-xs text-slate-700">
          <div className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Contact</div>
          {profile.email_public && <div>{profile.email_public}</div>}
          {profile.phone_public && <div>{profile.phone_public}</div>}
          {profile.location && <div>{profile.location}</div>}
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Skills</div>
            <div className="flex flex-wrap gap-1">
              {skills.map((s: Skill) => (
                <span key={s.id} className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-700 font-medium">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Education</div>
            {education.map((edu: Education) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="font-bold text-slate-800">{edu.institution}</div>
                <div className="text-[11px] text-slate-600">{edu.degree}</div>
                <div className="text-[10px] text-slate-500">{edu.start_year}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Main Body */}
      <div className="md:col-span-8 p-6 sm:p-8 space-y-6">
        {(profile.about_me || profile.short_bio) && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Profile Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-700">
              {profile.about_me || profile.short_bio}
            </p>
          </div>
        )}

        {experiences && experiences.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-slate-100 pb-1">
              Work Experience
            </h2>
            {experiences.map((exp: Experience) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-bold text-slate-900">{exp.role}</h4>
                  <span className="text-[11px] text-slate-500">{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
                </div>
                <div className="text-xs font-medium text-slate-700">{exp.company}</div>
                {exp.description && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 3. CREATIVE CV (INDIGO BAR ACCENT & STACK CALLOUTS)                       */
/* ========================================================================= */
export function CreativeCV({ data }: CVTemplateRendererProps) {
  const { profile, skills, experiences, education } = data;

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-md rounded-lg font-sans text-left space-y-6">
      <div className="border-l-4 border-indigo-600 pl-4 space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          {profile.full_name || "Alex Vance"}
        </h1>
        <p className="text-sm font-bold text-indigo-600 uppercase tracking-wide">
          {profile.professional_title}
        </p>
        <p className="text-xs text-slate-500">
          {profile.email_public} • {profile.location}
        </p>
      </div>

      {(profile.about_me || profile.short_bio) && (
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 leading-relaxed">
          {profile.about_me || profile.short_bio}
        </div>
      )}

      {experiences && experiences.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1">
            Experience History
          </h3>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="space-y-1 text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{exp.role} · <span className="text-indigo-700">{exp.company}</span></span>
                  <span className="text-slate-500 font-mono text-[11px]">{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-indigo-600 pb-1">
            Technical Stack
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s.id} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-600 text-white">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 4. MINIMAL CV (SWISS MONOCHROME ATS LAYOUT)                               */
/* ========================================================================= */
export function MinimalCV({ data }: CVTemplateRendererProps) {
  const { profile, skills, experiences, education } = data;

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-slate-950 p-8 sm:p-12 shadow-md rounded-lg font-mono text-left space-y-6 text-xs">
      <div className="border-b-2 border-slate-950 pb-4 flex justify-between items-end flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">{profile.full_name || "Alex Vance"}</h1>
          <p className="text-xs text-slate-600 uppercase">{profile.professional_title}</p>
        </div>
        <div className="text-right text-[11px] text-slate-600">
          <div>{profile.email_public}</div>
          <div>{profile.location}</div>
        </div>
      </div>

      {experiences && experiences.length > 0 && (
        <div className="space-y-3">
          <div className="font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5">
            {"// EXPERIENCE"}
          </div>
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold">
                <span>{exp.role} [{exp.company}]</span>
                <span className="text-slate-500 text-[10px]">{exp.start_date} - {exp.is_current ? "PRES" : exp.end_date}</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px] font-sans">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="space-y-2">
          <div className="font-bold uppercase tracking-wider border-b border-slate-300 pb-0.5">
            {"// SKILLS"}
          </div>
          <p className="text-slate-800 leading-relaxed font-sans text-xs">
            {skills.map((s) => s.name).join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 5. TECHNICAL CV (ATS-OPTIMIZED SOFTWARE ENGINEER RESUME)                  */
/* ========================================================================= */
export function TechnicalCV({ data }: CVTemplateRendererProps) {
  const { profile, skills, experiences, education } = data;

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-md rounded-lg font-sans text-left space-y-5 text-xs">
      {/* Header */}
      <div className="text-center space-y-1 border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {profile.full_name || "Alex Vance"}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 text-slate-600 text-[11px]">
          {profile.email_public && <span>{profile.email_public}</span>}
          {profile.location && <span>• {profile.location}</span>}
          {profile.website && <span>• {profile.website}</span>}
        </div>
      </div>

      {/* Skills Matrix */}
      {skills && skills.length > 0 && (
        <div className="space-y-1">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 text-[11px]">
            Technical Skills &amp; Stack
          </h2>
          <p className="text-slate-700 leading-relaxed pt-1">
            <span className="font-semibold text-slate-900">Core Technologies:</span>{" "}
            {skills.map((s) => s.name).join(", ")}
          </p>
        </div>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 text-[11px]">
            Work Experience
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{exp.role} <span className="font-normal text-slate-600">| {exp.company}</span></span>
                <span className="text-slate-500 font-mono text-[10px]">{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
              </div>
              {exp.description && (
                <p className="text-slate-700 leading-relaxed text-[11px] pl-2 border-l border-slate-200">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="space-y-1">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5 text-[11px]">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline">
              <span className="font-semibold text-slate-900">{edu.institution} {edu.degree && `— ${edu.degree}`}</span>
              <span className="text-slate-500 text-[10px]">{edu.start_year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* 6. ELEGANT CV (WARM BOUTIQUE EDITORIAL)                                   */
/* ========================================================================= */
export function ElegantCV({ data }: CVTemplateRendererProps) {
  const { profile, skills, experiences, education } = data;

  return (
    <div className="w-full max-w-[800px] mx-auto bg-[#FAF8F5] text-[#2D2A26] p-8 sm:p-12 shadow-md rounded-lg font-serif text-left space-y-6">
      <div className="text-center border-b border-amber-900/20 pb-6 space-y-2">
        <h1 className="text-3xl font-normal italic tracking-wide text-[#1A1816]">
          {profile.full_name || "Alex Vance"}
        </h1>
        <p className="text-xs uppercase tracking-widest text-amber-900/80 font-sans font-medium">
          {profile.professional_title}
        </p>
        <p className="text-[11px] text-amber-900/60 font-sans">
          {profile.email_public} • {profile.location}
        </p>
      </div>

      {(profile.about_me || profile.short_bio) && (
        <div className="text-center max-w-lg mx-auto text-xs italic text-amber-950/80 leading-relaxed">
          &ldquo;{profile.about_me || profile.short_bio}&rdquo;
        </div>
      )}

      {experiences && experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-sans uppercase tracking-widest text-amber-900/90 border-b border-amber-900/20 pb-1">
            Experience Chronology
          </h3>
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-1 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-[#1A1816]">{exp.role} — <span className="italic font-normal">{exp.company}</span></span>
                <span className="font-sans text-[10px] text-amber-900/60">{exp.start_date} – {exp.is_current ? "Present" : exp.end_date}</span>
              </div>
              <p className="text-[#4A453F] leading-relaxed text-[11px]">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-sans uppercase tracking-widest text-amber-900/90 border-b border-amber-900/20 pb-1">
            Expertise &amp; Proficiencies
          </h3>
          <div className="flex flex-wrap gap-2 pt-1 font-sans">
            {skills.map((s) => (
              <span key={s.id} className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-900/10 text-amber-950 font-medium">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================================================= */
/* REGISTRY EXPORT                                                           */
/* ========================================================================= */
export const CV_COMPONENTS: Record<
  CVTemplateId,
  React.ComponentType<CVTemplateRendererProps>
> = {
  executive: ExecutiveCV,
  modern: ModernCV,
  creative: CreativeCV,
  minimal: MinimalCV,
  technical: TechnicalCV,
  elegant: ElegantCV,
};
