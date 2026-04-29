import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IntegracaoService } from '../../core/services/integracao';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filiais-config',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filiais-config.html',
  styleUrl: './filiais-config.css' // Ajuste se for .scss ou se não existir
})
export class FiliaisConfigComponent implements OnInit {
  
  filiais: any[] = [];
  editando: boolean = false; // Flag para saber se estamos editando
  unidadeOriginal: string = ''; // Guarda o nome original para evitar duplicação em caso de mudança de nome
  
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
        error: (err) => console.log('Matriz provavelmente não configurada ainda', err)
    });
  }

  // ... (Mantenha o método buscarCnpjNaMatriz e toggleEtapa como estão)
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
    // Se mudou o nome da unidade durante a edição, avisa que precisamos apagar a antiga no backend
    // Opcional: Você pode travar o input de unidade durante a edição para evitar isso. Vamos assumir que você travou no HTML (readonly).
    
    this.integracaoService.salvarConfiguracao(this.novaFilial).subscribe({
      next: (resposta) => {
        this.mensagemSucesso = this.editando ? 'Filial atualizada com sucesso!' : 'Filial cadastrada com sucesso!';
        this.carregarFiliais(); 
        this.cancelarEdicao(); // Limpa o formulário e os checkboxes
        setTimeout(() => this.mensagemSucesso = '', 5000);
      },
      error: (err) => alert('Erro ao salvar filial!')
    });
  }

  // 🌟 MÉTODOS NOVOS 🌟
  
  editarFilial(filial: any) {
    this.editando = true;
    this.unidadeOriginal = filial.unidade;
    // Faz uma cópia profunda para não alterar a tabela antes de salvar
    this.novaFilial = JSON.parse(JSON.stringify(filial)); 
    
    this.cnpjBusca = filial.cnpj || '';
    if(this.cnpjBusca) {
        this.clienteEncontrado = { razao_social: 'Cliente Carregado (Matriz)', cnpj_cpf: filial.cnpj };
    } else {
        this.clienteEncontrado = null;
    }

    // Atualiza os checkboxes visualmente
    setTimeout(() => {
      const checkboxes = document.querySelectorAll('.form-check-input') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        cb.checked = this.novaFilial.etapasLeituraPedido.includes(cb.value);
      });
    }, 50);
  }

  cancelarEdicao() {
    this.editando = false;
    this.unidadeOriginal = '';
    this.novaFilial = { 
        id: null,
        unidade: '', 
        matriz: false, 
        appKey: '', 
        appSecret: '', 
        etapasLeituraPedido: [],
        idClienteOmie: null,
        cnpj: ''
    };
    this.cnpjBusca = '';
    this.clienteEncontrado = null;
    
    const checkboxes = document.querySelectorAll('.form-check-input') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(cb => cb.checked = false);
  }

  excluirFilial(unidade: string) {
    if (confirm(`Tem certeza que deseja excluir a filial ${unidade}? Esta ação não pode ser desfeita.`)) {
      this.integracaoService.excluirConfiguracao(unidade).subscribe({
        next: () => {
          this.mensagemSucesso = 'Filial removida com sucesso!';
          this.carregarFiliais();
          if (this.editando && this.unidadeOriginal === unidade) {
            this.cancelarEdicao();
          }
          setTimeout(() => this.mensagemSucesso = '', 5000);
        },
        error: (err) => alert('Erro ao excluir a filial!')
      });
    }
  }
}