// src/api/authMock.js

const STORAGE_KEY = "mockUsers";
const SESSION_KEY = "mockSessionUser";

function initSeedUsers() {
  const seed = [
    {
      id: 1,
      name: "Admin Café",
      email: "admin@cafe.dev",
      password: "123456",
      role: "admin",
    },
    {
      id: 2,
      name: "Editor Demo",
      email: "editor@cafe.dev",
      password: "123456",
      role: "editor",
    },
    {
      id: 3,
      name: "User Café",
      email: "user@cafe.dev",
      password: "123456",
      role: "user",
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initSeedUsers();
  try {
    return JSON.parse(raw);
  } catch {
    return initSeedUsers();
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function mockLogin(email, password) {
  const users = getUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    throw new Error("Sai email hoặc mật khẩu.");
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function mockSignup({ name, email, password }) {
  const users = getUsers();

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("Email đã tồn tại, hãy dùng email khác.");
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: "editor",
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function getCurrentUser() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function mockLogout() {
  localStorage.removeItem(SESSION_KEY);
}