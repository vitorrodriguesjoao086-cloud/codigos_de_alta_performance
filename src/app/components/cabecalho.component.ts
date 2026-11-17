import { Component, Input } from '@angular/core';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonBackButton } from '@ionic/angular/standalone';
import { MarcaComponent } from './marca.component';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonBackButton, MarcaComponent],
  template: `
    <ion-header>
      <ion-toolbar class="barra">
        <ion-buttons slot="start">
          @if (voltar) { <ion-back-button defaultHref="/exercicios" text=""></ion-back-button> }
          @else { <ion-menu-button></ion-menu-button> }
        </ion-buttons>
        <div style="padding-left: 4px"><app-marca /></div>
      </ion-toolbar>
    </ion-header>
  `,
})
export class CabecalhoComponent {
  @Input() voltar = false;
}
