import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UpperCasePipe } from '@angular/common';
import { IonContent, IonSearchbar, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, checkmark } from 'ionicons/icons';
import { CabecalhoComponent } from '../../components/cabecalho.component';
import { ExercicioService } from '../../services/exercicio.service';
import { TreinoService } from '../../services/treino.service';
import { TraducaoService } from '../../services/traducao.service';
import { Exercicio, GRUPOS } from '../../models/exercicio';
import { MusculoPipe } from '../../pipes/musculo.pipe';
import { DestaqueDirective } from '../../directives/destaque.directive';
import { FallbackImgDirective } from '../../directives/fallback-img.directive';

@Component({
  selector: 'app-exercicios',
  standalone: true,
  imports: [IonContent, IonSearchbar, IonButton, IonIcon, IonSpinner, RouterLink, UpperCasePipe, CabecalhoComponent, MusculoPipe, DestaqueDirective, FallbackImgDirective],
  template: `
    <app-cabecalho />
    <ion-content>
      <div class="pagina">
        <span class="eyebrow">MOVIMENTO COM PROPÓSITO</span>
        <h1 style="margin: 6px 0">Catálogo de exercícios</h1>
        <p style="color: var(--muted); margin-top: 0">Encontre o movimento certo para o seu próximo treino.</p>

        <ion-searchbar aria-label="Buscar exercício" placeholder="Buscar exercício..." debounce="500" (ionInput)="buscar($event)"></ion-searchbar>

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
                <img class="foto" appFallback [src]="api.imagem(e)" [alt]="nome(e)" />
                <div class="corpo">
                  <span class="eyebrow">{{ e.primaryMuscles[0] | musculo | uppercase }}</span>
                  <h3>{{ nome(e) }}</h3>
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
        @if (traduzindo) { <p class="centro">Traduzindo os exercícios...</p> }
        @if (erroTraducao) {
          <div class="vazio">
            <p>Não foi possível traduzir os exercícios. Verifique sua conexão ou tente novamente.</p>
            <ion-button fill="outline" (click)="traduzirNomes()">Tentar novamente</ion-button>
          </div>
        }
        @if (erroBusca) { <p class="vazio">Não foi possível traduzir sua busca. Tente novamente.</p> }
      </div>
    </ion-content>
  `,
})
export class ExerciciosPage implements OnInit {
  api = inject(ExercicioService);
  treino = inject(TreinoService);
  private traducao = inject(TraducaoService);
  private route = inject(ActivatedRoute);

  grupos = GRUPOS;
  grupo = '';
  termo = '';
  carregando = false;
  filtrados: Exercicio[] = [];
  visiveis: Exercicio[] = [];
  nomesTraduzidos = new Map<string, string>();
  traduzindo = false;
  erroTraducao = false;
  erroBusca = false;
  private limite = 24;
  private termoEmIngles = '';
  private buscaId = 0;

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

  buscar(ev: any) {
    this.termo = (ev.target.value ?? '').toLowerCase().trim();
    this.limite = 24;
    const buscaId = ++this.buscaId;
    this.erroBusca = false;
    if (!this.termo) {
      this.termoEmIngles = '';
      this.aplicar();
      return;
    }
    this.traducao.traduzir([this.termo], 'pt-BR', 'en').subscribe({
      next: ([termo]) => {
        if (buscaId !== this.buscaId) return;
        this.termoEmIngles = termo.toLowerCase();
        this.aplicar();
      },
      error: () => {
        if (buscaId !== this.buscaId) return;
        this.termoEmIngles = '';
        this.erroBusca = true;
        this.aplicar();
      },
    });
  }
  maisItens() { this.limite += 24; this.aplicar(); }

  private aplicar() {
    this.filtrados = this.base.filter(e =>
      !this.termo || e.name.toLowerCase().includes(this.termo) || e.name.toLowerCase().includes(this.termoEmIngles),
    );
    this.visiveis = this.filtrados.slice(0, this.limite);
    this.traduzirNomes();
  }

  nome(exercicio: Exercicio): string {
    return this.nomesTraduzidos.get(exercicio.id) ?? (this.traduzindo ? 'Traduzindo...' : '');
  }

  traduzirNomes() {
    const pendentes = this.visiveis.filter(e => !this.nomesTraduzidos.has(e.id));
    if (!pendentes.length || this.traduzindo) return;
    this.traduzindo = true;
    this.erroTraducao = false;
    this.traducao.traduzir(pendentes.map(e => e.name)).subscribe({
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

  alternar(ev: Event, e: Exercicio) {
    ev.stopPropagation();
    this.treino.alternar({ id: e.id, name: e.name, imagem: this.api.imagem(e), musculo: e.primaryMuscles[0] });
  }
}
