import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { CabecalhoComponent } from '../../components/cabecalho.component';
import { ExercicioService } from '../../services/exercicio.service';
import { TreinoService } from '../../services/treino.service';
import { GRUPOS } from '../../models/exercicio';
import { MusculoPipe } from '../../pipes/musculo.pipe';
import { DestaqueDirective } from '../../directives/destaque.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonContent, IonButton, RouterLink, DatePipe, UpperCasePipe, CabecalhoComponent, MusculoPipe, DestaqueDirective],
  template: `
    <app-cabecalho />
    <ion-content>
      <div class="pagina">
        <!-- PIPES BUILT-IN: date + uppercase -->
        <span class="eyebrow">{{ hoje | date: "EEEE, d 'de' MMMM" | uppercase }}</span>
        <h1 style="margin: 6px 0">Olá, atleta ✳</h1>
        <p style="color: var(--muted); margin-top: 0">Pronto para dar o próximo passo hoje?</p>

        <div class="hero">
          <span class="eyebrow" style="color:#bac3b0">● SUA JORNADA CONTINUA</span>
          <h2>O progresso acontece<br><span>um treino de cada vez.</span></h2>
          <p>Consistência é o seu superpoder. Vamos treinar?</p>
          <ion-button color="primary" routerLink="/treinos">Ver meus treinos →</ion-button>
        </div>

        <h3>Seu resumo</h3>
        <div class="grade">
          <div class="card corpo" appDestaque routerLink="/treinos">
            <h1 style="margin:0">{{ treino.total() }}</h1><span class="eyebrow">EXERCÍCIOS NO SEU TREINO</span>
          </div>
          <div class="card corpo" appDestaque routerLink="/exercicios">
            <h1 style="margin:0">{{ totalCatalogo }}</h1><span class="eyebrow">EXERCÍCIOS NO CATÁLOGO</span>
          </div>
        </div>

        <h3>Treine por grupo muscular</h3>
        <div class="chips">
          @for (g of grupos; track g) {
            <span class="tag" appDestaque routerLink="/exercicios" [queryParams]="{ grupo: g }" style="padding: 8px 14px; font-size: 13px">{{ g | musculo }}</span>
          }
        </div>

        <div class="card corpo" style="margin-top: 16px; cursor: default">
          <span class="eyebrow">LEMBRETE DO DIA</span>
          <h3>O melhor treino é aquele que você faz.</h3>
          <p style="color: var(--muted); margin: 0">Não precisa ser perfeito. Só precisa começar.</p>
        </div>
      </div>
    </ion-content>
  `,
})
export class HomePage implements OnInit {
  private api = inject(ExercicioService);
  treino = inject(TreinoService);
  hoje = new Date();
  grupos = GRUPOS;
  totalCatalogo = 0;

  ngOnInit() { this.api.listar().subscribe(l => (this.totalCatalogo = l.length)); }
}
