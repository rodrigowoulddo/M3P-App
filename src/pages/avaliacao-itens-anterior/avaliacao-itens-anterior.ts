import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Criterio} from "../../data/criterioInterface";
import {AvaliacaoService} from "../../services/avaliacao";

/**
 * Generated class for the AvaliacaoItensAnteriorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao-itens-anterior',
  templateUrl: 'avaliacao-itens-anterior.html',
})
export class AvaliacaoItensAnteriorPage {

  criterio: Criterio;
  avaliadoresVisiveis: boolean[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public avaliacaoService: AvaliacaoService) {

    this.criterio = navParams.get('criterio');
    this.avaliadoresVisiveis = [];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaliacaoItensAnteriorPage');
  }

  alterarAvaliadoresVisiveis(i) {
    if(this.avaliadoresVisiveis[i]){
      this.avaliadoresVisiveis[i] = !this.avaliadoresVisiveis[i];
    }else
      this.avaliadoresVisiveis[i] = true;
  }
}
