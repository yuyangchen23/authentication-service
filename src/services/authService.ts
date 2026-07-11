import { User, PublicUser } from "../types/user";

export const users: User[] = [];

export const findUserByEmail = (email: string) => {
  for (const user of users) {
    if (user.email === email) {
      return user;
    }
  }
}

export const createUser = (email: string, password: string) => {
  if (findUserByEmail(email)) {
    return null;
  }

  const newUser: User = {
    id: users.length + 1,
    email,
    password
  }

  users.push(newUser);

  const publicUser: PublicUser = {
    id: newUser.id,
    email: newUser.email
  }

  return publicUser;
}

export const verifyUserCredentials = (email: string, password: string) => {
  const user = findUserByEmail(email);

  if (!user) {
    return false;
  }
  
  return user.password === password;
}