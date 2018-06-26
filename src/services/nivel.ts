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


  getAll(){
    return this.niveisRef;
  }

}
