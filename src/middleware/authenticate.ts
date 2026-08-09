import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/token";
import { AppError } from "../errors/AppError";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorization = req.header("authorization");

  // authorization header missing
  if (!authorization) {
    res.status(401).json({
      success: false,
      message: "Authentication required"
    });

    return;
  }

  // header does not start with "Bearer" or token not provided
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError(
      401,
      "Authentication required"
    );

    return;
  }

  try {
    const payload = verifyAccessToken(token);

    req.auth = {
      userId: payload.sub
    };

    next();
  } catch {
    throw new AppError(
      401,
      "Invalid or expired access token"
    );
  }
};