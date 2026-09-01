export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'senha123';

/**
 * Simple client‑side check for admin credentials.
 * Returns true when both username and password match the hard‑coded values.
 */
export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
