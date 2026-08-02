export interface RegisterRequestBody {
  email?: string;
  password?: string;
}

export interface LoginRequestBody {
  email?: string;
  password?: string;
}

export interface AccessTokenPayload {
  sub: string;
  // role: UserRole;
}

export interface AuthenticatedUser {
  userId: string;
}