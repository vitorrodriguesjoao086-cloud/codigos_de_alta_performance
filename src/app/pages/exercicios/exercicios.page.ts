import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { IonContent, IonSearchbar, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, checkmark } from 'ionicons/icons';
import { CabecalhoComponent } from '../../components/cabecalho.component';
import { ExercicioService } from '../../services/exercicio.service';
import { TreinoService } from '../../services/treino.service';
import { Exercicio, GRUPOS } from '../../models/exercicio';
import { MusculoPipe } from '../../pipes/musculo.pipe';
import { DestaqueDirective } from '../../directives/destaque.directive';
import { FallbackImgDirective } from '../../directives/fallback-img.directive';

@Component({
  selector: 'app-exercicios',
  standalone: true,
  imports: [IonContent, IonSearchbar, IonButton, IonIcon, IonSpinner, RouterLink, TitleCasePipe, UpperCasePipe, CabecalhoComponent, MusculoPipe, DestaqueDirective, FallbackImgDirective],
  template: `
    <app-cabecalho />
    <ion-content>
      <div class="pagina">
        <span class="eyebrow">MOVIMENTO COM PROPÓSITO</span>
        <h1 style="margin: 6px 0">Catálogo de exercícios</h1>
        <p style="color: var(--muted); margin-top: 0">Encontre o movimento certo para o seu próximo treino.</p>

        <ion-searchbar placeholder="Buscar exercício (em inglês)..." debounce="300" (ionInput)="buscar($event)"></ion-searchbar>

        <div class="chips">
          <span class="tag" [style.background]="grupo === '' ? '#aee65e' : ''" (click)="filtrar('')">Todos</span>
          @for (g of grupos; track g) {
            <span class="tag" [style.background]="grupo === g ? '#aee65e' : ''" (click)="filtrar(g)">{{ g | musculo }}</span>
          }
        </div>

        @if (carregando) {
          <div class="centro"><ion-spinner></ion-spinner></div>
        } @else if (visiveis.length === 0) {
          <div class="vazio"><h3>Nenhum exercício encontrado.</h3><p>Tente outro nome ou grupo muscular.</p></div>
        } @else {
          <div class="grade" style="margin-top: 12px">
            @for (e of visiveis; track e.id) {
              <div class="card" appDestaque [routerLink]="['/exercicio', e.id]">
                <img class="foto" appFallback [src]="api.imagem(e)" [alt]="e.name" />
                <div class="corpo">
                  <span class="eyebrow">{{ e.primaryMuscles[0] | musculo | uppercase }}</span>
                  <h3>{{ e.name | titlecase }}</h3>
                  <ion-button size="small" [fill]="treino.tem(e.id) ? 'solid' : 'outline'" color="primary" (click)="alternar($event, e)">
                    <ion-icon slot="start" [name]="treino.tem(e.id) ? 'checkmark' : 'add'"></ion-icon>
                    {{ treino.tem(e.id) ? 'No treino' : 'Treino' }}
                  </ion-button>
                </div>
              </div>
            }
          </div>
          @if (visiveis.length < filtrados.length) {
            <div class="centro"><ion-button fill="clear" (click)="maisItens()">Carregar mais</ion-button></div>
          }
        }
      </div>
    </ion-content>
  `,
})
export class ExerciciosPage implements OnInit {
  api = inject(ExercicioService);
  treino = inject(TreinoService);
  private route = inject(ActivatedRoute);

  grupos = GRUPOS;
  grupo = '';
  termo = '';
  carregando = false;
  filtrados: Exercicio[] = [];
  visiveis: Exercicio[] = [];
  private limite = 24;

  constructor() { addIcons({ add, checkmark }); }

  ngOnInit() {
    this.route.queryParamMap.subscribe(p => this.filtrar(p.get('grupo') ?? ''));
  }

  filtrar(grupo: string) {
    this.grupo = grupo;
    this.carregando = true;
    const req = grupo ? this.api.listarPorMusculo(grupo) : this.api.listar();
    req.subscribe(l => { this.base = l; this.limite = 24; this.aplicar(); this.carregando = false; });
  }
  private base: Exercicio[] = [];

  buscar(ev: any) { this.termo = (ev.target.value ?? '').toLowerCase().trim(); this.limite = 24; this.aplicar(); }
  maisItens() { this.limite += 24; this.aplicar(); }

  private aplicar() {
    this.filtrados = this.base.filter(e => e.name.toLowerCase().includes(this.termo));
    this.visiveis = this.filtrados.slice(0, this.limite);
  }

  alternar(ev: Event, e: Exercicio) {
    ev.stopPropagation();
    this.treino.alternar({ id: e.id, name: e.name, imagem: this.api.imagem(e), musculo: e.primaryMuscles[0] });
  }
}
