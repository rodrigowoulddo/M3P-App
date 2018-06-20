import { Setor } from "../data/setorInterface";
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";
import {ToastController} from "ionic-angular";

@Injectable()
export class SetorService {

  private setoresRef = this.db.list<Setor>('setores');
  public setores: Setor[];

  constructor(private db: AngularFireDatabase,
              private toastCtrl: ToastController
              ){ }


  getAll(){
    return this.setoresRef;
  }

  save(setor: Setor){

    if(setor.key == null){
      console.log(setor.key);
      setor.key = this.setoresRef.push(null).key;
      this.setoresRef.update('/'+setor.key,setor);

      this.mostrarToast('Setor '+setor.sigla+' adicionado');

      console.log("FIREBASE: Setor Adicionado:");
      console.log(setor);
    }
    else{
      console.log(setor.key);
      this.setoresRef.update('/'+setor.key,setor);

      this.mostrarToast('Setor '+setor.sigla+' editado');

      console.log("FIREBASE: Setor Editado:");
      console.log(setor);
    }
  }

  delete(setor: Setor){
    let updates = {};
    updates['/setores/' + setor.key] = null;
    this.db.database.ref().update(updates);

    this.mostrarToast('Setor '+setor.sigla+' excluído');

    console.log("FIREBASE: Setor Excluído:");
    console.log(setor);
  }

  mostrarToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

}
