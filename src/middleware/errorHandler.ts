import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
}