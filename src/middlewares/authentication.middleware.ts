import * as express from "express";
import { verifyToken } from '../libs/jwt';
import { SignInPayload } from "../libs/jwt/jwt.types";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    // Extraer token del header Authorization (Bearer token)
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : request.headers["x-access-token"];

    return new Promise((resolve, reject) => {
      if (!token) { 
        reject(new Error("No token provided"));
        return;
      }
      
      try {
        const decoded = verifyToken(token as string) as SignInPayload;
        // Verificar roles si se proporcionan
        if (scopes && scopes.length > 0) {
          // Para simplificar, no verificamos roles por ahora
          // Se puede implementar roles en el payload si es necesario
        }
        
        // Agregar userId al request para que los controladores puedan accederlo
        (request as any).user = { 
          userId: decoded.id, 
          email: decoded.email 
        };
        
        resolve(decoded);
      } catch (error: any) {
        // Crear un error más específico basado en el tipo de error
        let errorMessage = "Authentication failed";
        
        if (error.message === "Invalid or expired token") {
          errorMessage = "Token is invalid or has expired";
        } else if (error.message === "jwt malformed") {
          errorMessage = "Token format is invalid";
        } else if (error.message === "jwt expired") {
          errorMessage = "Token has expired";
        } else if (error.message === "invalid signature") {
          errorMessage = "Token signature is invalid";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        reject(new Error(errorMessage));
      }
    });
  }
  
  return Promise.reject(new Error("Unknown authentication scheme"));
}
