import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, reorderArray} from 'ionic-angular';
import {Criterio} from "../../data/criterioInterface";
import {ItemDeAvaliacao} from "../../data/itemDeAvaliacaoInterface";

/**
 * Generated class for the EdicaoCriterioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edicao-criterio',
  templateUrl: 'edicao-criterio.html',
})
export class EdicaoCriterioPage {

  criterio: Criterio;
  editableOn: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private changeRef: ChangeDetectorRef, private alertCtrl: AlertController) {

    this.criterio = navParams.get('criterio');
    if (!this.criterio.itensDeAvaliacao) this.criterio.itensDeAvaliacao = [];
    this.criterio.itensDeAvaliacao = (<any>Object).values(this.criterio.itensDeAvaliacao);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EdicaoCriterioPage');
  }

  reorderItems(indexes) {
    this.criterio.itensDeAvaliacao = reorderArray(this.criterio.itensDeAvaliacao, indexes);
  }

  salvarItensDeAvaliacao(){
    console.log('salvar itens');
  }

  toggleEditable(){
    this.editableOn = !this.editableOn;
    this.changeRef.detectChanges()
  }

  removeItem(item: ItemDeAvaliacao){

    let alert = this.alertCtrl.create({
      title: 'Excluir Item?',
      message: 'Você quer excluir este item de avaliação?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Excluir',
          handler: () => {

            const index: number = this.criterio.itensDeAvaliacao.indexOf(item);
            if (index !== -1) {
              this.criterio.itensDeAvaliacao.splice(index, 1);
            }

          }
        }
      ]
    });

    alert.present();
  }

  adicionar(){
    let novoItem: ItemDeAvaliacao = {descricao:'', ordem: 1};
    this.criterio.itensDeAvaliacao.push(novoItem);
    this.changeRef.detectChanges();
  }

}
