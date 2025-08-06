import { ValidateError } from "@tsoa/runtime";
import { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";

// Middleware para rutas no encontradas
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  if (!req.route) {
    return next(createHttpError(404, 'Route not found'));
  }
  next();
}

// Global error handler
export function globalErrorHandler(
  err: HttpError | ValidateError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  console.error('Error:', err.message);

  // Errores de validación de TSOA
  if (err instanceof ValidateError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: err.fields,
    });
  }

  // Errores de autenticación
  if (err.message && (
    err.message.includes("Token") || 
    err.message.includes("Authentication") ||
    err.message.includes("jwt") ||
    err.message.includes("No token provided")
  )) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }

  // Errores de credenciales inválidas
  if (err.message && err.message.includes("Invalid credentials")) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }

  // Errores de usuario ya existe
  if (err.message && err.message.includes("already exists")) {
    return res.status(409).json({
      success: false,
      message: err.message,
    });
  }

  // Errores HTTP (createHttpError)
  if (createHttpError.isHttpError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Errores con statusCode personalizado
  if ("statusCode" in err && typeof (err as any).statusCode === "number") {
    return res.status((err as any).statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Error genérico/desconocido
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : "Internal Server Error",
  });
}
