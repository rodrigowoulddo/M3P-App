import {Criterio} from "./criterioInterface";
import {Nivel} from "./nivelInterface";

export interface HistoricoDeNivel {
  key?: string,
  nome: string,
  dataCriacao: string,
  dataInativacao?: string,
  niveis: Nivel[],
}
