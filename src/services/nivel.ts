import { Nivel } from "../data/nivelInterface";
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Criterio} from "../data/criterioInterface";
import {ItemDeAvaliacao} from "../data/itemDeAvaliacaoInterface";
import {HistoricoDeNivel} from "../data/historicoDeNivel";
import {AvaliacaoService} from "./avaliacao";

@Injectable()
export class NivelService {


  private niveisRef = this.db.list<Nivel>('niveis');
  private niveisHistoricoRef = this.db.list<Nivel>('historicoDeNiveis');
  public niveis: Nivel[];

  constructor(
    private db: AngularFireDatabase,
    private avaliacaoService: AvaliacaoService,
  ){


  }


  getAllasList(){
    return this.niveisRef;
  }

  saveNiveisHistorico(niveisHistorico: Nivel[], nomeDaVersao: string){

    //Inativa o último
    let refUltimaOrganizacaoDeNiveis = this.db.database.ref('historicoDeNiveis').orderByChild('dataCriacao').limitToLast(1);

    let self = this;

    refUltimaOrganizacaoDeNiveis.once("value",
      data => {

        if(data.exists()){
          // Põe data de fim ao último
          let ultimaOrganizacaoDeNiveis: HistoricoDeNivel = data.val()[Object.keys(data.val())[0]];
          ultimaOrganizacaoDeNiveis.dataInativacao = self.avaliacaoService.getDataAgora();
          self.niveisHistoricoRef.update('/' + ultimaOrganizacaoDeNiveis.key, JSON.parse(JSON.stringify(ultimaOrganizacaoDeNiveis)));
        }

        // Cria novo e adiciona ao histórico
        let novoHistorico: HistoricoDeNivel = {nome: nomeDaVersao, dataCriacao: self.avaliacaoService.getDataAgora(), niveis: niveisHistorico};
        novoHistorico.key = self.niveisHistoricoRef.push(null).key;
        self.niveisHistoricoRef.update('/'+ novoHistorico.key, JSON.parse(JSON.stringify(novoHistorico)));

      }
    );



  }

  saveNiveis(niveis: Nivel[]){
    niveis.forEach(nivel => this.saveNivel(nivel));
  }

  saveNivel(nivel: Nivel){

    let nivelCopy = {...nivel};

    nivel.key = this.niveisRef.push(null).key;
    nivel.criterios = null;
    this.niveisRef.update('/'+nivel.key,JSON.parse(JSON.stringify(nivel)));

    //dbug
    console.log('nvel cujos criterios serao copiadas');
    console.log(nivelCopy);

    if (!nivelCopy.criterios) nivelCopy.criterios = [];
    (<any>Object).values(nivelCopy.criterios).forEach(criterio => this.saveCriterio(criterio, nivel.key));

  }

  saveCriterio(criterio: Criterio, keyNivel: string){

    let criterioCopy = {...criterio};

    criterio.key = this.db.list<Nivel>('niveis'+'/'+keyNivel+'criterios').push(null).key;
    criterio.itensDeAvaliacao = null;
    this.niveisRef.update('/'+ keyNivel + '/criterios/' + criterio.key ,JSON.parse(JSON.stringify(criterio)));

    if (!criterioCopy.itensDeAvaliacao) criterioCopy.itensDeAvaliacao = [];
    (<any>Object).values(criterioCopy.itensDeAvaliacao).forEach(item => this.saveItemDeAvaliacao(item, keyNivel, criterio.key));

  }

  saveItemDeAvaliacao(item: ItemDeAvaliacao, keyNivel: string, keyCriterio: string){
    item.key = this.niveisRef.push(null).key;
    this.niveisRef.update('/'+ keyNivel + '/criterios/' + keyCriterio + '/itensDeAvaliacao/'+ item.key ,JSON.parse(JSON.stringify(item)));
  }

  deleteNiveis(){
    this.db.object('niveis').remove();
  }

}
