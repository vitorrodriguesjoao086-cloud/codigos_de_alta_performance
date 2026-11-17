import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, barbell, list, pricetag, people } from 'ionicons/icons';
import { MarcaComponent } from './components/marca.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonMenu, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, RouterLink, MarcaComponent],
  template: `
    <ion-app>
      <ion-menu contentId="main">
        <ion-content>
          <div style="padding: 28px 20px 12px"><app-marca /></div>
          <ion-list style="background: transparent">
            @for (item of itens; track item.url) {
              <ion-menu-toggle [autoHide]="false">
                <ion-item [routerLink]="item.url" routerDirection="root" lines="none">
                  <ion-icon slot="start" [name]="item.icone"></ion-icon>
                  <ion-label>{{ item.titulo }}</ion-label>
                </ion-item>
              </ion-menu-toggle>
            }
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main"></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {
  itens = [
    { titulo: 'Visão geral', url: '/home', icone: 'home' },
    { titulo: 'Exercícios', url: '/exercicios', icone: 'barbell' },
    { titulo: 'Meus treinos', url: '/treinos', icone: 'list' },
    { titulo: 'Planos', url: '/planos', icone: 'pricetag' },
    { titulo: 'Equipe', url: '/equipe', icone: 'people' },
  ];
  constructor() { addIcons({ home, barbell, list, pricetag, people }); }
}
