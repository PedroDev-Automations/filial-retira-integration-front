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
    identificadorInstalacao: 'realli',
    prefixosIgnorados: 'FR,RD',
    etapaEscritaPedido: '',
    codigoParcelaPadrao: '',
    categoriaTransferenciaPadrao: '',
    contaCorrentePadrao: null
  };

  opcoesParcelas: any[] = [];
  opcoesCategorias: any[] = [];
  opcoesContas: any[] = [];
  opcoesEtapas: any[] = [];

  mensagemSucesso = '';

  constructor(private integracaoService: IntegracaoService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDicionarios() {
    this.integracaoService.listarParcelas().subscribe(res => this.opcoesParcelas = res);
    this.integracaoService.listarCategorias().subscribe(res => this.opcoesCategorias = res);
    this.integracaoService.listarContas().subscribe(res => this.opcoesContas = res);
    this.integracaoService.listarEtapas().subscribe(res => this.opcoesEtapas = res);
  }

  carregarDados() {
    this.integracaoService.listarConfiguracoes().subscribe({
      next: (configs) => {
        const matriz = configs.find(c => c.matriz === true);
        if (matriz) {
          this.configMatriz = matriz;
          
          if (this.configMatriz.appKey) {
            this.carregarDicionarios();
          }
        }
      },
      error: (err) => console.error('Erro ao carregar dados:', err)
    });
  }

  salvar() {
    this.integracaoService.salvarConfiguracao(this.configMatriz).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = resposta;

        if (this.configMatriz.appKey && this.configMatriz.appSecret) {
          this.carregarDicionarios();
        }

        setTimeout(() => this.mensagemSucesso = '', 5000);
      },
      error: (err) => alert('Erro ao salvar as configurações!')
    });
  }
}