import * as React from "react";
import { Page, Text, View, Link, Image, StyleSheet } from "@react-pdf/renderer";
import { PortfolioPayload } from "@/types/database";
import { CvSettings } from "@/types/database";
import { formatCvDate, parseBulletPoints, ensureSafePdfUrl, getPdfContrastTextColor } from "../cv-helpers";

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1E293B",
    paddingBottom: 36,
  },
  headerBand: {
    paddingTop: 30,
    paddingBottom: 22,
    paddingHorizontal: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  title: {
    fontSize: 10.5,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    opacity: 0.9,
    marginBottom: 8,
  },
  headerContactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 8,
  },
  headerContactLink: {
    textDecoration: "none",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    marginLeft: 16,
  },
  bodyContainer: {
    paddingHorizontal: 36,
    paddingTop: 20,
    flexDirection: "row",
    gap: 24,
  },
  leftCol: {
    width: "65%",
  },
  rightCol: {
    width: "35%",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#0F172A",
    borderBottomWidth: 1.5,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 3,
    marginBottom: 8,
  },
  entry: {
    marginBottom: 9,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  roleText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: "#0F172A",
  },
  companyText: {
    fontSize: 8.5,
    color: "#475569",
    marginBottom: 2,
  },
  dateText: {
    fontSize: 7.5,
    color: "#64748B",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 8,
    color: "#64748B",
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    color: "#334155",
    lineHeight: 1.35,
  },
  projectCard: {
    marginBottom: 8,
    padding: 6,
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    borderLeftWidth: 2,
  },
  projectNumber: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: "#94A3B8",
    marginRight: 4,
  },
  skillPill: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    fontSize: 7.5,
    color: "#0F172A",
    backgroundColor: "#F1F5F9",
    marginBottom: 4,
    marginRight: 4,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 7.5,
    bottom: 14,
    right: 36,
    color: "#94A3B8",
  },
});

interface TemplateProps {
  data: PortfolioPayload;
  settings: CvSettings;
}

export function CreativePdfTemplate({ data, settings }: TemplateProps) {
  const { profile, skills, experiences, education, projects, certifications } = data;
  const accent = settings.accent_color || "#6366F1";
  const headerTextColor = getPdfContrastTextColor(accent);
  const pageSize = settings.paper_size || "A4";
  const showPhoto = settings.include_photo && !!profile.avatar_url;

  return (
    <Page size={pageSize} style={styles.page}>
      {/* Bold Full-Bleed Accent Header Band */}
      <View style={[styles.headerBand, { backgroundColor: accent }]}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.name, { color: headerTextColor }]}>
            {profile.full_name || "Alex Vance"}
          </Text>
          <Text style={[styles.title, { color: headerTextColor }]}>
            {profile.professional_title || "Creative Technologist"}
          </Text>

          <View style={styles.headerContactRow}>
            {profile.email_public && (
              <Link src={`mailto:${profile.email_public}`} style={styles.headerContactLink}>
                <Text style={{ color: headerTextColor, opacity: 0.9 }}>{profile.email_public}</Text>
              </Link>
            )}
            {profile.phone_public && (
              <Text style={{ color: headerTextColor, opacity: 0.9 }}>• {profile.phone_public}</Text>
            )}
            {profile.location && (
              <Text style={{ color: headerTextColor, opacity: 0.9 }}>• {profile.location}</Text>
            )}
            {profile.website && (
              <Link src={ensureSafePdfUrl(profile.website)!} style={styles.headerContactLink}>
                <Text style={{ color: headerTextColor, opacity: 0.9 }}>
                  • {profile.website.replace(/^https?:\/\//, "")}
                </Text>
              </Link>
            )}
          </View>
        </View>

        {showPhoto && <Image src={profile.avatar_url!} style={styles.avatar} />}
      </View>

      {/* Body Two-Column Asymmetrical Grid */}
      <View style={styles.bodyContainer}>
        {/* Left Primary Column: Experience & Projects */}
        <View style={styles.leftCol}>
          {/* Summary */}
          {settings.sections.summary && (profile.about_me || profile.short_bio) && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Profile &amp; Focus</Text>
              <Text style={{ fontSize: 8.5, color: "#334155", lineHeight: 1.45 }}>
                {profile.about_me || profile.short_bio}
              </Text>
            </View>
          )}

          {/* Experience */}
          {settings.sections.experience && experiences && experiences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} wrap={false}>Work Experience</Text>
              {experiences.map((exp) => (
                <View key={exp.id} style={styles.entry} wrap={false}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.roleText}>{exp.role}</Text>
                    <Text style={styles.dateText}>
                      {formatCvDate(exp.start_date)} – {exp.is_current ? "Present" : formatCvDate(exp.end_date)}
                    </Text>
                  </View>
                  <Text style={styles.companyText}>{exp.company}</Text>
                  {parseBulletPoints(exp.description).map((bullet, idx) => (
                    <View key={idx} style={styles.bulletRow}>
                      <Text style={[styles.bulletDot, { color: accent }]}>▸</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Highlighted Projects with Number Markers */}
          {settings.sections.projects && projects && projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle} wrap={false}>Featured Work</Text>
              {projects.map((proj, idx) => (
                <View
                  key={proj.id}
                  style={[styles.projectCard, { borderLeftColor: accent }]}
                  wrap={false}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9 }}>
                      <Text style={[styles.projectNumber, { color: accent }]}>0{idx + 1}.</Text> {proj.title}
                    </Text>
                    {proj.live_url && (
                      <Link src={ensureSafePdfUrl(proj.live_url)!} style={{ textDecoration: "none" }}>
                        <Text style={{ fontSize: 7.5, color: accent }}>Live Project ↗</Text>
                      </Link>
                    )}
                  </View>
                  {proj.description && (
                    <Text style={{ fontSize: 8, color: "#475569", marginBottom: 2 }}>
                      {proj.description}
                    </Text>
                  )}
                  {proj.tech_stack && proj.tech_stack.length > 0 && (
                    <Text style={{ fontSize: 7, color: "#64748B" }}>
                      {proj.tech_stack.join(" • ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Secondary Column: Skills, Education, Languages */}
        <View style={styles.rightCol}>
          {/* Rounded Skill Pills */}
          {settings.sections.skills && skills && skills.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Expertise</Text>
              <View style={styles.skillsWrap}>
                {skills.map((s) => (
                  <Text key={s.id} style={styles.skillPill}>
                    {s.name}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Education */}
          {settings.sections.education && education && education.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 6 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5 }}>{edu.institution}</Text>
                  {edu.degree && <Text style={{ fontSize: 8, color: "#475569" }}>{edu.degree}</Text>}
                  <Text style={{ fontSize: 7.5, color: "#94A3B8" }}>
                    {edu.start_year}{edu.end_year ? ` – ${edu.end_year}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {settings.sections.certifications && certifications && certifications.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Certificates</Text>
              {certifications.map((c) => (
                <View key={c.id} style={{ marginBottom: 4 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8 }}>{c.name}</Text>
                  <Text style={{ fontSize: 7.5, color: "#64748B" }}>
                    {c.issuer} {c.year ? `(${c.year})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Languages */}
          {settings.sections.languages && profile.languages && profile.languages.length > 0 && (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Languages</Text>
              {profile.languages.map((l, i) => (
                <Text key={i} style={{ fontSize: 8, color: "#334155", marginBottom: 2 }}>
                  {l}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Page Number */}
      <Text
        render={({ pageNumber, totalPages }) => (totalPages > 1 ? `${pageNumber} / ${totalPages}` : "")}
        fixed
        style={styles.pageNumber}
      />
    </Page>
  );
}
