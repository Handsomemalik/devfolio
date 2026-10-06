import * as React from "react";
import { Page, Text, View, Link, Image, StyleSheet } from "@react-pdf/renderer";
import { PortfolioPayload } from "@/types/database";
import { CvSettings } from "@/types/database";
import { formatCvDate, parseBulletPoints, ensureSafePdfUrl } from "../cv-helpers";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 9,
    fontFamily: "Times-Roman",
    color: "#1E293B",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 16,
    marginBottom: 16,
  },
  name: {
    fontFamily: "Times-Bold",
    fontSize: 24,
    color: "#0F172A",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    fontWeight: "bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  layoutContainer: {
    flexDirection: "row",
    gap: 22,
  },
  leftRail: {
    width: "30%",
    borderRightWidth: 0.5,
    borderRightColor: "#E2E8F0",
    paddingRight: 14,
  },
  mainArea: {
    width: "70%",
  },
  railSection: {
    marginBottom: 14,
  },
  railTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#475569",
    borderBottomWidth: 1,
    paddingBottom: 2,
    marginBottom: 6,
  },
  contactItem: {
    marginBottom: 4,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#475569",
  },
  mainSection: {
    marginBottom: 13,
  },
  mainSectionTitle: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    letterSpacing: 0.5,
    color: "#0F172A",
    borderBottomWidth: 0.5,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 2,
    marginBottom: 7,
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
    fontFamily: "Times-Bold",
    fontSize: 10,
    color: "#0F172A",
  },
  companyText: {
    fontFamily: "Times-Italic",
    fontSize: 9,
    color: "#334155",
    marginBottom: 2,
  },
  dateText: {
    fontFamily: "Helvetica",
    fontSize: 8,
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
    fontSize: 8.5,
    fontFamily: "Helvetica",
    color: "#334155",
    lineHeight: 1.35,
  },
  skillText: {
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#334155",
    marginBottom: 2.5,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 7.5,
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: "center",
    fontFamily: "Helvetica",
    color: "#94A3B8",
  },
});

interface TemplateProps {
  data: PortfolioPayload;
  settings: CvSettings;
}

export function ElegantPdfTemplate({ data, settings }: TemplateProps) {
  const { profile, skills, experiences, education, projects, certifications, social_links } = data;
  const accent = settings.accent_color || "#6366F1";
  const pageSize = settings.paper_size || "A4";
  const showPhoto = settings.include_photo && !!profile.avatar_url;

  return (
    <Page size={pageSize} style={styles.page}>
      {/* Refined Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{profile.full_name || "Alex Vance"}</Text>
          <Text style={[styles.title, { color: accent }]}>
            {profile.professional_title || "Executive Consultant"}
          </Text>
        </View>

        {showPhoto && <Image src={profile.avatar_url!} style={styles.avatar} />}
      </View>

      <View style={styles.layoutContainer}>
        {/* Left Rail (Contact, Skills, Languages) */}
        <View style={styles.leftRail}>
          <View style={styles.railSection}>
            <Text style={[styles.railTitle, { borderBottomColor: accent }]}>Contact</Text>
            {profile.email_public && (
              <View style={styles.contactItem}>
                <Link src={`mailto:${profile.email_public}`} style={{ textDecoration: "none", color: "#475569" }}>
                  <Text>{profile.email_public}</Text>
                </Link>
              </View>
            )}
            {profile.phone_public && <Text style={styles.contactItem}>{profile.phone_public}</Text>}
            {profile.location && <Text style={styles.contactItem}>{profile.location}</Text>}
            {profile.website && (
              <View style={styles.contactItem}>
                <Link src={ensureSafePdfUrl(profile.website)!} style={{ textDecoration: "none", color: "#475569" }}>
                  <Text>{profile.website.replace(/^https?:\/\//, "")}</Text>
                </Link>
              </View>
            )}
          </View>

          {/* Online Links */}
          {social_links && social_links.length > 0 && (
            <View style={styles.railSection} wrap={false}>
              <Text style={[styles.railTitle, { borderBottomColor: accent }]}>Profiles</Text>
              {social_links.map((s) => (
                <View key={s.id} style={styles.contactItem}>
                  <Link src={ensureSafePdfUrl(s.url)!} style={{ textDecoration: "none", color: "#475569" }}>
                    <Text>{s.platform}</Text>
                  </Link>
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {settings.sections.skills && skills && skills.length > 0 && (
            <View style={styles.railSection} wrap={false}>
              <Text style={[styles.railTitle, { borderBottomColor: accent }]}>Expertise</Text>
              {skills.map((s) => (
                <Text key={s.id} style={styles.skillText}>
                  • {s.name}
                </Text>
              ))}
            </View>
          )}

          {/* Languages */}
          {settings.sections.languages && profile.languages && profile.languages.length > 0 && (
            <View style={styles.railSection} wrap={false}>
              <Text style={[styles.railTitle, { borderBottomColor: accent }]}>Languages</Text>
              {profile.languages.map((l, i) => (
                <Text key={i} style={styles.skillText}>
                  {l}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Main Area (Summary, Experience, Projects, Education) */}
        <View style={styles.mainArea}>
          {/* Summary */}
          {settings.sections.summary && (profile.about_me || profile.short_bio) && (
            <View style={styles.mainSection} wrap={false}>
              <Text style={styles.mainSectionTitle}>Curriculum Vitae</Text>
              <Text style={{ fontSize: 8.5, fontFamily: "Helvetica", color: "#334155", lineHeight: 1.45 }}>
                {profile.about_me || profile.short_bio}
              </Text>
            </View>
          )}

          {/* Experience */}
          {settings.sections.experience && experiences && experiences.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle} wrap={false}>Experience Record</Text>
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
                      <Text style={styles.bulletDot}>–</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Selected Projects */}
          {settings.sections.projects && projects && projects.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainSectionTitle} wrap={false}>Selected Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={styles.entry} wrap={false}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.roleText}>{proj.title}</Text>
                    {proj.live_url && (
                      <Link src={ensureSafePdfUrl(proj.live_url)!} style={{ textDecoration: "none" }}>
                        <Text style={{ fontSize: 7.5, fontFamily: "Helvetica", color: accent }}>Reference ↗</Text>
                      </Link>
                    )}
                  </View>
                  {proj.description && (
                    <Text style={{ fontSize: 8, fontFamily: "Helvetica", color: "#475569", marginBottom: 2 }}>
                      {proj.description}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {settings.sections.education && education && education.length > 0 && (
            <View style={styles.mainSection} wrap={false}>
              <Text style={styles.mainSectionTitle}>Academic Background</Text>
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
            <View style={styles.mainSection} wrap={false}>
              <Text style={styles.mainSectionTitle}>Certifications</Text>
              {certifications.map((c) => (
                <View key={c.id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                  <Text style={{ fontSize: 8, fontFamily: "Times-Bold" }}>
                    {c.name} — <Text style={{ fontFamily: "Helvetica", color: "#64748B" }}>{c.issuer}</Text>
                  </Text>
                  {c.year && <Text style={styles.dateText}>{c.year}</Text>}
                </View>
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
