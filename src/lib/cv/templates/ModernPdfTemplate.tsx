import * as React from "react";
import { Page, Text, View, Link, Image, StyleSheet } from "@react-pdf/renderer";
import { PortfolioPayload } from "@/types/database";
import { CvSettings } from "@/types/database";
import { formatCvDate, parseBulletPoints, ensureSafePdfUrl } from "../cv-helpers";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1E293B",
  },
  sidebar: {
    width: "34%",
    backgroundColor: "#F8FAFC",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  main: {
    width: "66%",
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 26,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: "#0F172A",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  sidebarSection: {
    marginBottom: 16,
  },
  sidebarTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#475569",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 3,
    marginBottom: 6,
  },
  contactItem: {
    marginBottom: 4,
    fontSize: 8,
    color: "#475569",
  },
  contactLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 1,
  },
  link: {
    color: "#334155",
    textDecoration: "none",
  },
  skillPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 4,
    fontSize: 7.5,
    color: "#334155",
    marginBottom: 3,
    marginRight: 3,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mainSection: {
    marginBottom: 14,
  },
  mainSectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#0F172A",
    borderBottomWidth: 1,
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
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#475569",
  },
  dateText: {
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
    fontSize: 8,
    color: "#334155",
    lineHeight: 1.35,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 7.5,
    bottom: 16,
    right: 26,
    color: "#94A3B8",
  },
});

interface TemplateProps {
  data: PortfolioPayload;
  settings: CvSettings;
}

export function ModernPdfTemplate({ data, settings }: TemplateProps) {
  const { profile, skills, experiences, education, projects, certifications, social_links } = data;
  const accent = settings.accent_color || "#6366F1";
  const pageSize = settings.paper_size || "A4";
  const showPhoto = settings.include_photo && !!profile.avatar_url;

  return (
    <Page size={pageSize} style={styles.page}>
      {/* Left Column / Sidebar */}
      <View style={styles.sidebar}>
        {showPhoto && (
          <View style={styles.photoContainer}>
            <Image src={profile.avatar_url!} style={styles.avatar} />
          </View>
        )}

        {/* Contact Coordinates */}
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Contact</Text>

          {profile.email_public && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email</Text>
              <Link src={`mailto:${profile.email_public}`} style={styles.link}>
                <Text>{profile.email_public}</Text>
              </Link>
            </View>
          )}

          {profile.phone_public && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text>{profile.phone_public}</Text>
            </View>
          )}

          {profile.location && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Location</Text>
              <Text>{profile.location}</Text>
            </View>
          )}

          {profile.website && (
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Website</Text>
              <Link src={ensureSafePdfUrl(profile.website)!} style={styles.link}>
                <Text>{profile.website.replace(/^https?:\/\//, "")}</Text>
              </Link>
            </View>
          )}
        </View>

        {/* Core Skills in Sidebar */}
        {settings.sections.skills && skills && skills.length > 0 && (
          <View style={styles.sidebarSection} wrap={false}>
            <Text style={styles.sidebarTitle}>Skills &amp; Tools</Text>
            <View style={styles.skillsWrap}>
              {skills.map((s) => (
                <Text key={s.id} style={styles.skillPill}>
                  {s.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Social Network Profiles */}
        {social_links && social_links.length > 0 && (
          <View style={styles.sidebarSection} wrap={false}>
            <Text style={styles.sidebarTitle}>Online Presence</Text>
            {social_links.map((social) => (
              <View key={social.id} style={styles.contactItem}>
                <Text style={styles.contactLabel}>{social.platform}</Text>
                <Link src={ensureSafePdfUrl(social.url)!} style={styles.link}>
                  <Text>{social.url.replace(/^https?:\/\/(www\.)?/, "")}</Text>
                </Link>
              </View>
            ))}
          </View>
        )}

        {/* Languages in Sidebar */}
        {settings.sections.languages && profile.languages && profile.languages.length > 0 && (
          <View style={styles.sidebarSection} wrap={false}>
            <Text style={styles.sidebarTitle}>Languages</Text>
            {profile.languages.map((lang, idx) => (
              <Text key={idx} style={{ fontSize: 8, color: "#334155", marginBottom: 2 }}>
                {lang}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Right Column / Main Body */}
      <View style={styles.main}>
        {/* Name & Title Header */}
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.name}>{profile.full_name || "Alex Vance"}</Text>
          <Text style={[styles.title, { color: accent }]}>
            {profile.professional_title || "Design Technologist"}
          </Text>
        </View>

        {/* Professional Summary */}
        {settings.sections.summary && (profile.about_me || profile.short_bio) && (
          <View style={styles.mainSection} wrap={false}>
            <Text style={styles.mainSectionTitle}>About Me</Text>
            <Text style={{ fontSize: 8.5, color: "#334155", lineHeight: 1.45 }}>
              {profile.about_me || profile.short_bio}
            </Text>
          </View>
        )}

        {/* Experience Timeline */}
        {settings.sections.experience && experiences && experiences.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle} wrap={false}>Experience</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.roleText}>{exp.role}</Text>
                  <Text style={styles.dateText}>
                    {formatCvDate(exp.start_date)} – {exp.is_current ? "Present" : formatCvDate(exp.end_date)}
                  </Text>
                </View>
                <Text style={[styles.companyText, { marginBottom: 3 }]}>{exp.company}</Text>
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

        {/* Projects */}
        {settings.sections.projects && projects && projects.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle} wrap={false}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.entry} wrap={false}>
                <View style={styles.entryHeader}>
                  <Text style={styles.roleText}>{proj.title}</Text>
                  {proj.live_url && (
                    <Link src={ensureSafePdfUrl(proj.live_url)!} style={styles.link}>
                      <Text style={{ fontSize: 7.5, color: accent }}>View ↗</Text>
                    </Link>
                  )}
                </View>
                {proj.description && (
                  <Text style={{ fontSize: 8, color: "#475569", marginBottom: 2 }}>
                    {proj.description}
                  </Text>
                )}
                {proj.tech_stack && proj.tech_stack.length > 0 && (
                  <Text style={{ fontSize: 7.5, color: "#64748B" }}>
                    Stack: {proj.tech_stack.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {settings.sections.education && education && education.length > 0 && (
          <View style={styles.mainSection} wrap={false}>
            <Text style={styles.mainSectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.roleText}>{edu.institution}</Text>
                  <Text style={styles.dateText}>
                    {edu.start_year}{edu.end_year ? ` – ${edu.end_year}` : ""}
                  </Text>
                </View>
                {edu.degree && <Text style={styles.companyText}>{edu.degree}</Text>}
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
                <Text style={{ fontSize: 8, color: "#1E293B" }}>
                  {c.name} — <Text style={{ color: "#64748B" }}>{c.issuer}</Text>
                </Text>
                {c.year && <Text style={{ fontSize: 7.5, color: "#64748B" }}>{c.year}</Text>}
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
      </View>
    </Page>
  );
}
