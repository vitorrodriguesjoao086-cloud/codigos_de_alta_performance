export interface Exercicio {
  id: string; name: string; level: string; equipment: string | null; category: string;
  primaryMuscles: string[]; secondaryMuscles: string[]; instructions: string[]; images: string[];
}
export interface ItemTreino { id: string; name: string; imagem: string; musculo: string; }
// grupos musculares exibidos nos filtros (chaves da API)
export const GRUPOS = ['chest', 'lats', 'quadriceps', 'shoulders', 'biceps', 'triceps', 'abdominals', 'glutes'];
