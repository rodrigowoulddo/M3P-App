import {Criterio} from "./criterioInterface";

export interface Nivel {
  key?: string,
  nome: string,
  avaliacaoManual? : string,
  criterios: Criterio[],
  usuarioAvaliacaoManual?: string,
}
