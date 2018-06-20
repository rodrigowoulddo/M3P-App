import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Observable} from "rxjs";
import {Setor} from "../../data/setorInterface";
import {SetorService} from "../../services/setor";
import {map} from "rxjs/operators";
import {CadastroSetorPage} from "../cadastro-setor/cadastro-setor";
import {SetorPage} from "../setor/setor";
import "rxjs-compat/add/operator/map";

/**
 * Generated class for the SetoresPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setores',
  templateUrl: 'setores.html',
})
export class SetoresPage {

  setores$: Observable<Setor[]>;
  setoresFiltrados$: Observable<Setor[]>;


  constructor(  public navCtrl: NavController,
                public navParams: NavParams,
                private setorService: SetorService) {

    this.setores$ = this.setorService
      .getAll() //DB LIST
      .snapshotChanges()// KEY AND VALUE
      .pipe(map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val(),
          }));
        }
      ));

    this.atualizaListaDeSetores();
  }

  ionViewDidLoad() {

  }

  addSetor(){
    this.navCtrl.push(CadastroSetorPage);
  }


  irParaPaginaDoSetor(setor: Setor){
    this.navCtrl.push(SetorPage, {setor: setor});
  }

  filterItems(ev: any) {

    this.setoresFiltrados$ = this.setores$.map(function(ARRAY) {
      return ARRAY.filter(function(setor) {
        return ((setor.sigla.toLowerCase().includes(ev.target.value.toLowerCase())) || (setor.nome.toLowerCase().includes(ev.target.value.toLowerCase())))
      })
    });

    console.log(this.setores$);
  }

  onCancel($event: UIEvent) {
    this.atualizaListaDeSetores();
  }

  private atualizaListaDeSetores() {
    this.setoresFiltrados$ = this.setores$;
  }
}
