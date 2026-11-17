import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { CabecalhoComponent } from '../../components/cabecalho.component';

@Component({
  selector: 'app-equipe',
  standalone: true,
  imports: [IonContent, CabecalhoComponent],
  template: `
    <app-cabecalho />
    <ion-content>
      <div class="pagina">
        <span class="eyebrow">QUEM CONSTRUIU O APP</span>
        <h1 style="margin: 6px 0">Equipe</h1>
        @for (m of membros; track m.nome) {
          <div class="card corpo" style="cursor: default; margin-bottom: 10px">
            <span class="eyebrow">{{ m.requisito }}</span>
            <h3>{{ m.nome }}</h3>
            <span style="color: var(--muted)">{{ m.descricao }}</span>
          </div>
        }
      </div>
    </ion-content>
  `,
})
export class EquipePage {
  // TROQUEM os nomes pelos integrantes do grupo
  membros = [
    { nome: 'Integrante 1', requisito: 'Requisito 1', descricao: 'Pages (Home, Exercícios, Detalhes, Treinos, Planos, Equipe) e rotas.' },
    { nome: 'Integrante 2', requisito: 'Requisito 2', descricao: 'API free-exercise-db com 3 métodos GET (exercicio.service.ts).' },
    { nome: 'Integrante 3', requisito: 'Requisito 3', descricao: 'Pipes: personalizadas (musculo, nivel) e built-in (date, uppercase, titlecase, currency).' },
    { nome: 'Integrante 4', requisito: 'Requisito 4', descricao: 'Services: ExercicioService (HttpClient) e TreinoService (localStorage).' },
    { nome: 'Integrante 5', requisito: 'Requisito 5', descricao: 'Diretivas personalizadas (appDestaque, appFallback) e estruturais @if/@for.' },
    { nome: 'Integrante 6', requisito: 'Extra', descricao: 'Parâmetro por rota (exercicio/:id) e estilização.' },
  ];
}
