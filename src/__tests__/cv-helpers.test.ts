import { describe, it, expect } from "vitest";
import {
  parseBulletPoints,
  formatCvDate,
  groupSkillsByCategory,
  getPdfContrastTextColor,
} from "@/lib/cv/cv-helpers";
import { Skill } from "@/types/database";

describe("CV Helper Functions", () => {
  describe("parseBulletPoints", () => {
    it("should split multiline string into bullet items", () => {
      const input = "Engineered micro-frontend pipeline\nReduced bundle size by 40%\nMentored 4 junior engineers";
      const result = parseBulletPoints(input);
      expect(result).toHaveLength(3);
      expect(result[0]).toBe("Engineered micro-frontend pipeline");
      expect(result[1]).toBe("Reduced bundle size by 40%");
    });

    it("should strip leading bullet characters and dashes", () => {
      const input = "- Built CI/CD automated workflow\n• Optimized SQL query index execution\n* Deployed to AWS";
      const result = parseBulletPoints(input);
      expect(result).toEqual([
        "Built CI/CD automated workflow",
        "Optimized SQL query index execution",
        "Deployed to AWS",
      ]);
    });

    it("should return empty array for null or empty input", () => {
      expect(parseBulletPoints("")).toEqual([]);
      expect(parseBulletPoints(null as unknown as string)).toEqual([]);
    });
  });

  describe("formatCvDate", () => {
    it("should return trimmed date or Present", () => {
      expect(formatCvDate("2021-01")).toBe("2021-01");
      expect(formatCvDate("Present")).toBe("Present");
      expect(formatCvDate("current")).toBe("Present");
      expect(formatCvDate("")).toBe("");
    });
  });

  describe("groupSkillsByCategory", () => {
    it("should group skills by their category name", () => {
      const mockSkills: Skill[] = [
        { id: "1", profile_id: "p1", name: "TypeScript", level: 90, category: "Languages", sort_order: 0, created_at: "", updated_at: "" },
        { id: "2", profile_id: "p1", name: "Rust", level: 85, category: "Languages", sort_order: 1, created_at: "", updated_at: "" },
        { id: "3", profile_id: "p1", name: "React", level: 95, category: "Frameworks", sort_order: 2, created_at: "", updated_at: "" },
        { id: "4", profile_id: "p1", name: "PostgreSQL", level: 80, category: null, sort_order: 3, created_at: "", updated_at: "" },
      ];

      const grouped = groupSkillsByCategory(mockSkills);
      expect(grouped["Languages"]).toHaveLength(2);
      expect(grouped["Frameworks"]).toHaveLength(1);
      expect(grouped["Technical Proficiencies"]).toHaveLength(1); // default uncategorized fallback
    });
  });

  describe("getPdfContrastTextColor", () => {
    it("should return dark text for light accent backgrounds", () => {
      expect(getPdfContrastTextColor("#FFFFFF")).toBe("#0F172A");
      expect(getPdfContrastTextColor("#FACC15")).toBe("#0F172A"); // bright yellow
    });

    it("should return white text for dark accent backgrounds", () => {
      expect(getPdfContrastTextColor("#000000")).toBe("#FFFFFF");
      expect(getPdfContrastTextColor("#4338CA")).toBe("#FFFFFF"); // indigo-700
      expect(getPdfContrastTextColor("#1E1B4B")).toBe("#FFFFFF"); // deep midnight
    });
  });
});
