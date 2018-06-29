import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Avaliacao} from "../data/avaliacaoInterface";
import {NivelService} from "./nivel";
import {Nivel} from "../data/nivelInterface";

@Injectable()
export class AvaliacaoService {


  private avaliacaoRef = this.db.list<Avaliacao>('avaliacoes');
  private niveisRef = this.db.database.ref('niveis');
  public avaliacoes: Avaliacao[];

  constructor(private db: AngularFireDatabase, private nivelService: NivelService){ }


  getAll(){
    return this.avaliacaoRef;
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


//TODO CONSERTAR HORA E MINUTOS PRO TAMANHO NA STRING (IGUAL DIA E MÊS)

  getDataAgora(){

    let sdia;
    let smes;

    let data = new Date();

    let dia = data.getDate();
    sdia = dia.toString();
    if (dia.toString().length == 1)
      sdia = "0"+dia;

    let mes = data.getMonth()+1;
    smes = mes.toString();
    if (mes.toString().length == 1)
      smes = "0"+mes;
    let ano = data.getFullYear();
    return sdia+"/"+smes+"/"+ano+' (' + data.getHours() + ':' + data.getMinutes() + ')';

    // let dateAgora = new Date();
    // return dateAgora.getDay() + '/' + dateAgora.getMonth() + '/' + dateAgora.getDay() + ' (' + dateAgora.getHours() + ':' + dateAgora.getMinutes() + ')';
  }

}
