import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IntegracaoService {
  // A URL oficial da sua VPS!
  private apiUrl = 'http://62.171.182.180:8080/api/integracao';

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
}