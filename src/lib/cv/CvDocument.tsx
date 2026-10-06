import * as React from "react";
import { Document } from "@react-pdf/renderer";
import { PortfolioPayload } from "@/types/database";
import { CvSettings } from "@/types/database";
import { registerCvFonts } from "./font-registry";
import { ExecutivePdfTemplate } from "./templates/ExecutivePdfTemplate";
import { ModernPdfTemplate } from "./templates/ModernPdfTemplate";
import { CreativePdfTemplate } from "./templates/CreativePdfTemplate";
import { MinimalPdfTemplate } from "./templates/MinimalPdfTemplate";
import { TechnicalPdfTemplate } from "./templates/TechnicalPdfTemplate";
import { ElegantPdfTemplate } from "./templates/ElegantPdfTemplate";

// Register fonts once safely
registerCvFonts();

export interface CvDocumentProps {
  data: PortfolioPayload;
  settings: CvSettings;
}

export function CvDocument({ data, settings }: CvDocumentProps) {
  const { profile } = data;
  const templateId = settings.template_id || "executive";

  const renderTemplate = () => {
    switch (templateId) {
      case "modern":
        return <ModernPdfTemplate data={data} settings={settings} />;
      case "creative":
        return <CreativePdfTemplate data={data} settings={settings} />;
      case "minimal":
        return <MinimalPdfTemplate data={data} settings={settings} />;
      case "technical":
        return <TechnicalPdfTemplate data={data} settings={settings} />;
      case "elegant":
        return <ElegantPdfTemplate data={data} settings={settings} />;
      case "executive":
      default:
        return <ExecutivePdfTemplate data={data} settings={settings} />;
    }
  };

  return (
    <Document
      title={`${profile.full_name || "Resume"} - CV`}
      author={profile.full_name || "FolioNova"}
      subject="Curriculum Vitae"
      creator="FolioNova"
    >
      {renderTemplate()}
    </Document>
  );
}
