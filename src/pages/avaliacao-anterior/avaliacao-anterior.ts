import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Avaliacao} from "../../data/avaliacaoInterface";
import {Setor} from "../../data/setorInterface";
import {Nivel} from "../../data/nivelInterface";
import {AvaliacaoCriteriosAnteriorPage} from "../avaliacao-criterios-anterior/avaliacao-criterios-anterior";
import {AvaliacaoService} from "../../services/avaliacao";

/**
 * Generated class for the AvaliacaoAnteriorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao-anterior',
  templateUrl: 'avaliacao-anterior.html',
})
export class AvaliacaoAnteriorPage {

  avaliacao: Avaliacao;
  setor: Setor;
  corpo: Nivel[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public avaliacaoService: AvaliacaoService) {

    this.avaliacao = navParams.get('avaliacao');
    this.setor = navParams.get('setor');

    //DEBUG
    console.log('corpo avaliação (antes)');
    console.log(this.avaliacao.corpo);

    this.corpo = [];
    Object.keys(this.avaliacao.corpo).forEach(keyNivel => {
      this.corpo.push(this.avaliacao.corpo[keyNivel]);
    });

    //DEBUG
    console.log('corpo avaliação (depois)');
    console.log(this.corpo);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaliacaoAnteriorPage');
  }


  abrirCriterios(nivel: Nivel){
    this.navCtrl.push(AvaliacaoCriteriosAnteriorPage, {nivel:nivel});
  }

  getUrlImagemNivel(nivel) {
    return 'http://nqi.ufcspa.edu.br/wiki/selos-niveis/'+nivel+'.png';
  }
}
