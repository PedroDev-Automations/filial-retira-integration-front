import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  login = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(private authService: AuthService, private router: Router) {}

  entrar() {
    if (!this.login || !this.senha) {
      this.erro = 'Preencha todos os campos.';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.authService.login(this.login, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.erro = 'Credenciais inválidas. Tente novamente.';
        this.carregando = false;
      }
    });
  }
}