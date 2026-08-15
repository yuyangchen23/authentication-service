import { generateRefreshToken, hashRefreshToken } from "../utils/refreshToken";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import { Session } from "../generated/prisma/client";

export const createSession = async (userId: string) => {
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.refreshTokenExpiresDays);

  await prisma.session.create({
    data: {
      userId,
      refreshTokenHash,
      expiresAt,
    },
  });

  return {
    refreshToken,
    expiresAt,
  };
};

export const revokeActiveSessions = async (session: Session) => {
  await prisma.session.updateMany({
    where: {
      userId: session.userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    }
  });
};

export const findSessionByRefreshToken = async (refreshToken: string) => {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await prisma.session.findUnique({
    where: {
      refreshTokenHash
    },
  });

  if(!session) {
    throw new AppError(
      401,
      "Invalid refresh token"
    );
  }

  if (session.revokedAt) {
    if (session.replacedBySessionId) {
      await revokeActiveSessions(session);
    }
    
    throw new AppError(
      401,
      "Refresh token has been revoked"
    );
  }

  if (session.expiresAt <= new Date()) {
    throw new AppError(
      401,
      "Refresh token has expired"
    );
  }

  return session;
};

export const rotateSession = async (refreshToken: string) => {
  const oldSession = await findSessionByRefreshToken(refreshToken);

  const newToken = generateRefreshToken();
  const newTokenHash = hashRefreshToken(newToken);

  const newExpiry = new Date();
  newExpiry.setDate(newExpiry.getDate() + env.refreshTokenExpiresDays);

  await prisma.$transaction(async (tx) => {
    const newSession = await tx.session.create({
      data: {
        userId: oldSession.userId,
        refreshTokenHash: newTokenHash,
        expiresAt: newExpiry,
      }
    });

    await tx.session.update({
      where: {
        id: oldSession.id
      },
      data: {
        revokedAt: new Date(),
        replacedBySessionId: newSession.id,
      },
    });
  });

  return {
    userId: oldSession.userId,
    refreshToken: newToken,
    expiresAt: newExpiry,
  };
};

export const revokeSession = async (refreshToken: string) => {
  const session = await findSessionByRefreshToken(refreshToken);

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};