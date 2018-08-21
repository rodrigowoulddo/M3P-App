import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Nivel} from "../../data/nivelInterface";
import {Criterio} from "../../data/criterioInterface";
import {AvaliacaoItensAnteriorPage} from "../avaliacao-itens-anterior/avaliacao-itens-anterior";
import {AvaliacaoService} from "../../services/avaliacao";

/**
 * Generated class for the AvaliacaoCriteriosAnteriorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao-criterios-anterior',
  templateUrl: 'avaliacao-criterios-anterior.html',
})
export class AvaliacaoCriteriosAnteriorPage {

  nivel: Nivel;

  constructor(public navCtrl: NavController, public navParams: NavParams, public avaliacaoService: AvaliacaoService) {

    this.nivel = navParams.get('nivel');

    console.log(this.nivel);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaliacaoCriteriosAnteriorPage');
  }


  abrirItensDeAvaliacao(criterio: Criterio){
    this.navCtrl.push(AvaliacaoItensAnteriorPage, {criterio:criterio});
  }
}
