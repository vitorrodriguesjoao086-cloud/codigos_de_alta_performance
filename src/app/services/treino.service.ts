import { Injectable, computed, signal } from '@angular/core';
import { ItemTreino } from '../models/exercicio';

// SERVICE 2 - funcionalidade "Meus treinos": guarda os exercícios escolhidos (localStorage)
@Injectable({ providedIn: 'root' })
export class TreinoService {
  private chave = 'fitzone-meu-treino';
  itens = signal<ItemTreino[]>(JSON.parse(localStorage.getItem(this.chave) ?? '[]'));
  total = computed(() => this.itens().length);

  tem(id: string): boolean { return this.itens().some(i => i.id === id); }

  alternar(item: ItemTreino): void {
    const novo = this.tem(item.id) ? this.itens().filter(i => i.id !== item.id) : [...this.itens(), item];
    this.itens.set(novo);
    localStorage.setItem(this.chave, JSON.stringify(novo));
  }
}
