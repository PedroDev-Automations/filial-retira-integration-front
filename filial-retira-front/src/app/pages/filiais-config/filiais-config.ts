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
    etapasLeituraPedido: [], 
    idClienteOmie: null,
    cnpj:''
  };

  opcoesEtapas: any[] = [];
  mensagemSucesso = '';

  cnpjBusca: string = '';
  buscandoCnpj: boolean = false;
  clienteEncontrado: any = null;

  constructor(private integracaoService: IntegracaoService) {}

  ngOnInit(): void {
    this.carregarFiliais();
    this.integracaoService.listarEtapas().subscribe({
        next: (res) => this.opcoesEtapas = res,
        error: (err) => console.log('Matriz provavelmnete não configurada ainda', err)
    });
  }

  buscarCnpjNaMatriz() {
    if (!this.cnpjBusca) {
      alert('Digite o CNPJ primeiro!');
      return;
    }

    this.buscandoCnpj = true;
    this.clienteEncontrado = null;

    this.integracaoService.buscarClienteOmie(this.cnpjBusca).subscribe({
      next: (resposta) => {
        this.clienteEncontrado = resposta;
        this.novaFilial.idClienteOmie = resposta.id; 
        this.novaFilial.cnpj = resposta.cnpj;
        this.buscandoCnpj = false;
      },
      error: (err) => {
        alert('Cliente não encontrado na Matriz! Verifique se o CNPJ está correto.');
        this.novaFilial.idClienteOmie = null;
        this.novaFilial.cnpj = '';
        this.buscandoCnpj = false;
      }
    });
  }

  toggleEtapa(valorDaEtapa: string, event: any) {
    const isChecked = event.target.checked;
    
    if (!Array.isArray(this.novaFilial.etapasLeituraPedido)) {
        this.novaFilial.etapasLeituraPedido = [];
    }
    
    if (isChecked) {
      this.novaFilial.etapasLeituraPedido.push(valorDaEtapa);
    } else {
      this.novaFilial.etapasLeituraPedido = this.novaFilial.etapasLeituraPedido.filter((e: string) => e !== valorDaEtapa);
    }
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
        
        this.novaFilial = { 
            unidade: '', 
            matriz: false, 
            appKey: '', 
            appSecret: '', 
            etapasLeituraPedido: [],
            idClienteOmie: null,
            cnpj: ''
        };
        
        const checkboxes = document.querySelectorAll('.form-check-input') as NodeListOf<HTMLInputElement>;
        checkboxes.forEach(cb => cb.checked = false);
        
        setTimeout(() => this.mensagemSucesso = '', 5000);
      },
      error: (err) => alert('Erro ao salvar filial!')
    });
  }
}