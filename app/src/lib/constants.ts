export const ROLE_ADMIN = 1;
export const ROLE_USER = 2;

export const ROLE_NAMES = {
  [ROLE_ADMIN]: "admin",
  [ROLE_USER]: "user",
} as const;

export function getRoleId(roleName: "admin" | "user"): number {
  return roleName === "admin" ? ROLE_ADMIN : ROLE_USER;
}

// Example usage in code: if (user.rolesId === ROLE_ADMIN) { ... }
