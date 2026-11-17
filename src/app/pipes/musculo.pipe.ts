import { Pipe, PipeTransform } from '@angular/core';

// PIPE PERSONALIZADA 1: traduz o grupo muscular da API (inglês) para português
@Pipe({ name: 'musculo', standalone: true })
export class MusculoPipe implements PipeTransform {
  private mapa: Record<string, string> = {
    chest: 'Peito', lats: 'Dorsais', 'middle back': 'Costas', 'lower back': 'Lombar', quadriceps: 'Quadríceps',
    hamstrings: 'Posterior de coxa', glutes: 'Glúteos', calves: 'Panturrilha', shoulders: 'Ombros', biceps: 'Bíceps',
    triceps: 'Tríceps', forearms: 'Antebraço', abdominals: 'Abdômen', traps: 'Trapézio', neck: 'Pescoço',
    adductors: 'Adutores', abductors: 'Abdutores',
  };
  transform(valor: string): string { return this.mapa[valor] ?? valor; }
}
