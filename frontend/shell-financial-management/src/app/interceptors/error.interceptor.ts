import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "";

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
          console.error("Client-side error:", error.error.message);
        } else {
          // Server-side error
          console.error("Server-side error:", {
            status: error.status,
            statusText: error.statusText,
            body: error.error,
          });

          switch (error.status) {
            case 400:
              errorMessage =
                "Solicitud incorrecta. Por favor verifique los datos enviados.";
              break;
            case 401:
              errorMessage =
                "No autorizado. Por favor inicie sesión nuevamente.";
              break;
            case 403:
              errorMessage =
                "Acceso denegado. No tiene permisos para realizar esta acción.";
              break;
            case 404:
              errorMessage = "Recurso no encontrado.";
              break;
            case 422:
              errorMessage = "Datos de entrada inválidos.";
              break;
            case 500:
              errorMessage =
                "Error interno del servidor. Por favor intente más tarde.";
              break;
            case 502:
              errorMessage = "Error de conexión con el servidor.";
              break;
            case 503:
              errorMessage = "Servicio no disponible temporalmente.";
              break;
            default:
              errorMessage = `Error del servidor: ${error.status} - ${error.statusText}`;
          }

          // If server provides a specific error message, use it
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
        }

        // Create a new error with the formatted message
        const formattedError = new Error(errorMessage);
        (formattedError as any).originalError = error;

        return throwError(() => formattedError);
      })
    );
  }
}
