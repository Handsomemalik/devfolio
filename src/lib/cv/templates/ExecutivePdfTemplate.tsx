import * as React from "react";
import { Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import { PortfolioPayload } from "@/types/database";
import { CvSettings } from "@/types/database";
import { formatCvDate, parseBulletPoints, ensureSafePdfUrl } from "../cv-helpers";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 42,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: "#1E293B",
    lineHeight: 1.45,
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
  },
  name: {
    fontFamily: "Times-Bold",
    fontSize: 22,
    color: "#0F172A",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  title: {
    fontFamily: "Helvetica",
    fontSize: 10,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    fontSize: 8.5,
    color: "#64748B",
  },
  contactLink: {
    color: "#475569",
    textDecoration: "none",
  },
  dividerDot: {
    color: "#94A3B8",
    marginHorizontal: 3,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitleRow: {
    borderBottomWidth: 1,
    paddingBottom: 3,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#0F172A",
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
  entryTitle: {
    fontFamily: "Times-Bold",
    fontSize: 10,
    color: "#0F172A",
  },
  entrySubtitle: {
    fontFamily: "Helvetica-Oblique",
    fontSize: 9,
    color: "#475569",
  },
  entryDate: {
    fontSize: 8.5,
    color: "#64748B",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
    color: "#475569",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: "#334155",
    lineHeight: 1.4,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillChip: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    fontSize: 8,
    color: "#334155",
    marginBottom: 3,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 18,
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

export function ExecutivePdfTemplate({ data, settings }: TemplateProps) {
  const { profile, skills, experiences, education, projects, certifications, social_links } = data;
  const accent = settings.accent_color || "#6366F1";
  const pageSize = settings.paper_size || "A4";

  return (
    <Page size={pageSize} style={styles.page}>
      {/* Centered Executive Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{profile.full_name || "Alex Vance"}</Text>
        <Text style={styles.title}>{profile.professional_title || "Technology Leader"}</Text>

        <View style={styles.contactRow}>
          {profile.email_public && (
            <Link src={`mailto:${profile.email_public}`} style={styles.contactLink}>
              <Text>{profile.email_public}</Text>
            </Link>
          )}
          {profile.email_public && profile.phone_public && <Text style={styles.dividerDot}>•</Text>}
          {profile.phone_public && <Text>{profile.phone_public}</Text>}
          {profile.location && (profile.email_public || profile.phone_public) && (
            <Text style={styles.dividerDot}>•</Text>
          )}
          {profile.location && <Text>{profile.location}</Text>}
          {profile.website && (
            <>
              <Text style={styles.dividerDot}>•</Text>
              <Link src={ensureSafePdfUrl(profile.website)!} style={styles.contactLink}>
                <Text>{profile.website.replace(/^https?:\/\//, "")}</Text>
              </Link>
            </>
          )}
          {social_links && social_links.length > 0 && (
            <>
              <Text style={styles.dividerDot}>•</Text>
              <Link src={ensureSafePdfUrl(social_links[0].url)!} style={styles.contactLink}>
                <Text>{social_links[0].platform}</Text>
              </Link>
            </>
          )}
        </View>
      </View>

      {/* Summary Section */}
      {settings.sections.summary && (profile.about_me || profile.short_bio) && (
        <View style={styles.section} wrap={false}>
          <View style={[styles.sectionTitleRow, { borderBottomColor: accent }]}>
            <Text style={styles.sectionTitle}>Executive Profile</Text>
          </View>
          <Text style={{ fontSize: 9, lineHeight: 1.5, color: "#334155" }}>
            {profile.about_me || profile.short_bio}
          </Text>
        </View>
      )}

      {/* Professional Experience */}
      {settings.sections.experience && experiences && experiences.length > 0 && (
        <View style={styles.section}>
          <View style={[styles.sectionTitleRow, { borderBottomColor: accent }]} wrap={false}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
          </View>
          {experiences.map((exp) => (
            <View key={exp.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {exp.role} <Text style={styles.entrySubtitle}>— {exp.company}</Text>
                </Text>
                <Text style={styles.entryDate}>
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

      {/* Core Competencies / Skills */}
      {settings.sections.skills && skills && skills.length > 0 && (
        <View style={styles.section} wrap={false}>
          <View style={[styles.sectionTitleRow, { borderBottomColor: accent }]}>
            <Text style={styles.sectionTitle}>Core Competencies &amp; Skills</Text>
          </View>
          <View style={styles.skillsRow}>
            {skills.map((s) => (
              <Text key={s.id} style={styles.skillChip}>
                {s.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Featured Projects */}
      {settings.sections.projects && projects && projects.length > 0 && (
        <View style={styles.section}>
          <View style={[styles.sectionTitleRow, { borderBottomColor: accent }]} wrap={false}>
            <Text style={styles.sectionTitle}>Key Initiatives &amp; Projects</Text>
          </View>
          {projects.map((proj) => (
            <View key={proj.id} style={styles.entry} wrap={false}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{proj.title}</Text>
                {proj.live_url && (
                  <Link src={ensureSafePdfUrl(proj.live_url)!} style={styles.contactLink}>
                    <Text style={{ fontSize: 8, color: accent }}>Live Reference ↗</Text>
                  </Link>
                )}
              </View>
              {proj.description && (
                <Text style={{ fontSize: 8.5, color: "#334155", marginBottom: 3 }}>
                  {proj.description}
                </Text>
              )}
              {proj.tech_stack && proj.tech_stack.length > 0 && (
                <Text style={{ fontSize: 7.5, color: "#64748B", fontFamily: "Helvetica-Oblique" }}>
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
          <View style={[styles.sectionTitleRow, { borderBottomColor: accent }]}>
            <Text style={styles.sectionTitle}>Education</Text>
          </View>
          {education.map((edu) => (
            <View key={edu.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>
                  {edu.institution}{" "}
                  {edu.degree && <Text style={styles.entrySubtitle}>— {edu.degree}</Text>}
                </Text>
                <Text style={styles.entryDate}>
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
          <View style={[styles.sectionTitleRow, { borderBottomColor: accent }]}>
            <Text style={styles.sectionTitle}>Certifications &amp; Credentials</Text>
          </View>
          {certifications.map((cert) => (
            <View key={cert.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
              <Text style={{ fontSize: 8.5, fontFamily: "Times-Bold" }}>
                {cert.name} <Text style={{ fontFamily: "Helvetica", color: "#64748B" }}>({cert.issuer})</Text>
              </Text>
              {cert.year && <Text style={styles.entryDate}>{cert.year}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Page Numbers */}
      <Text
        render={({ pageNumber, totalPages }) => (totalPages > 1 ? `${pageNumber} / ${totalPages}` : "")}
        fixed
        style={styles.pageNumber}
      />
    </Page>
  );
}
