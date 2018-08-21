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
      setor.ativo = true;
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
    setor.ativo = false;
    this.save(setor);

    console.log("FIREBASE: Setor Excluído:");
    console.log(setor);
  }

  exist() {
    // Não faz nada (ver uso)
  }
}
