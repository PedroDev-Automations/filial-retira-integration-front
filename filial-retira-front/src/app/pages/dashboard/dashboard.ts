import { Component, OnInit } from '@angular/core';
import { IntegracaoService } from '../../core/services/integracao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalFiliais = 0;
  carregandoPedidos = false;
  carregandoEstoque = false;
  mensagem = '';
  carregandoEstoqueIncremental = false;

  constructor(private integracaoService: IntegracaoService) {}

  ngOnInit() {
    this.integracaoService.listarConfiguracoes().subscribe(configs => {
      this.totalFiliais = configs.filter(c => c.matriz === false).length;
    });
  }

  varrerPedidos() {
    if (window.confirm('Tem certeza que deseja forçar a busca de pedidos agora?')) {
      this.carregandoPedidos = true;
      this.mensagem = '';
      this.integracaoService.forcarVarreduraPedidos().subscribe({
        next: (res) => {
          this.mensagem = '✅ Varredura de pedidos finalizada com sucesso!';
          this.carregandoPedidos = false;
        },
        error: (err) => {
          this.mensagem = '❌ Erro ao varrer pedidos. Verifique os logs da VPS.';
          this.carregandoPedidos = false;
        }
      });
    }
  }

  sincronizarEstoqueIncremental() {
    if (window.confirm('Deseja iniciar a sincronização rápida de estoque?')) {
      this.carregandoEstoqueIncremental = true;
      this.mensagem = '';
      this.integracaoService.forcarSincronizacaoIncremental().subscribe({
        next: (res) => {
          this.mensagem = '✅ Sincronização rápida de estoque finalizada!';
          this.carregandoEstoqueIncremental = false;
        },
        error: (err) => {
          this.mensagem = '❌ Erro ao atualizar estoque rápido.';
          this.carregandoEstoqueIncremental = false;
        }
      });
    }
  }

  sincronizarEstoque() {
    if (window.confirm('ATENÇÃO: A Carga Completa varre todo o catálogo e pode demorar. Tem certeza que deseja iniciar?')) {
      this.carregandoEstoque = true;
      this.mensagem = '';
      this.integracaoService.forcarCargaEstoque().subscribe({
        next: (res) => {
          this.mensagem = '✅ Sincronização de estoque enviada para a fila!';
          this.carregandoEstoque = false;
        },
        error: (err) => {
          this.mensagem = '❌ Erro ao sincronizar estoque. Verifique os logs da VPS.';
          this.carregandoEstoque = false;
        }
      });
    }
  }
}