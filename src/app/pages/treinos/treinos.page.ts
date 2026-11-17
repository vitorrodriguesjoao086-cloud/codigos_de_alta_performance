import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { CabecalhoComponent } from '../../components/cabecalho.component';
import { TreinoService } from '../../services/treino.service';
import { TraducaoService } from '../../services/traducao.service';
import { MusculoPipe } from '../../pipes/musculo.pipe';
import { FallbackImgDirective } from '../../directives/fallback-img.directive';
import { DestaqueDirective } from '../../directives/destaque.directive';

@Component({
  selector: 'app-treinos',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, RouterLink, CabecalhoComponent, MusculoPipe, FallbackImgDirective, DestaqueDirective],
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
              <img appFallback [src]="i.imagem" [alt]="nome(i.id)" style="width: 84px; height: 84px; object-fit: cover" />
              <div style="flex: 1">
                <span class="eyebrow">{{ i.musculo | musculo }}</span>
                <h3 style="margin: 4px 0">{{ nome(i.id) }}</h3>
              </div>
              <ion-button fill="clear" style="--color: #e84935" (click)="remover($event, i)"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
            </div>
          }
          @if (erroTraducao) {
            <div class="vazio">
              <p>Não foi possível traduzir os nomes dos exercícios. Verifique sua conexão ou tente novamente.</p>
              <ion-button fill="outline" (click)="traduzirNomes()">Tentar novamente</ion-button>
            </div>
          }
          @if (traduzindo) { <p class="centro">Traduzindo os exercícios...</p> }
        }
      </div>
    </ion-content>
  `,
})
export class TreinosPage implements OnInit {
  treino = inject(TreinoService);
  private traducao = inject(TraducaoService);
  private nomesTraduzidos = new Map<string, string>();
  traduzindo = false;
  erroTraducao = false;

  constructor() { addIcons({ trash }); }

  ngOnInit() { this.traduzirNomes(); }

  nome(id: string): string {
    return this.nomesTraduzidos.get(id) ?? (this.traduzindo ? 'Traduzindo...' : '');
  }

  traduzirNomes() {
    const pendentes = this.treino.itens().filter(item => !this.nomesTraduzidos.has(item.id));
    if (!pendentes.length || this.traduzindo) return;
    this.traduzindo = true;
    this.erroTraducao = false;
    this.traducao.traduzir(pendentes.map(item => item.name)).subscribe({
      next: nomes => {
        nomes.forEach((nome, indice) => this.nomesTraduzidos.set(pendentes[indice].id, nome));
        this.traduzindo = false;
        this.traduzirNomes();
      },
      error: () => {
        this.traduzindo = false;
        this.erroTraducao = true;
      },
    });
  }

  remover(ev: Event, item: any) { ev.stopPropagation(); this.treino.alternar(item); }
}
