import { Nivel } from "../data/nivelInterface";
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
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

  getAllAsArray(context){

    console.log('buscando niveis as array...')

    this.db.database.ref('niveis').once("value",
      (data) => {
        context.niveis = (<any>Object).values(data.val());
        console.log(context.niveis);
      },
      () => {console.log('ERRO AO BUSCAR NÍVEIS'); return []}
    );

  }

}
