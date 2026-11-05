export const passwordRules = [
  { id: "uppercase", label: "An uppercase letter (A–Z)", test: (pw) => /[A-Z]/.test(pw) },
  { id: "lowercase", label: "A lowercase letter (a–z)", test: (pw) => /[a-z]/.test(pw) },
  { id: "length", label: "At least 6 characters", test: (pw) => pw.length >= 6 },
];

export function validatePassword(password) {
  const failed = passwordRules.filter((rule) => !rule.test(password));
  if (failed.length === 0) return { valid: true, errors: [] };
  return { valid: false, errors: failed.map((rule) => rule.label) };
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
