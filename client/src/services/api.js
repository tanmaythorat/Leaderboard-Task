// Get base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/users`);
  return await res.json();
};

const addUser = async (name) => {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return await res.json();
};

const claimPoints = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  return await res.json();
};

const getClaimHistory = async (userId = '') => {
  const url = userId ? `${API_BASE_URL}/claim/${userId}` : `${API_BASE_URL}/claim`;
  const res = await fetch(url);
  return await res.json();
};

const getRecentClaims = async () => {
  const res = await fetch(`${API_BASE_URL}/claim/recent`);
  return await res.json();
};

export const userService = {
  getUsers,
  addUser,
  claimPoints,
  getClaimHistory,
  getRecentClaims,
};

