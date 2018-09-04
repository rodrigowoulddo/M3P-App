import {Component} from '@angular/core';
import {AlertController, App, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Observable} from "rxjs";
import {Setor} from "../../data/setorInterface";
import {SetorService} from "../../services/setor";
import {map} from "rxjs/operators";
import {CadastroSetorPage} from "../cadastro-setor/cadastro-setor";
import {SetorPage} from "../setor/setor";
import "rxjs-compat/add/operator/map";
import {AngularFireAuth} from "angularfire2/auth";
import {LoginPage} from "../login/login";
import { Storage } from '@ionic/storage';


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


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private setorService: SetorService,
              private viewCtrl: ViewController,
              private angularFireAuth: AngularFireAuth,
              private alertCtrl: AlertController,
              private app: App,
              private storage: Storage) {

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

  addSetor() {
    this.navCtrl.push(CadastroSetorPage);
  }


  irParaPaginaDoSetor(setor: Setor) {
    this.navCtrl.push(SetorPage, {setor: setor});
  }

  filterItems(ev: any) {

    if (ev.target.value == null) {
      this.atualizaListaDeSetores();
      return;
    }

    this.setoresFiltrados$ = this.setores$.map(function (ARRAY) {
      return ARRAY.filter(function (setor) {
        return ((
          setor.sigla.toLowerCase().includes(ev.target.value.toLowerCase())) ||
          (setor.nome.toLowerCase().includes(ev.target.value.toLowerCase())) ||
          ((setor.vinculo && setor.vinculo.toLowerCase().includes(ev.target.value.toLowerCase()))))
      })
    });

    console.log(this.setores$);
  }

  onCancel() {
    this.atualizaListaDeSetores();
  }

  private atualizaListaDeSetores() {
    this.setoresFiltrados$ = this.setores$;
  }

  getUrlImagemNivel(nivel) {
    return 'http://nqi.ufcspa.edu.br/wiki/selos-niveis/' + nivel + '.png';
  }

  logoff() {

    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Deseja fazer logout da conta <br> <strong>' + this.angularFireAuth.auth.currentUser.email + '<strong>',
      buttons: [
        {
          text: 'Fazer logout',
          handler: () => {
            this.angularFireAuth.auth.signOut().then(() => {
              this.removeUsuarioLocal();
              this.app.getRootNav().setRoot(LoginPage);
            })

          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ]
    });
    alert.present();
  }

  private removeUsuarioLocal() {
    // set a key/value
    this.storage.remove('user');
  }
}
