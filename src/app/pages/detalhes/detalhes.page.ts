import { Component, OnInit, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, checkmark } from 'ionicons/icons';
import { CabecalhoComponent } from '../../components/cabecalho.component';
import { ExercicioService } from '../../services/exercicio.service';
import { TreinoService } from '../../services/treino.service';
import { Exercicio } from '../../models/exercicio';
import { MusculoPipe } from '../../pipes/musculo.pipe';
import { NivelPipe } from '../../pipes/nivel.pipe';
import { FallbackImgDirective } from '../../directives/fallback-img.directive';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonSpinner, TitleCasePipe, CabecalhoComponent, MusculoPipe, NivelPipe, FallbackImgDirective],
  template: `
    <app-cabecalho [voltar]="true" />
    <ion-content>
      <div class="pagina">
        @if (carregando) {
          <div class="centro"><ion-spinner></ion-spinner></div>
        } @else if (!exercicio) {
          <div class="vazio"><h3>Exercício não encontrado.</h3></div>
        } @else {
          <span class="eyebrow">DETALHES DO EXERCÍCIO</span>
          <h1 style="margin: 6px 0">{{ exercicio.name | titlecase }}</h1>
          <div>
            <span class="tag" style="background:#aee65e">{{ exercicio.level | nivel }}</span>
            @for (m of exercicio.primaryMuscles; track m) { <span class="tag">{{ m | musculo }}</span> }
            @for (m of exercicio.secondaryMuscles; track m) { <span class="tag" style="background:#fff0ed">{{ m | musculo }}</span> }
            @if (exercicio.equipment) { <span class="tag">{{ exercicio.equipment | titlecase }}</span> }
          </div>

          <div class="grade" style="margin: 16px 0">
            @for (img of exercicio.images; track img; let i = $index) {
              <div class="card" style="cursor: default"><img class="foto" style="height: 200px" appFallback [src]="api.imagem(exercicio, i)" [alt]="exercicio.name" /></div>
            }
          </div>

          <ion-button expand="block" color="primary" [fill]="treino.tem(exercicio.id) ? 'solid' : 'outline'" (click)="alternar()">
            <ion-icon slot="start" [name]="treino.tem(exercicio.id) ? 'checkmark' : 'add'"></ion-icon>
            {{ treino.tem(exercicio.id) ? 'No meu treino' : 'Adicionar ao meu treino' }}
          </ion-button>

          <h3>Como executar</h3>
          @for (passo of exercicio.instructions; track $index) {
            <div class="card corpo" style="cursor: default; margin-bottom: 8px">
              <span class="eyebrow">PASSO {{ $index + 1 }}</span>{{ passo }}
            </div>
          }
        }
      </div>
    </ion-content>
  `,
})
export class DetalhesPage implements OnInit {
  api = inject(ExercicioService);
  treino = inject(TreinoService);
  private route = inject(ActivatedRoute);
  exercicio?: Exercicio;
  carregando = true;

  constructor() { addIcons({ add, checkmark }); }

  ngOnInit() {
    // EXTRA: lê o parâmetro :id recebido pela rota
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.buscarPorId(id).subscribe(e => { this.exercicio = e; this.carregando = false; });
  }

  alternar() {
    const e = this.exercicio!;
    this.treino.alternar({ id: e.id, name: e.name, imagem: this.api.imagem(e), musculo: e.primaryMuscles[0] });
  }
}
