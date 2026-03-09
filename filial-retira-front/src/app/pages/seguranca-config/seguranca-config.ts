import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seguranca-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seguranca-config.html'
})
export class SegurancaConfigComponent {
  novaSenha = '';
  confirmarSenha = '';
  mensagemSucesso = '';
  mensagemErro = '';
  carregando = false;

  constructor(private authService: AuthService) {}

  salvarNovaSenha() {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (!this.novaSenha || !this.confirmarSenha) {
      this.mensagemErro = 'Preencha todos os campos.';
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.mensagemErro = 'As senhas não coincidem. Digite novamente.';
      return;
    }

    if (this.novaSenha.length < 6) {
      this.mensagemErro = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    this.carregando = true;

    this.authService.alterarSenha(this.novaSenha).subscribe({
      next: (res) => {
        this.mensagemSucesso = '✅ Senha alterada com sucesso! Guarde-a em um local seguro.';
        this.novaSenha = '';
        this.confirmarSenha = '';
        this.carregando = false;
      },
      error: (err) => {
        this.mensagemErro = '❌ Erro ao alterar senha. Verifique a conexão com a VPS.';
        this.carregando = false;
      }
    });
  }
}