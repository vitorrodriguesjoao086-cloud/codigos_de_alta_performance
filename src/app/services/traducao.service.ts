import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';

interface RespostaTraducao {
  responseStatus: number;
  responseDetails?: string;
  responseData?: { translatedText?: string };
}

@Injectable({ providedIn: 'root' })
export class TraducaoService {
  private http = inject(HttpClient);
  private cache = new Map<string, string>();
  private url = 'https://api.mymemory.translated.net/get';

  traduzir(textos: string[], origem = 'en', destino = 'pt-BR'): Observable<string[]> {
    const chave = (texto: string) => `${origem}|${destino}|${texto}`;
    const pendentes = [...new Set(textos.filter(texto => texto.trim()))]
      .filter(texto => !this.cache.has(chave(texto)));
    const partes = pendentes.flatMap(texto => this.dividir(texto).map(parte => ({ texto, parte })));
    const lotes: { texto: string; parte: string }[][] = [];
    let lote: { texto: string; parte: string }[] = [];
    let tamanho = 0;

    for (const item of partes) {
      if (lote.length && tamanho + item.parte.length + 1 > 450) {
        lotes.push(lote);
        lote = [];
        tamanho = 0;
      }
      lote.push(item);
      tamanho += item.parte.length + 1;
    }
    if (lote.length) lotes.push(lote);

    if (!lotes.length) {
      return of(textos.map(texto => this.cache.get(chave(texto)) ?? texto));
    }

    return forkJoin(lotes.map(itens => this.http.get<RespostaTraducao>(this.url, {
      params: {
        q: itens.map(item => item.parte).join('\n'),
        langpair: `${origem}|${destino}`,
      },
    }).pipe(map(resposta => {
      if (resposta.responseStatus !== 200 || !resposta.responseData?.translatedText) {
        throw new Error(resposta.responseDetails || 'A API de tradução está indisponível.');
      }
      const traduzidos = resposta.responseData.translatedText.replace(/\r/g, '').split('\n');
      if (traduzidos.length !== itens.length) {
        throw new Error('A resposta da API de tradução veio em um formato inesperado.');
      }
      return itens.map((item, indice) => ({ ...item, traduzido: traduzidos[indice] }));
    })))).pipe(map(resultados => {
      const porTexto = new Map<string, string[]>();
      for (const loteTraduzido of resultados) {
        for (const item of loteTraduzido) {
          const partesTraduzidas = porTexto.get(item.texto) ?? [];
          partesTraduzidas.push(item.traduzido);
          porTexto.set(item.texto, partesTraduzidas);
        }
      }
      for (const texto of pendentes) {
        this.cache.set(chave(texto), (porTexto.get(texto) ?? []).join(' '));
      }
      return textos.map(texto => this.cache.get(chave(texto)) ?? texto);
    }));
  }

  private dividir(texto: string): string[] {
    const partes: string[] = [];
    let restante = texto.trim();
    while (restante.length > 450) {
      let corte = restante.lastIndexOf(' ', 450);
      if (corte < 1) corte = 450;
      partes.push(restante.slice(0, corte));
      restante = restante.slice(corte).trim();
    }
    if (restante) partes.push(restante);
    return partes;
  }
}
