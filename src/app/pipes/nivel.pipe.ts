import { Pipe, PipeTransform } from '@angular/core';

// PIPE PERSONALIZADA 2: traduz o nível do exercício
@Pipe({ name: 'nivel', standalone: true })
export class NivelPipe implements PipeTransform {
  transform(valor: string): string {
    const mapa: Record<string, string> = { beginner: 'Iniciante', intermediate: 'Intermediário', expert: 'Avançado' };
    return mapa[valor] ?? valor;
  }
}
