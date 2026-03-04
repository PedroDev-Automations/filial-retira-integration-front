import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Permite usar formulários no HTML
import { IntegracaoService } from '../../core/services/integracao';
import { CommonModule } from '@angular/common'; // Permite usar *ngIf e *ngFor no HTML

@Component({
  selector: 'app-matriz-config',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './matriz-config.html',
  styleUrl: './matriz-config.css'
})
export class MatrizConfigComponent implements OnInit {
  
  
  configMatriz: any = {
    id: null, 
    unidade: 'MATRIZ',
    matriz: true,
    appKey: '',
    appSecret: '',
    etapaEscritaPedido: '',
    codigoParcelaPadrao: '',
    categoriaTransferenciaPadrao: '',
    contaCorrentePadrao: null
  };

  mensagemSucesso = '';

  constructor(private integracaoService: IntegracaoService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.integracaoService.listarConfiguracoes().subscribe({
      next: (configs) => {
        const matriz = configs.find(c => c.matriz === true);
        if (matriz) {
          this.configMatriz = matriz;
        }
      },
      error: (err) => console.error('Erro ao carregar dados:', err)
    });
  }

  salvar() {
    this.integracaoService.salvarConfiguracao(this.configMatriz).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = resposta;
        setTimeout(() => this.mensagemSucesso = '', 5000);
      },
      error: (err) => alert('Erro ao salvar as configurações!')
    });
  }
}