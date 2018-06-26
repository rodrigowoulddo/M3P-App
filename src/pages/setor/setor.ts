import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import {Setor} from "../../data/setorInterface";
import {CadastroSetorPage} from "../cadastro-setor/cadastro-setor";
import {SetorService} from "../../services/setor";
import {AvaliacaoPage} from "../avaliacao/avaliacao";
import {PreAvaliacaoPage} from "../pre-avaliacao/pre-avaliacao";

/**
 * Generated class for the SetorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setor',
  templateUrl: 'setor.html',
})
export class SetorPage {

  setor:Setor;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private setorService: SetorService,
              private viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetorPage');
  }

  ngOnInit(){
    this.setor = this.navParams.get('setor');
  }

  editarSetor() {
    this.navCtrl.push(CadastroSetorPage, {setor: this.setor});
  }

  excluirSetor() {

    //Alert de confirmação
      const confirm = this.alertCtrl.create({
        title: 'Excluir Setor',
        message: 'Ao excluir um setor todos seus dados e histórico de avaliações serão excluídos. Deseja Continuar?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {}
          },
          {
            text: 'Excluir',
            handler: () => {
              this.setorService.delete(this.setor);
              this.fecharPágina();
            }
          }
        ]
      });
      confirm.present();
    }

  fecharPágina(){
    this.viewCtrl.dismiss();
  }

  avaliarSetor() {

    if(this.setor.sendoAvaliado)
      this.navCtrl.push(AvaliacaoPage, {setor: this.setor});
    else
      this.navCtrl.push(PreAvaliacaoPage, {setor: this.setor});


  }
}
