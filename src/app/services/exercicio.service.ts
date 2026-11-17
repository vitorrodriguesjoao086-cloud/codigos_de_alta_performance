import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Exercicio } from '../models/exercicio';

// SERVICE 1 (HttpClient) - API pública free-exercise-db (JSON no GitHub, sem chave/header)
@Injectable({ providedIn: 'root' })
export class ExercicioService {
  private http = inject(HttpClient);
  private base = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main';
  private url = `${this.base}/dist/exercises.json`;

  // GET 1: catálogo completo
  listar(): Observable<Exercicio[]> {
    return this.http.get<Exercicio[]>(this.url);
  }
  // GET 2: exercícios de um grupo muscular
  listarPorMusculo(musculo: string): Observable<Exercicio[]> {
    return this.http.get<Exercicio[]>(this.url).pipe(map(l => l.filter(e => e.primaryMuscles.includes(musculo))));
  }
  // GET 3: um exercício pelo id (usado na rota exercicio/:id)
  buscarPorId(id: string): Observable<Exercicio | undefined> {
    return this.http.get<Exercicio[]>(this.url).pipe(map(l => l.find(e => e.id === id)));
  }
  // monta a URL da foto do exercício
  imagem(e: { images: string[] }, i = 0): string {
    return e.images?.length ? `${this.base}/exercises/${e.images[i]}` : '';
  }
}
