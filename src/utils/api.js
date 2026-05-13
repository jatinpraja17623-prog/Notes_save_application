// ============================================================
//  FILE: src/utils/api.js
//  PURPOSE: All backend API calls live here
//  HOW IT WORKS: Every function calls your backend and returns data
// ============================================================

const BASE_URL = "http://localhost:3000/api";

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function registerUser(formData) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return response.json();
}

export async function loginUser(formData) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return response.json();
}

export async function getAllNotes() {
  const response = await fetch(`${BASE_URL}/notes`, { headers: authHeader() });
  return response.json();
}

export async function createNote(noteData) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(noteData),
  });
  return response.json();
}

export async function deleteNote(noteId) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return response.json();
}
export async function updateNote(noteId, noteData) {
  const response = await fetch(`${BASE_URL}/notes/${noteId}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(noteData),
  });
  return response.json();
}