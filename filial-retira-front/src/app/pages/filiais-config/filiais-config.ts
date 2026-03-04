import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IntegracaoService } from '../../core/services/integracao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filiais-config',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filiais-config.html',
  styleUrl: './filiais-config.css'
})
export class FiliaisConfigComponent implements OnInit {
  
  filiais: any[] = [];
  
  

  novaFilial: any = {
    id: null,
    unidade: '',
    matriz: false,
    appKey: '',
    appSecret: '',
    etapaLeituraPedido: '',
    idClienteOmie: null
  };

  mensagemSucesso = '';

  constructor(private integracaoService: IntegracaoService) {}

  ngOnInit(): void {
    this.carregarFiliais();
  }

  carregarFiliais() {
    this.integracaoService.listarConfiguracoes().subscribe({
      next: (configs) => {
        this.filiais = configs.filter(c => c.matriz === false);
      },
      error: (err) => console.error('Erro ao carregar filiais', err)
    });
  }

  salvarFilial() {
    this.integracaoService.salvarConfiguracao(this.novaFilial).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = 'Filial cadastrada/atualizada com sucesso!';
        this.carregarFiliais(); 
        
        this.novaFilial = { unidade: '', isMatriz: false, appKey: '', appSecret: '', etapaLeituraPedido: '', idClienteOmie: null };
        
        setTimeout(() => this.mensagemSucesso = '', 5000);
      },
      error: (err) => alert('Erro ao salvar filial!')
    });
  }
}