import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Criterio} from "../../data/criterioInterface";
import {Observable} from "rxjs/Observable";
import {ItemDeAvaliacao} from "../../data/itemDeAvaliacaoInterface";
import {map} from "rxjs/operators";
import {AvaliacaoService} from "../../services/avaliacao";

/**
 * Generated class for the AvaliacaoItensPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao-itens',
  templateUrl: 'avaliacao-itens.html',
})
export class AvaliacaoItensPage {

  refCriterio: string;
  criterio: Criterio;
  itensDeAvaliacao$: Observable<ItemDeAvaliacao[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public avaliacaoService: AvaliacaoService) {

    this.refCriterio = this.navParams.get('refCriterio');
    this.criterio = this.navParams.get('criterio');

    //DEBUG
    console.log(this.refCriterio);
    console.log(this.criterio);

    this.itensDeAvaliacao$ = this.avaliacaoService
      .getItensDeAvaliacao(this.refCriterio+'/'+'itensDeAvaliacao')
      .snapshotChanges()// KEY AND VALUE
      .pipe(map(
        changes => {
          return changes.map(c => ({
            key: c.payload.key, ...c.payload.val(),
          }));
        }
      ));


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaliacaoItensPage');
  }

  avaliarComo(item: ItemDeAvaliacao, avaliacao: string) {
    item.avaliacao = avaliacao;
    this.avaliacaoService.saveItem(item, this.refCriterio)
  }
}
