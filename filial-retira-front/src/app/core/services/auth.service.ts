import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl.replace('/integracao', '/auth'); 
  private readonly TOKEN_KEY = 'auth_token';

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(login: string, senha: string): Observable<any> {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, { login, senha }).pipe(
      tap(response => {
        this.salvarToken(response.token);
      })
    );
  }

  alterarSenha(novaSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/alterar-senha`, { novaSenha }, { responseType: 'text' });
  }

  private salvarToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  obterToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  isAutenticado(): boolean {
    return !!this.obterToken();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.router.navigate(['/login']);
  }
}