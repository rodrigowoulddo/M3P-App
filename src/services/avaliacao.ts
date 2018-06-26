import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {Avaliacao} from "../data/avaliacaoInterface";
import {ToastController} from "ionic-angular";

@Injectable()
export class AvaliacaoService {


  private avaliacaoRef = this.db.list<Avaliacao>('avaliacoes');
  public avaliacoes: Avaliacao[];

  constructor(private db: AngularFireDatabase,
              private toastCtrl: ToastController
  ){ }


  getAll(){
    return this.avaliacaoRef;
  }

  save(avaliacao: Avaliacao){

    if(avaliacao.key == null){
      avaliacao.key = this.avaliacaoRef.push(null).key;
      this.avaliacaoRef.update('/'+avaliacao.setor+'/'+avaliacao.key,JSON.parse(JSON.stringify(avaliacao)));

      console.log("FIREBASE: Avaliação Adicionada ao setor "+avaliacao.setor+":");
      console.log(avaliacao);
    }
    else{
      this.avaliacaoRef.update('/'+avaliacao.setor+'/'+avaliacao.key,JSON.parse(JSON.stringify(avaliacao)));

      console.log("FIREBASE: Avaliação Editada:");
      console.log(avaliacao);
    }
  }

  getDataAgora(){
    var dateAgora = new Date();
    let agora = dateAgora.getDay()+'/'+dateAgora.getMonth()+'/'+dateAgora.getDay()+' ('+dateAgora.getHours()+':'+dateAgora.getMinutes()+')';

    return agora;
  }

}
