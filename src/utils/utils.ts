
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmailFormat(email: unknown): email is string {
  if (typeof email !== 'string') {
    return false;
  }
  return EMAIL_REGEX.test(email);
}

export function isValidPassword(password: unknown): password is string {
  if (typeof password !== 'string') {
    return false;
  }
  return password.length >=8;
}