import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Nivel} from "../../data/nivelInterface";
import {Observable} from "rxjs/index";
import {map} from "rxjs/operators";
import {NivelService} from "../../services/nivel";

/**
 * Generated class for the NiveisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-niveis',
  templateUrl: 'niveis.html',
})
export class NiveisPage {

  niveis$: Observable<Nivel[]>;
  niveis: Nivel[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private nivelService: NivelService) {

    // ainda não mostra os niveis na tela
  this.nivelService.
  getAllAsArray(
    this
  );
  }

  reorderItems(indexes) {
    // let nivel = this.niveis[indexes.from];
    // this.niveis.splice(indexes.from, 1);
    // this.niveis.splice(indexes.to, 0, nivel);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NiveisPage');
  }

}
