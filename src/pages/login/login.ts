import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {TabsPage} from "../tabs/tabs";
import { Storage } from '@ionic/storage';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string;
  password: string;
  loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private angularFireAuth: AngularFireAuth, private alertCtrl: AlertController, private loadingCtrl: LoadingController,private storage: Storage) {

    this.verificarUsuarioJaLogado();
  }

  private verificarUsuarioJaLogado() {
    this.storage.get('user')
      .then((val) => {

        let logado;

        //DEBUG
        console.log('Usuário logado:', val);

        if (!val) {
          console.log('Usuario não logado!');
          logado = false;
        }
        else {
          console.log('Usuario', val, 'logado!');
          logado = true;
          this.setarRootPáginaInicial();
        }

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidLeave() {
    if(this.loading)
      this.loading.dismiss();
  }

  async login() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();
      this.angularFireAuth.auth.signInWithEmailAndPassword(this.email, this.password)
        .then(auth => {
          this.setarRootPáginaInicial();
          this.salvarUsuarioLocal(this.email);
        }).catch(err => {
          let alert = this.alertCtrl.create({
            title: 'Ops! :(',
            message: err,
            buttons: ['OK']
          });
          this.loading.dismiss();
          alert.present();
        });

    } catch (e) {
      let alert = this.alertCtrl.create({
        title: 'Ops! :(',
        subTitle: 'Problema com o login... Tente novamente mais tarde.',
        buttons: ['aceitar']
      });
      this.loading.dismiss();
      alert.present();
    }
  }

  private setarRootPáginaInicial() {
    this.navCtrl.setRoot(TabsPage);
  }

  private salvarUsuarioLocal(email: string) {
    // set a key/value
    this.storage.set('user',email);
  }
}
