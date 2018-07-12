import { Setor } from "../data/setorInterface";
import {Injectable} from "@angular/core";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class SetorService {

  private setoresRef = this.db.list<Setor>('setores');
  public setores: Setor[];

  constructor(private db: AngularFireDatabase){ }


  getAll(){
    return this.setoresRef;
  }

  save(setor: Setor){

    if(setor.key == null){
      setor.key = this.setoresRef.push(null).key;
      this.setoresRef.update('/'+setor.key,JSON.parse(JSON.stringify(setor)));

      console.log("FIREBASE: Setor Adicionado:");
      console.log(setor);
    }
    else{
      this.setoresRef.update('/'+setor.key,JSON.parse(JSON.stringify(setor)));

      console.log("FIREBASE: Setor Editado:");
      console.log(setor);
    }
  }

  delete(setor: Setor){
    let updates = {};
    updates['/setores/' + setor.key] = null;
    this.db.database.ref().update(updates);

    console.log("FIREBASE: Setor Excluído:");
    console.log(setor);
  }

  setorTemAvaliacaoAnterior(key: string){
    return false;
  }

}
