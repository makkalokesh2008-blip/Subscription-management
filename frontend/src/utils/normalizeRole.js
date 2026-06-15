export function normalizeRole(rawRole) {
  if (rawRole === null || rawRole === undefined) {
    return "";
  }

  // Handle numeric role IDs from database
  if (typeof rawRole === "number" || (typeof rawRole === "string" && /^\d+$/.test(rawRole.trim()))) {
    const roleId = Number(rawRole);
    if (roleId === 1) {
      return "USER";
    }
    if (roleId === 2) {
      return "ADMIN";
    }
  }

  let value = rawRole;

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return "";
    }

    try {
      const parsed = JSON.parse(trimmed);
      value = parsed;
    } catch {
      value = trimmed;
    }
  }

  if (Array.isArray(value)) {
    value = value.map((item) => normalizeRole(item)).join(",");
  } else if (typeof value === "object") {
    value =
      value.role ??
      value.authority ??
      value.name ??
      value.value ??
      Object.values(value).join(",");
  }

  const normalized = String(value)
    .trim()
    .toUpperCase()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .replace(/"/g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, "")
    .replace(/ROLE_/g, "");

  if (normalized.includes("ADMIN")) {
    return "ADMIN";
  }

  if (normalized.includes("USER")) {
    return "USER";
  }

  return normalized;
}

export function getStoredRole() {
  return normalizeRole(localStorage.getItem("role"));
}

export function persistAuthUser({ token, role, email, name }) {
  const normalizedRole = normalizeRole(role);

  if (token) {
    localStorage.setItem("token", token);
  }

  localStorage.setItem("role", normalizedRole);
  localStorage.setItem("email", email || "");
  localStorage.setItem("name", name || "User");

  return normalizedRole;
}
