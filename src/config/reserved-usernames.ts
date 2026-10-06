/**
 * Reserved Usernames List
 * System routes, API paths, and administrative words that cannot be claimed by users.
 */

export const RESERVED_USERNAMES = new Set([
  // Core routes
  "admin",
  "administrator",
  "api",
  "app",
  "assets",
  "auth",
  "dashboard",
  "edit",
  "editor",
  "login",
  "logout",
  "register",
  "settings",
  "signup",
  "signin",
  "signout",
  "u",
  "user",
  "users",
  "static",
  "_next",
  "public",
  "favicon",
  "robots",
  "sitemap",

  // Marketing & company
  "about",
  "pricing",
  "help",
  "support",
  "faq",
  "contact",
  "terms",
  "privacy",
  "legal",
  "security",
  "careers",
  "jobs",
  "blog",
  "news",
  "docs",
  "features",
  "explore",
  "status",
  "design-system",

  // Technical & subdomains
  "www",
  "mail",
  "smtp",
  "ftp",
  "cdn",
  "media",
  "images",
  "img",
  "dev",
  "stage",
  "staging",
  "prod",
  "production",
  "test",
  "root",
  "null",
  "undefined",
  "folionova",
  "system",
  "bot",
]);

export function isUsernameReserved(username: string): boolean {
  if (!username) return true;
  return RESERVED_USERNAMES.has(username.toLowerCase().trim());
}
