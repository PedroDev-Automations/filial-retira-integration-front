import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // <-- Importamos o isPlatformBrowser
import { IntegracaoService } from '../../core/services/integracao';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalFiliais = 0;
  carregandoPedidos = false;
  carregandoEstoque = false;
  mensagem = '';
  carregandoEstoqueIncremental = false;
  historicoPedidos: any[] = [];
  historicoIncremental: any[] = [];
  historicoCompleta: any[] = [];
  inscricaoTimer!: Subscription;
  detalhesErroModal: string = '';

  constructor(
    private integracaoService: IntegracaoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.integracaoService.listarConfiguracoes().subscribe(configs => {
      this.totalFiliais = configs.filter(c => c.matriz === false).length;
    });

    this.buscarHistorico(); 

    if (isPlatformBrowser(this.platformId)) {
      this.inscricaoTimer = interval(5000).subscribe(() => {
        this.buscarHistorico();
      });
    }
  }

  ngOnDestroy() {
    if (this.inscricaoTimer) {
      this.inscricaoTimer.unsubscribe();
    }
  }

  buscarHistorico() {
    this.integracaoService.listarHistoricoExecucoes().subscribe({
      next: (dados: any) => {
        this.historicoPedidos = dados.pedidos || [];
        this.historicoIncremental = dados.incremental || [];
        this.historicoCompleta = dados.completa || [];
      },
      error: (err) => console.error('Erro ao buscar histórico', err)
    });
  }

  abrirModalErros(detalhes: string) {
    this.detalhesErroModal = detalhes;
  }

  varrerPedidos() {
    if (window.confirm('Tem certeza que deseja forçar a busca de pedidos agora?')) {
      this.carregandoPedidos = true;
      this.mensagem = '';
      this.integracaoService.forcarVarreduraPedidos().subscribe({
        next: (res) => {
          this.mensagem = '✅ Varredura de pedidos enviada para a fila!';
          this.carregandoPedidos = false;
        },
        error: (err) => {
          this.mensagem = '❌ Erro ao enviar comando. Verifique a VPS.';
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
          this.mensagem = '✅ Comando de sincronização rápida enviado!';
          this.carregandoEstoqueIncremental = false;
        },
        error: (err) => {
          this.mensagem = '❌ Erro ao enviar comando. Verifique a VPS.';
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
          this.mensagem = '✅ Comando de Carga Completa enviado para a fila!';
          this.carregandoEstoque = false;
        },
        error: (err) => {
          this.mensagem = '❌ Erro ao enviar comando. Verifique a VPS.';
          this.carregandoEstoque = false;
        }
      });
    }
  }
}