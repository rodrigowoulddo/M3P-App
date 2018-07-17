import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Criterio} from "../../data/criterioInterface";
import {Observable} from "rxjs/Observable";
import {ItemDeAvaliacao} from "../../data/itemDeAvaliacaoInterface";
import {map} from "rxjs/operators";
import {AvaliacaoService} from "../../services/avaliacao";
import {Subscription} from "rxjs/Subscription";

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
  criterio$: Observable<Criterio>;
  criterioSubscription: Subscription;
  criterio: Criterio;
  itensDeAvaliacao$: Observable<ItemDeAvaliacao[]>;
  itensDeAvaliacao: ItemDeAvaliacao[];
  itensSubscription: Subscription;
  observacaoVisible; // array
  observacaoConforme; //array


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public avaliacaoService: AvaliacaoService,
              private toastCtrl: ToastController) {

    this.refCriterio = this.navParams.get('refCriterio');
    this.criterio = this.navParams.get('criterio');
    this.observacaoVisible = [];
    this.observacaoConforme = [];

    this.criterio$ = this.avaliacaoService.getCriterio(this.refCriterio).snapshotChanges().map(c => ({key: c.payload.key, ...c.payload.val(),}));

    this.criterioSubscription = this.criterio$.subscribe((data) => {
      this.criterio = data;

      if(this.avaliacaoService.getCorCriterioAutomatico(this.criterio) !== 'avaliacaoAmarelo'){
        this.resetarAvaliacaoManualDeCriterio();
      }

    });

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

    this.itensSubscription = this.itensDeAvaliacao$.subscribe((data) =>{
      this.itensDeAvaliacao = data;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaliacaoItensPage');
  }

  avaliarComo(item: ItemDeAvaliacao, avaliacao: string) {
    item.avaliacao = avaliacao;
    this.avaliacaoService.saveAvaliacaoItem(item, this.refCriterio+'/'+'itensDeAvaliacao');
  }

  alterarVisualizacaoObservacao(item, i) {


    if(this.observacaoVisible[i] !== undefined)
      this.observacaoVisible[i] = !this.observacaoVisible[i];
    else{
      this.observacaoVisible[i] = true;
    }
  }

  salvarObservacao(item, observacao: string, index) {

    if(observacao === ""){observacao = null; item.observacaoVisible = false}
    item.observacao = observacao;
    this.avaliacaoService.saveItem(item, this.refCriterio+'/'+'itensDeAvaliacao');

    /*
    Fecha campos de observação
    caso observação seja vazia
    */
    if(!observacao)
      this.observacaoVisible[index] = false;

    this.mostrarToastObservacaoSalva();


  }

  disableBotaoOpenCloseObservacao(i) {
    this.observacaoConforme[i] = false;
  }

  enableBotaoOpenCloseObservacao(i) {
    this.observacaoConforme[i] = true;
  }

  mostrarObservacao(item, i) {

    if(item == undefined) return;

    if(this.observacaoVisible[i] !== undefined)
      return this.observacaoVisible[i];
    else
      return false;
  }

  mostrarToastObservacaoSalva() {
    let toast = this.toastCtrl.create({
      message: 'Observação Salva.',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  avaliarCriterioManual(cor: string) {

    this.criterio.avaliacaoManual = (cor !== 'cinza')? cor : null;
    this.avaliacaoService.saveCriterioAvaliacao(this.criterio, this.refCriterio);

  }

  resetarAvaliacaoManualDeCriterio() {
    this.criterio.avaliacaoManual = null;
    this.avaliacaoService.saveAvaliacaoManualCriterio(null, this.refCriterio);
  }

  getIconeShowObservacao(item: ItemDeAvaliacao, index) {

    if(item.observacao) //iconse cheios
      return this.observacaoVisible[index]? 'ios-arrow-dropup-circle':'ios-arrow-dropdown-circle';
    else               //icones outline
      return this.observacaoVisible[index]? 'ios-arrow-dropup':'ios-arrow-dropdown';

  }
}
