import { Component, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { CabecalhoComponent } from '../../components/cabecalho.component';
import { TreinoService } from '../../services/treino.service';
import { MusculoPipe } from '../../pipes/musculo.pipe';
import { FallbackImgDirective } from '../../directives/fallback-img.directive';
import { DestaqueDirective } from '../../directives/destaque.directive';

@Component({
  selector: 'app-treinos',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, RouterLink, TitleCasePipe, CabecalhoComponent, MusculoPipe, FallbackImgDirective, DestaqueDirective],
  template: `
    <app-cabecalho />
    <ion-content>
      <div class="pagina">
        <span class="eyebrow">CONSISTÊNCIA QUE TRANSFORMA</span>
        <h1 style="margin: 6px 0">Meus treinos</h1>
        <p style="color: var(--muted); margin-top: 0">Seus exercícios, organizados para você evoluir.</p>

        @if (treino.itens().length === 0) {
          <div class="vazio">
            <div style="font-size: 36px; color: var(--coral)">✳</div>
            <h3>Seu próximo treino começa aqui.</h3>
            <p>Escolha exercícios no catálogo e dê início a uma nova etapa.</p>
            <ion-button color="primary" routerLink="/exercicios">Ver exercícios →</ion-button>
          </div>
        } @else {
          @for (i of treino.itens(); track i.id) {
            <div class="card" appDestaque style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px" [routerLink]="['/exercicio', i.id]">
              <img appFallback [src]="i.imagem" [alt]="i.name" style="width: 84px; height: 84px; object-fit: cover" />
              <div style="flex: 1">
                <span class="eyebrow">{{ i.musculo | musculo }}</span>
                <h3 style="margin: 4px 0">{{ i.name | titlecase }}</h3>
              </div>
              <ion-button fill="clear" style="--color: #e84935" (click)="remover($event, i)"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
            </div>
          }
        }
      </div>
    </ion-content>
  `,
})
export class TreinosPage {
  treino = inject(TreinoService);
  constructor() { addIcons({ trash }); }
  remover(ev: Event, item: any) { ev.stopPropagation(); this.treino.alternar(item); }
}
