import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Avaliacao} from "../data/avaliacaoInterface";
import {Criterio} from "../data/criterioInterface";
import {ItemDeAvaliacao} from "../data/itemDeAvaliacaoInterface";
import {map} from "rxjs/operators";
import {Nivel} from "../data/nivelInterface";

@Injectable()
export class AvaliacaoService {


  private avaliacaoRef = this.db.list<Avaliacao>('avaliacoes');
  private niveisRef = this.db.database.ref('niveis');
  public avaliacoes: Avaliacao[];

  constructor(private db: AngularFireDatabase){ }


  getAll(){
    return this.avaliacaoRef;
  }

  getCriterios(refNivel){
    return this.db.list<Criterio>(refNivel);
  }

  getNivel(refNivel){
    return this.db.object<Nivel>(refNivel);
  }

  getCriterio(refCriterio){
    return this.db.object<Criterio>(refCriterio);
  }

  getItensDeAvaliacao(refCriterio){
    return this.db.list<ItemDeAvaliacao>(refCriterio);
  }

  getCorpoAvaliacao(setorKey: string,avaliacaoKey: string){
    let pathAvaliacaoEspecifica = 'avaliacoes'+'/'+setorKey+'/'+avaliacaoKey;
    let refCorpoAvaliacaoEspecifica = this.db.object<Avaliacao>(pathAvaliacaoEspecifica);
    return refCorpoAvaliacaoEspecifica;
  }

  getAvaliacaoMaisRecente(setorKey: string, onResponse, context){
    let pathAvaliacoes = 'avaliacoes'+'/'+setorKey+'/';
    let refAvaliacaoMaisRecente  = this.db.database.ref(pathAvaliacoes).orderByChild('dataInicio').limitToLast(1);

    let self = this;

    //@Rodrigo
    // Usar o '.once' para ter o retorno do firebase somente uma vez. Caso
    // se use '.on' ele executa a cada vez que o objeto muda no banco

    refAvaliacaoMaisRecente.once("value", function(data) {
      let avaliacaoMaisRecenteObj: Avaliacao = data.val();
      let avaliacaoMaisRecente;

      for(var key in avaliacaoMaisRecenteObj) {
        var value = avaliacaoMaisRecenteObj[key];
        avaliacaoMaisRecente = value;
      }

      onResponse(self.getCorpoAvaliacao(setorKey, avaliacaoMaisRecente.key), context);

    }, function (error) {
      console.log("Error: " + error.code);
    });
  }

  getRef3UltimasAvaliacoes(setorKey){
    let pathAvaliacoes = 'avaliacoes'+'/'+setorKey+'/';
    // let refUltimas3Avaliacoes  = this.db.database.ref(pathAvaliacoes).limitToLast(3);
    // return this.db.list<Avaliacao>(refUltimas3Avaliacoes);
    return  this.db.list<Avaliacao>(pathAvaliacoes, ref => ref.orderByChild('dataInicio'));
  }

  saveItem(item: ItemDeAvaliacao, path: string){

    console.log(path);

    let refItem = this.db.database.ref(path+'/'+item.key);
    refItem.update(JSON.parse(JSON.stringify(item)));

    // console.log("FIREBASE: Item de Avaliação Editada:");
    // console.log(item);
  }

  saveAvaliacaoItem(item: ItemDeAvaliacao, path: string){

    console.log(path);

    let refItem = this.db.database.ref(path+'/'+item.key+'/');
    refItem.update({avaliacao: item.avaliacao});

    // console.log("FIREBASE: Item de Avaliação Editada:");
    // console.log(item);
  }

  save(avaliacao: Avaliacao){

    let self = this; // Para referências dos métodos assíncronos

        // Create
        if(avaliacao.key == null){

          this.niveisRef.once("value")
            .then(function(snapshot) {
              avaliacao.corpo = snapshot.val();

              avaliacao.key = self.avaliacaoRef.push(null).key;
              self.avaliacaoRef.update('/'+avaliacao.setor+'/'+avaliacao.key,avaliacao);

              console.log("FIREBASE: Avaliação Adicionada ao setor "+avaliacao.setor+":");
              console.log(avaliacao);
            });

        }

        // Update
        else{
          self.avaliacaoRef.update('/'+avaliacao.setor+'/'+avaliacao.key,JSON.parse(JSON.stringify(avaliacao)));

          console.log("FIREBASE: Avaliação Editada:");
          console.log(avaliacao);
        }
  }

  saveNivelAvaliacao(nivel: Nivel, refNivel){
    this.db.database.ref(refNivel).update(nivel);
  }

  saveCriterioAvaliacao(criterio: Criterio, refCriterio){
    this.db.database.ref(refCriterio).update(criterio);
  }

  getDataAgora(){

    let sdia;
    let smes;
    let shora;
    let smin;

    let data = new Date();

    let dia = data.getDate();
    sdia = dia.toString();
    if (dia.toString().length == 1)
      sdia = "0"+dia;

    let mes = data.getMonth()+1;
    smes = mes.toString();
    if (mes.toString().length == 1)
      smes = "0"+mes;

    let hora = data.getHours();
    shora = hora.toString();
    if (hora.toString().length == 1)
      shora = "0"+hora;

    let min = data.getMinutes();
    smin = min.toString();
    if (min.toString().length == 1)
      smin = "0"+min;

    let ano = data.getFullYear();
    return ano+"/"+smes+"/"+sdia+' (' + shora + ':' + smin + ')';
  }

}
