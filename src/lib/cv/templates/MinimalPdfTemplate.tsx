import * as React from "react";
import { Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { PortfolioPayload } from "@/types/database";
import { CvSettings } from "@/types/database";
import { formatCvDate, parseBulletPoints, ensureSafePdfUrl } from "../cv-helpers";

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 48,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#0F172A",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: "#0F172A",
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  title: {
    fontSize: 9.5,
    color: "#64748B",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    fontSize: 8,
    color: "#64748B",
  },
  contactLink: {
    color: "#334155",
    textDecoration: "none",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#64748B",
    marginBottom: 6,
  },
  entry: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: "#0F172A",
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#475569",
  },
  entryDate: {
    fontSize: 8,
    color: "#94A3B8",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 7.5,
    color: "#94A3B8",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: "#334155",
    lineHeight: 1.4,
  },
  skillsText: {
    fontSize: 8.5,
    color: "#334155",
    lineHeight: 1.6,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 7.5,
    bottom: 20,
    right: 48,
    color: "#CBD5E1",
  },
});

interface TemplateProps {
  data: PortfolioPayload;
  settings: CvSettings;
}

export function MinimalPdfTemplate({ data, settings }: TemplateProps) {
  const { profile, skills, experiences, education, projects, certifications, social_links } = data;
  const accent = settings.accent_color || "#6366F1";
  const pageSize = settings.paper_size || "A4";

  return (
    <Page size={pageSize} style={styles.page}>
      {/* Clean Minimal Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{profile.full_name || "Alex Vance"}</Text>
        <Text style={styles.title}>{profile.professional_title || "Product Designer & Engineer"}</Text>

        <View style={styles.contactRow}>
          {profile.email_public && (
            <Link src={`mailto:${profile.email_public}`} style={styles.contactLink}>
              <Text>{profile.email_public}</Text>
            </Link>
          )}
          {profile.phone_public && <Text>— {profile.phone_public}</Text>}
          {profile.location && <Text>— {profile.location}</Text>}
          {profile.website && (
            <Link src={ensureSafePdfUrl(profile.website)!} style={styles.contactLink}>
              <Text>— {profile.website.replace(/^https?:\/\//, "")}</Text>
            </Link>
          )}
          {social_links && social_links.length > 0 && (
            <Link src={ensureSafePdfUrl(social_links[0].url)!} style={styles.contactLink}>
              <Text>— {social_links[0].url.replace(/^https?:\/\/(www\.)?/, "")}</Text>
            </Link>
          )}
        </View>
      </View>

      {/* Summary */}
      {settings.sections.summary && (profile.about_me || profile.short_bio) && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <Text style={{ fontSize: 8.5, color: "#334155", lineHeight: 1.5 }}>
            {profile.about_me || profile.short_bio}
          </Text>
        </View>
      )}

      {/* Experience */}
      {settings.sections.experience && experiences && experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle} wrap={false}>Experience</Text>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {exp.role} <Text style={styles.entrySubtitle}>, {exp.company}</Text>
                </Text>
                <Text style={styles.entryDate}>
                  {formatCvDate(exp.start_date)} — {exp.is_current ? "Present" : formatCvDate(exp.end_date)}
                </Text>
              </View>
              {parseBulletPoints(exp.description).map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>–</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {settings.sections.skills && skills && skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.skillsText}>
            {skills.map((s) => s.name).join("  ·  ")}
          </Text>
        </View>
      )}

      {/* Projects */}
      {settings.sections.projects && projects && projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle} wrap={false}>Selected Work</Text>
          {projects.map((proj) => (
            <View key={proj.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{proj.title}</Text>
                {proj.live_url && (
                  <Link src={ensureSafePdfUrl(proj.live_url)!} style={{ textDecoration: "none" }}>
                    <Text style={{ fontSize: 7.5, color: accent }}>View project ↗</Text>
                  </Link>
                )}
              </View>
              {proj.description && (
                <Text style={{ fontSize: 8.5, color: "#334155", marginBottom: 2 }}>
                  {proj.description}
                </Text>
              )}
              {proj.tech_stack && proj.tech_stack.length > 0 && (
                <Text style={{ fontSize: 7.5, color: "#94A3B8" }}>
                  {proj.tech_stack.join(", ")}
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
                <Text style={styles.entryTitle}>
                  {edu.institution}{edu.degree ? `, ${edu.degree}` : ""}
                </Text>
                <Text style={styles.entryDate}>
                  {edu.start_year}{edu.end_year ? ` — ${edu.end_year}` : ""}
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
              <Text style={{ fontSize: 8.5, color: "#334155" }}>
                {c.name} ({c.issuer})
              </Text>
              {c.year && <Text style={styles.entryDate}>{c.year}</Text>}
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
