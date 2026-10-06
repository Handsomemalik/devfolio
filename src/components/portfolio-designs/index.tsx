"use client";

import * as React from "react";
import { PortfolioDesignId } from "@/config/designs";
import { PortfolioPayload } from "@/types/database";

import { AuroraPortfolio } from "./aurora";
import { NoirPortfolio } from "./noir";
import { KineticPortfolio } from "./kinetic";
import { BentoPortfolio } from "./bento";
import { EditorialPortfolio } from "./editorial";

export interface PortfolioDesignProps {
  data: PortfolioPayload;
  accent?: string;
  themeMode?: "light" | "dark" | "system";
  font?: string;
  mode?: "live" | "preview" | "editor";
  isOwner?: boolean;
}

export {
  AuroraPortfolio,
  NoirPortfolio,
  KineticPortfolio,
  BentoPortfolio,
  EditorialPortfolio,
};

export { PORTFOLIO_DESIGNS, PORTFOLIO_DESIGN_LIST } from "@/config/designs";
export type { PortfolioDesignId, PortfolioDesignKey } from "@/config/designs";

export const PORTFOLIO_COMPONENTS: Record<
  PortfolioDesignId,
  React.ComponentType<PortfolioDesignProps>
> = {
  aurora: AuroraPortfolio,
  noir: NoirPortfolio,
  kinetic: KineticPortfolio,
  bento: BentoPortfolio,
  editorial: EditorialPortfolio,
};
