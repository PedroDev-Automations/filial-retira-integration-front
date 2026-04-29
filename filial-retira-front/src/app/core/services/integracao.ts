import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntegracaoService {
  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Busca todas as configurações salvas no banco
  listarConfiguracoes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/configuracao`);
  }

  // Salva ou atualiza uma Matriz ou Filial
  salvarConfiguracao(config: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/configuracao`, config, { responseType: 'text' });
  }

  // O "Botão de Pânico" para forçar a busca de pedidos manualmente
  forcarVarreduraPedidos(): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos/varredura`, {}, { responseType: 'text' });
  }

  // Força a carga completa de estoque
  forcarCargaEstoque(): Observable<any> {
    return this.http.post(`${this.apiUrl}/carga-completa`, {}, { responseType: 'text' });
  }

  // Estoque Rápido (Incremental)
  forcarSincronizacaoIncremental(): Observable<any> {
    return this.http.post(`${this.apiUrl}/estoque-incremental`, {}, { responseType: 'text' });
  }

  // BUSCA A TABELA DE HISTÓRICO
  listarHistoricoExecucoes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historico`);
  }

  // BUSCA DICIONARIOS
  listarParcelas(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.apiUrl}/lookups/parcelas`);
  }

  listarCategorias(): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiUrl}/lookups/categorias`); 
  }

  listarContas(): Observable<any[]> {
     return this.http.get<any[]>(`${this.apiUrl}/lookups/contas`); 
  }

  listarEtapas(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.apiUrl}/lookups/etapas`); 
  }

  buscarClienteOmie(cnpj: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lookups/cliente?cnpj=${encodeURIComponent(cnpj)}`);
  }

  excluirConfiguracao(unidade: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/configuracao/${encodeURIComponent(unidade)}`, { responseType: 'text' });
  }
}