/**
 * Password Security Validation & Strength Evaluation
 * Enforces strict enterprise-grade password complexity rules
 * and blocks the 100 most commonly breached passwords.
 */

export const TOP_100_COMMON_PASSWORDS = new Set([
  "123456", "password", "12345678", "qwerty", "123456789", "12345", "1234", "111111",
  "1234567", "dragon", "123123", "baseball", "football", "welcome", "monkey", "shadow",
  "master", "666666", "letmein", "trustno1", "admin", "chelsea", "mustang", "killer",
  "charlie", "starwars", "secret", "hunter2", "superman", "harley", "princess", "bullet",
  "soleil", "cookie", "freedom", "summer", "cheese", "jessica", "diamond", "ashley",
  "bailey", "ginger", "merlin", "marina", "butter", "michelle", "sunset", "prince",
  "pepper", "knight", "thunder", "sparky", "orange", "yellow", "coffee", "robert",
  "thomas", "daniel", "donald", "anthony", "george", "steven", "kenneth", "edward",
  "brian", "ronald", "joshua", "dennis", "walter", "patrick", "peter", "harold",
  "douglas", "henry", "carl", "arthur", "ryan", "roger", "joe", "juan", "jack", "albert",
  "jonathan", "justin", "terry", "gerald", "keith", "samuel", "willie", "ralph",
  "lawrence", "nicholas", "roy", "benjamin", "bruce", "brandon", "adam", "harry",
  "fred", "wayne", "billy", "steve", "louis", "jeremy", "aaron", "randy", "howard"
]);

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Excellent";
  color: string;
  feedback: string[];
  isValid: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      score: 0,
      label: "Very Weak",
      color: "#EF4444",
      feedback: ["Password is required"],
      isValid: false,
    };
  }

  // Common password check
  if (TOP_100_COMMON_PASSWORDS.has(password.toLowerCase().trim())) {
    return {
      score: 0,
      label: "Very Weak",
      color: "#EF4444",
      feedback: ["This password is too common and easily guessed."],
      isValid: false,
    };
  }

  // Length check
  if (password.length >= 10) {
    score += 1;
  } else {
    feedback.push("Must be at least 10 characters long");
  }

  if (password.length >= 14) {
    score += 1;
  }

  // Character requirements
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasUpper && hasLower) {
    score += 1;
  } else {
    feedback.push("Must contain both uppercase and lowercase letters");
  }

  if (hasNumber) {
    score += 1;
  } else {
    feedback.push("Must contain at least one number");
  }

  if (hasSpecial) {
    score += 1;
  }

  // Final score clamping (0-4)
  const normalizedScore = Math.min(4, Math.max(0, Math.floor((score / 5) * 4)));

  const strengthMap: Record<number, { label: PasswordStrengthResult["label"]; color: string }> = {
    0: { label: "Very Weak", color: "#EF4444" },
    1: { label: "Weak", color: "#F97316" },
    2: { label: "Fair", color: "#F59E0B" },
    3: { label: "Strong", color: "#22C55E" },
    4: { label: "Excellent", color: "#10B981" },
  };

  const isValid = 
    password.length >= 10 && 
    hasUpper && 
    hasLower && 
    hasNumber && 
    !TOP_100_COMMON_PASSWORDS.has(password.toLowerCase().trim());

  return {
    score: normalizedScore,
    label: strengthMap[normalizedScore].label,
    color: strengthMap[normalizedScore].color,
    feedback,
    isValid,
  };
}

export const calculatePasswordStrength = evaluatePasswordStrength;
