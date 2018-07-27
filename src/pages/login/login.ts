import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {TabsPage} from "../tabs/tabs";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private angularFireAuth: AngularFireAuth, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewDidLeave() {
    this.loading.dismiss();
  }

  async login() {
    try {
      this.loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      });
      this.loading.present();
      const autenticacao = this.angularFireAuth.auth.signInWithEmailAndPassword(this.email, this.password)
        .then(auth => {
          this.navCtrl.setRoot(TabsPage);
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
}
