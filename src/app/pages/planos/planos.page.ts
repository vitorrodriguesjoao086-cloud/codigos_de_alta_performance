import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { CabecalhoComponent } from '../../components/cabecalho.component';
import { DestaqueDirective } from '../../directives/destaque.directive';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [IonContent, IonButton, CurrencyPipe, CabecalhoComponent, DestaqueDirective],
  template: `
    <app-cabecalho />
    <ion-content>
      <div class="pagina">
        <span class="eyebrow">MENSALIDADES</span>
        <h1 style="margin: 6px 0">Escolha o plano<br>que <span class="verde" style="color:var(--amarelo)">combina com você.</span></h1>
        <p style="color: var(--muted)">Planos mensais para cada etapa da sua evolução.</p>

        @for (p of planos; track p.nome) {
          <div class="card corpo" appDestaque style="cursor: default; margin-bottom: 14px; padding: 18px"
               [style.border]="p.destaque ? '2px solid var(--amarelo)' : ''">
            @if (p.destaque) { <span class="tag" style="background:var(--amarelo); color:var(--preto); border-color:transparent;">MAIS ESCOLHIDO</span> }
            <span class="eyebrow">{{ p.nome }}</span>
            <!-- PIPE BUILT-IN: currency -->
            <h1 style="margin: 4px 0">{{ p.preco | currency: 'BRL' : 'symbol' : '1.0-0' }}<small style="font-size: 14px; color: var(--muted)">/mês</small></h1>
            <p style="color: var(--muted)">{{ p.descricao }}</p>
            <ul style="padding-left: 18px">
              @for (b of p.beneficios; track b) { <li>{{ b }}</li> }
            </ul>
            <ion-button expand="block" color="primary" [fill]="p.destaque ? 'solid' : 'outline'" (click)="escolhido = p.nome">
              {{ p.botao }}
            </ion-button>
          </div>
        }

        @if (escolhido) {
          <div class="card corpo" style="cursor: default; background: var(--preto); color: var(--branco)">
            Você escolheu o plano <strong class="verde">{{ escolhido }}</strong>. Confirme sua matrícula com a equipe FitZone.
          </div>
        }
        <p style="color: var(--muted); font-size: 12px">A escolha do plano não gera cobrança automática.</p>
      </div>
    </ion-content>
  `,
})
export class PlanosPage {
  escolhido = '';
  planos = [
    { nome: 'Essencial', preco: 79, destaque: false, botao: 'Começar', descricao: 'Para quem quer treinar com liberdade.',
      beneficios: ['Musculação e cardio', 'Área do aluno', 'Agendamento online', 'Avaliação inicial'] },
    { nome: 'Performance', preco: 109, destaque: true, botao: 'Escolher Performance', descricao: 'Mais acompanhamento para acelerar sua evolução.',
      beneficios: ['Todos os benefícios do Essencial', 'Aulas coletivas', 'Treino atualizado mensalmente', 'Acompanhamento de progresso'] },
    { nome: 'Black', preco: 149, destaque: false, botao: 'Quero Black', descricao: 'Experiência completa e acompanhamento premium.',
      beneficios: ['Todos os benefícios do Performance', '1 acompanhamento individual/mês', 'Prioridade em aulas', 'Convidado 2x ao mês'] },
  ];
}
