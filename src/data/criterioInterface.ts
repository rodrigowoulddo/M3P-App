import {ItemDeAvaliacao} from "./itemDeAvaliacaoInterface";

export interface Criterio {
  key?: string,
  descricao: string,
  nome: string,
  avaliacaoManual?: string,
  itensDeAvaliacao: ItemDeAvaliacao[],
  usuarioAvaliacaoManual?: string,
}
