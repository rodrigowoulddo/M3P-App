import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Avaliacao} from "../data/avaliacaoInterface";
import {Criterio} from "../data/criterioInterface";
import {ItemDeAvaliacao} from "../data/itemDeAvaliacaoInterface";
import {Nivel} from "../data/nivelInterface";

@Injectable()
export class AvaliacaoService {


  // Os ícones foram definidos com constantes
  // para facilitar a troca de identidade visual
  public ICON_AVALIACAO_MANUAL = "md-alert";
  public ICON_ESTRELA = "star";

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
    refItem.update({usuarioAvaliacao: item.usuarioAvaliacao});

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

  saveAndWait(avaliacao:Avaliacao, onResponse, setorSelf){

    let self = this; // Para referências dos métodos assíncronos

    // Create
      this.niveisRef.once("value")
        .then(function(snapshot) {
          avaliacao.corpo = snapshot.val();

          avaliacao.key = self.avaliacaoRef.push(null).key;

          self.avaliacaoRef.set('/'+avaliacao.setor+'/'+avaliacao.key,avaliacao).then(() => {
            onResponse(setorSelf)
          });

          console.log("FIREBASE: Avaliação Adicionada ao setor "+avaliacao.setor+":");
          console.log(avaliacao);

        });
  }
  saveNivelAvaliacao(nivel: Nivel, refNivel){
    this.db.database.ref(refNivel).update(nivel);
  }

  saveCriterioAvaliacao(criterio: Criterio, refCriterio){
    this.db.database.ref(refCriterio).update(criterio);
  }

  saveAvaliacaoManualCriterio(cor, refCriterio){
    this.db.database.ref(refCriterio).update({avaliacaoManual: cor});
  }

  saveAvaliacaoManualNivel(cor, refNivel){
    this.db.database.ref(refNivel).update({avaliacaoManual: cor});
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

  /*
    Entrada: Critério com itens de avaliação (em formato de observable)

    Possíveis saídas:
      - "avaliacaoVerde"
      - "avaliacaoAmarelo"
      - "avaliacaoVermelho"
      - "avaliacao_manual"
      - "avaliacaoCinza"

   */
  newGetAvaliacaoCriterio(criterio){

    //Transformar em array
    criterio.itensDeAvaliacao = Object.keys( criterio.itensDeAvaliacao).map(i => {
      let value = criterio.itensDeAvaliacao[i];
      value.key = i;
      return value;
    });

    let avaliacoes = [];

    criterio.itensDeAvaliacao.forEach(item => {avaliacoes.push(item.avaliacao)});

    if(this.isInArray(undefined,avaliacoes)) return "avaliacaoCinza";
    if(this.isInArray("vermelho",avaliacoes)) return "avaliacaoVermelho";
    if(this.isInArray("amarelo",avaliacoes) && !criterio.avaliacaoManual) return "avaliacaoManual";
    if(this.isInArray("amarelo",avaliacoes) && criterio.avaliacaoManual) return criterio.avaliacaoManual == "vermelho"? "avaliacaoVermelho":"avaliacaoAmarelo";
    return "avaliacaoVerde";
  }

  newGetCorCriterio(criterio){
    let avaliacao = this.newGetAvaliacaoCriterio(criterio);
    return avaliacao == "avaliacaoManual"? "avaliacaoAmarelo": avaliacao;
  }

  /*
  Entrada: Nível com critérios (em formato de observable)

  Possíveis saídas:
    - "avaliacaoVerde"
    - "avaliacaoAmarelo"
    - "avaliacaoVermelho"
    - "avaliacao_manual"
    - "avaliacaoCinza"

 */
  newGetAvaliacaoNivel(nivel){

    //Transformar em array
    nivel.criterios = Object.keys( nivel.criterios).map(i => {
      let value = nivel.criterios[i];
      value.key = i;
      return value;
    });

    let avaliacoes = [];

    nivel.criterios.forEach(item => {avaliacoes.push(this.newGetAvaliacaoCriterio(item))});

    if(this.isInArray("avaliacaoCinza",avaliacoes)) return "avaliacaoCinza";
    if(this.isInArray("avaliacaoManual",avaliacoes)) return "avaliacaoManual";
    if(this.isInArray("avaliacaoVermelho",avaliacoes)) return "avaliacaoVermelho";
    if(this.isInArray("avaliacaoAmarelo",avaliacoes) && !nivel.avaliacaoManual) return "avaliacaoManual";
    if(this.isInArray("avaliacaoAmarelo",avaliacoes) && nivel.avaliacaoManual) return nivel.avaliacaoManual == "vermelho"? "avaliacaoVermelho":"avaliacaoAmarelo";
    return "avaliacaoVerde";
  }

  newGetCorNivel(nivel){
    let avaliacao = this.newGetAvaliacaoNivel(nivel);
    return avaliacao == "avaliacaoManual"? "avaliacaoAmarelo": avaliacao;
  }

  newMostrarCardAvaliacaoManualCriterio(criterio){

    /*
    * Caso o critério chegue vazio esse método não é executado
    */
    if(!criterio.itensDeAvaliacao) return;

    //Transformar em array
    criterio.itensDeAvaliacao = Object.keys( criterio.itensDeAvaliacao).map(i => {
      let value = criterio.itensDeAvaliacao[i];
      value.key = i;
      return value;
    });

    let avaliacoes = [];

    criterio.itensDeAvaliacao.forEach(item => {avaliacoes.push(item.avaliacao)});


    if(this.isInArray(undefined,avaliacoes)) return false;
    if(this.isInArray("vermelho",avaliacoes)) return false;
    if(this.isInArray("amarelo",avaliacoes)) return true;
    return false;
  }

  newMostrarCardAvaliacaoManualNivel(nivel){

    //Transformar em array
    nivel.criterios = Object.keys( nivel.criterios).map(i => {
      let value = nivel.criterios[i];
      value.key = i;
      return value;
    });

    let avaliacoes = [];

    nivel.criterios.forEach(item => {avaliacoes.push(this.newGetAvaliacaoCriterio(item))});

    if(this.isInArray("avaliacaoCinza",avaliacoes)) return false;
    if(this.isInArray("avaliacaoManual",avaliacoes)) return false;
    if(this.isInArray("avaliacaoVermelho",avaliacoes)) return false;
    if(this.isInArray("avaliacaoAmarelo",avaliacoes)) return true;
    return false;
  }

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }


}
