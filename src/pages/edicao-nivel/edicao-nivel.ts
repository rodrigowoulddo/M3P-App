import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, reorderArray} from 'ionic-angular';
import {Nivel} from "../../data/nivelInterface";
import {Criterio} from "../../data/criterioInterface";
import {EdicaoCriterioPage} from "../edicao-criterio/edicao-criterio";

/**
 * Generated class for the EdicaoNivelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edicao-nivel',
  templateUrl: 'edicao-nivel.html',
})
export class EdicaoNivelPage {

  nivel: Nivel;
  editableOn: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private changeRef: ChangeDetectorRef, private alertCtrl: AlertController) {

    this.nivel = navParams.get('nivel');
    this.nivel.criterios = (<any>Object).values(this.nivel.criterios);
    console.log(this.nivel)

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EdicaoNivelPage');
  }

  reorderItems(indexes) {
    this.nivel.criterios = reorderArray(this.nivel.criterios, indexes);
  }

  salvarCriterios(){
    console.log('salvar criterios');
  }

  irParaEdicaoDeCriterio(criterio: Criterio){

    this.navCtrl.push(EdicaoCriterioPage, {criterio: criterio});

  }

  toggleEditable(){
    this.editableOn = !this.editableOn;
    this.changeRef.detectChanges()
  }

  removerCriterio(criterio: Criterio){

    let alert = this.alertCtrl.create({
      title: 'Excluir Critério?',
      message: 'Você quer excluir este critério?',
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

            const index: number = this.nivel.criterios.indexOf(criterio);
            if (index !== -1) {
              this.nivel.criterios.splice(index, 1);
            }

          }
        }
      ]
    });

    alert.present();
  }

  adicionar(){
    let novoCriterio: Criterio = {nome: 'Novo Critério', descricao:'', itensDeAvaliacao: []};
    this.nivel.criterios.push(novoCriterio);
    this.changeRef.detectChanges();
  }

}
