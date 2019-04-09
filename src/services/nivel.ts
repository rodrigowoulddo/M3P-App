import { Nivel } from "../data/nivelInterface";
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Criterio} from "../data/criterioInterface";
import {ItemDeAvaliacao} from "../data/itemDeAvaliacaoInterface";
// import {ToastController} from "ionic-angular";

@Injectable()
export class NivelService {


  private niveisRef = this.db.list<Nivel>('niveis');
  public niveis: Nivel[];

  constructor(private db: AngularFireDatabase,
              // private toastCtrl: ToastController
  ){ }


  getAllasList(){
    return this.niveisRef;
  }

  saveNiveisHistorico(niveisHistorico: Nivel[]){

  }

  saveNiveis(niveis: Nivel[]){
    niveis.forEach(nivel => this.saveNivel(nivel));
  }

  saveNivel(nivel: Nivel){

    let nivelCopy = {...nivel};

    nivel.key = this.niveisRef.push(null).key;
    nivel.criterios = null;
    this.niveisRef.update('/'+nivel.key,JSON.parse(JSON.stringify(nivel)));

    nivelCopy.criterios.forEach(criterio => this.saveCriterio(criterio, nivel.key));

  }

  saveCriterio(criterio: Criterio, keyNivel: string){

    let criterioCopy = {...criterio};

    criterio.key = this.db.list<Nivel>('niveis'+'/'+keyNivel+'criterios').push(null).key;
    criterio.itensDeAvaliacao = null;
    this.niveisRef.update('/'+ keyNivel + '/criterios/' + criterio.key ,JSON.parse(JSON.stringify(criterio)));

    criterioCopy.itensDeAvaliacao.forEach(item => this.saveItemDeAvaliacao(item, keyNivel, criterio.key));

  }

  saveItemDeAvaliacao(item: ItemDeAvaliacao, keyNivel: string, keyCriterio: string){
    item.key = this.niveisRef.push(null).key;
    this.niveisRef.update('/'+ keyNivel + '/criterios/' + keyCriterio + '/itensDeAvaliacao/'+ item.key ,JSON.parse(JSON.stringify(item)));
  }

}
