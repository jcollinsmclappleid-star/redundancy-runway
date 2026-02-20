const SESSION_TOKEN_KEY = "redundancy_runway_session_token";

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getSessionToken(): string {
  let token = localStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) {
    token = generateToken();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  }
  return token;
}

export function clearSessionToken(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
}
