// js/utils/api.js

// ===== BACKEND BASE URL =====
const API_BASE = "https://skilltobill-b.onrender.com/api";

// ================= AUTH APIs =================
export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  return res.json();
}

// ================= STATIC DATA (JSON) =================
// 🔥 THIS IS THE KEY FIX FOR LEARNER ZONE
export async function getData(path) {
  const res = await fetch(path);

  if (!res.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return res.json();
}
