import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {Setor} from "../../data/setorInterface";
import {SetorService} from "../../services/setor";
import {Toaster} from "../../services/toaster";

/**
 * Generated class for the CadastroSetorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-setor',
  templateUrl: 'cadastro-setor.html',
})
export class CadastroSetorPage {

  setor:Setor;
  nomeBotaoSalvar: string;
  nomePagina: string;

  constructor(
                public navCtrl: NavController,
                public navParams: NavParams,
                private setoreService: SetorService,
                private viewCtrl: ViewController,
                private toaster: Toaster
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroSetorPage');
  }

  ngOnInit(){
    this.setor = this.navParams.get('setor')? this.navParams.get('setor') : {};
    this.nomeBotaoSalvar = this.navParams.get('setor')? 'Salvar Setor' : 'Adicionar Setor';
    this.nomePagina = this.navParams.get('setor')? 'Editar' : 'Cadastrar';
  }

  registrarSetor(setor: Setor) {
    setor.key = this.setor.key;
    this.setoreService.save(setor);

    //TO-DO Abrir página de avaliação em andamento
    this.fecharPágina();

    this.toaster.mostrarToast(this.navParams.get('setor')? "Setor "+this.setor.nome+" editado." : "Setor "+this.setor.nome+" adicionado.");
  }

  fecharPágina(){
    this.viewCtrl.dismiss();
  }
}
