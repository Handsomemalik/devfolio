import * as React from "react";
import { Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { PortfolioPayload } from "@/types/database";
import { CvSettings } from "@/types/database";
import { formatCvDate, parseBulletPoints, groupSkillsByCategory, ensureSafePdfUrl } from "../cv-helpers";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#0F172A",
    lineHeight: 1.4,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#0F172A",
    paddingBottom: 10,
    marginBottom: 12,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: "#000000",
    marginBottom: 2,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#334155",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    fontSize: 8,
    color: "#475569",
  },
  contactLink: {
    color: "#0F172A",
    textDecoration: "none",
  },
  section: {
    marginBottom: 11,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 2,
    marginBottom: 6,
  },
  skillsCategoryRow: {
    flexDirection: "row",
    marginBottom: 3,
    fontSize: 8.5,
  },
  skillsCategoryLabel: {
    fontFamily: "Helvetica-Bold",
    width: "28%",
    color: "#1E293B",
  },
  skillsCategoryList: {
    width: "72%",
    fontFamily: "Courier",
    fontSize: 8,
    color: "#334155",
  },
  entry: {
    marginBottom: 8,
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
    color: "#000000",
  },
  companyText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#334155",
  },
  dateText: {
    fontFamily: "Courier",
    fontSize: 8,
    color: "#475569",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 10,
    fontSize: 8.5,
    color: "#0F172A",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: "#1E293B",
    lineHeight: 1.35,
  },
  techStackTag: {
    fontFamily: "Courier",
    fontSize: 7.5,
    color: "#475569",
    marginTop: 1,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 7.5,
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#94A3B8",
  },
});

interface TemplateProps {
  data: PortfolioPayload;
  settings: CvSettings;
}

export function TechnicalPdfTemplate({ data, settings }: TemplateProps) {
  const { profile, skills, experiences, education, projects, certifications, social_links } = data;
  const pageSize = settings.paper_size || "A4";
  const skillGroups = groupSkillsByCategory(skills || []);

  return (
    <Page size={pageSize} style={styles.page}>
      {/* Plain ATS Structured Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{profile.full_name || "Alex Vance"}</Text>
        <Text style={styles.title}>{profile.professional_title || "Software Engineer & Architect"}</Text>

        <View style={styles.contactRow}>
          {profile.email_public && (
            <Link src={`mailto:${profile.email_public}`} style={styles.contactLink}>
              <Text>{profile.email_public}</Text>
            </Link>
          )}
          {profile.phone_public && <Text>|  {profile.phone_public}</Text>}
          {profile.location && <Text>|  {profile.location}</Text>}
          {profile.website && (
            <Link src={ensureSafePdfUrl(profile.website)!} style={styles.contactLink}>
              <Text>|  {profile.website.replace(/^https?:\/\//, "")}</Text>
            </Link>
          )}
          {social_links && social_links.length > 0 && (
            <Link src={ensureSafePdfUrl(social_links[0].url)!} style={styles.contactLink}>
              <Text>|  {social_links[0].url.replace(/^https?:\/\//, "")}</Text>
            </Link>
          )}
        </View>
      </View>

      {/* Prominent Technical Skills Block */}
      {settings.sections.skills && skills && skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Technical Skills &amp; Competencies</Text>
          {Object.entries(skillGroups).map(([cat, list]) => (
            <View key={cat} style={styles.skillsCategoryRow}>
              <Text style={styles.skillsCategoryLabel}>{cat}:</Text>
              <Text style={styles.skillsCategoryList}>
                {list.map((s) => s.name).join(", ")}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Technical Summary */}
      {settings.sections.summary && (profile.about_me || profile.short_bio) && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={{ fontSize: 8.5, color: "#1E293B", lineHeight: 1.45 }}>
            {profile.about_me || profile.short_bio}
          </Text>
        </View>
      )}

      {/* Professional Experience */}
      {settings.sections.experience && experiences && experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle} wrap={false}>Professional Experience</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.roleText}>
                  {exp.role} <Text style={styles.companyText}>— {exp.company}</Text>
                </Text>
                <Text style={styles.dateText}>
                  {formatCvDate(exp.start_date)} – {exp.is_current ? "Present" : formatCvDate(exp.end_date)}
                </Text>
              </View>
              {parseBulletPoints(exp.description).map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Projects with Tech Stack Specification */}
      {settings.sections.projects && projects && projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle} wrap={false}>Technical Projects</Text>
          {projects.map((proj) => (
            <View key={proj.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.roleText}>{proj.title}</Text>
                {proj.live_url && (
                  <Link src={ensureSafePdfUrl(proj.live_url)!} style={{ textDecoration: "none" }}>
                    <Text style={{ fontSize: 7.5, fontFamily: "Courier", color: "#0F172A" }}>
                      [Link]
                    </Text>
                  </Link>
                )}
              </View>
              {proj.description && (
                <Text style={{ fontSize: 8.5, color: "#1E293B", marginBottom: 2 }}>
                  {proj.description}
                </Text>
              )}
              {proj.tech_stack && proj.tech_stack.length > 0 && (
                <Text style={styles.techStackTag}>
                  Technologies: {proj.tech_stack.join(", ")}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {settings.sections.education && education && education.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.roleText}>
                  {edu.institution}{edu.degree ? ` — ${edu.degree}` : ""}
                </Text>
                <Text style={styles.dateText}>
                  {edu.start_year}{edu.end_year ? ` – ${edu.end_year}` : ""}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {settings.sections.certifications && certifications && certifications.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {certifications.map((c) => (
            <View key={c.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
              <Text style={{ fontSize: 8.5, color: "#0F172A" }}>
                {c.name} ({c.issuer})
              </Text>
              {c.year && <Text style={styles.dateText}>{c.year}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Page Number */}
      <Text
        render={({ pageNumber, totalPages }) => (totalPages > 1 ? `${pageNumber} / ${totalPages}` : "")}
        fixed
        style={styles.pageNumber}
      />
    </Page>
  );
}
