import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: 'exercicios', loadComponent: () => import('./pages/exercicios/exercicios.page').then(m => m.ExerciciosPage) },
  // EXTRA: parâmetro por rota (:id) -> lista de exercícios para detalhes
  { path: 'exercicio/:id', loadComponent: () => import('./pages/detalhes/detalhes.page').then(m => m.DetalhesPage) },
  { path: 'treinos', loadComponent: () => import('./pages/treinos/treinos.page').then(m => m.TreinosPage) },
  { path: 'planos', loadComponent: () => import('./pages/planos/planos.page').then(m => m.PlanosPage) },
  { path: 'equipe', loadComponent: () => import('./pages/equipe/equipe.page').then(m => m.EquipePage) },
];
