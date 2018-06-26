import {Nivel} from "./nivelInterface";

export interface Avaliacao {
  key?: string,
  setor: string,
  nivelPretendido: string,
  dataInicio: string,
  dataFim?: string,
  corpo: Nivel[]
}
