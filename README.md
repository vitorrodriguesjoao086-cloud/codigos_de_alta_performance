# FitZone (app mobile) — Ionic + Angular standalone

Versão mobile do projeto FitZone (academia), mesmas cores, fontes, logo, textos e planos.
API usada: free-exercise-db (https://github.com/yuhonas/free-exercise-db) — JSON público, sem chave.
Nomes, equipamentos e instruções do catálogo são traduzidos sob demanda pela API MyMemory; é necessária conexão com a internet e a API pode aplicar limites de uso.

## Como rodar
1. Instale o Node.js 18+
2. Na pasta do projeto (terminal do VS Code): `npm install` e depois `npm start`
3. Abra http://localhost:4200 (F12 > modo celular)

## Onde está cada requisito
| Requisito | Onde está no código | Onde ver na tela |
|---|---|---|
| 1. Pages (Home + 5) | src/app/pages/* e app.routes.ts | Menu lateral (☰) |
| 2. API com 3 GET | services/exercicio.service.ts (listar, listarPorMusculo, buscarPorId) | Home, Exercícios, Detalhes |
| 3. Pipes personalizadas | pipes/musculo.pipe.ts e pipes/nivel.pipe.ts | Chips de grupo muscular; nível nos Detalhes |
| 3. Pipes built-in | date + uppercase (home), currency (planos) | Topo da Home; preços |
| 4. Services | exercicio.service.ts (HttpClient), treino.service.ts (localStorage) e traducao.service.ts | Catálogo, "Meus treinos" e conteúdo em português |
| 5. Diretivas personalizadas | directives/destaque.directive.ts e fallback-img.directive.ts | Hover nos cards; foto quebrada |
| 5. @if e @for | em todas as pages | Listas, estado vazio, carregando |
| Extra: parâmetro por rota | app.routes.ts (exercicio/:id) e detalhes.page.ts | Clicar num exercício |
