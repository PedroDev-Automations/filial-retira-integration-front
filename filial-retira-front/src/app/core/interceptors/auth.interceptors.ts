import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.obterToken();

  // 1. Injeta o token na IDA se ele existir
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 2. Trata a VOLTA (Erros da API)
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Se a API disser 401 (Não autorizado) ou 403 (Proibido/Expirado)
      if (error.status === 401 || error.status === 403) {
        console.warn('🔒 Token expirado ou inválido. Redirecionando para login...');
        authService.logout(); // Isso limpa o storage e joga pro /login
      }
      return throwError(() => error);
    })
  );
};