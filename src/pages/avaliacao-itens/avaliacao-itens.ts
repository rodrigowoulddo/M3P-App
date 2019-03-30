import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {Criterio} from "../../data/criterioInterface";
import {Observable} from "rxjs/Observable";
import {ItemDeAvaliacao} from "../../data/itemDeAvaliacaoInterface";
import {map} from "rxjs/operators";
import {AvaliacaoService} from "../../services/avaliacao";
import {Subscription} from "rxjs/Subscription";
import {AngularFireAuth} from "angularfire2/auth";

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
  triggerObservacaoNaoSalva: string[];



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public avaliacaoService: AvaliacaoService,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private angularFireAuth: AngularFireAuth) {

    this.refCriterio = this.navParams.get('refCriterio');
    this.criterio = this.navParams.get('criterio');
    this.observacaoVisible = [];
    this.observacaoConforme = [];
    this.triggerObservacaoNaoSalva = [];

    this.criterio$ = this.avaliacaoService.getCriterio(this.refCriterio).snapshotChanges().map(c => ({key: c.payload.key, ...c.payload.val(),}));

    this.criterioSubscription = this.criterio$.subscribe((data) => {
      this.criterio = data;

      if(!this.avaliacaoService.newMostrarCardAvaliacaoManualCriterio(this.criterio)){
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

      if(this.itensDeAvaliacao != null){

          for (let i = 0; i < data.length; i++) {

            //Caso uma observação tenha sido escrita e não salva ela não é apagada

            if(this.triggerObservacaoNaoSalva[i] || this.triggerObservacaoNaoSalva[i]==""){

                //let observacaoNaoSalva = this.itensDeAvaliacao[i].observacao;
                this.itensDeAvaliacao[i] = data[i];
                console.log('Observação nao salva no item'+(i+1)+':',this.triggerObservacaoNaoSalva[i]);
                this.itensDeAvaliacao[i].observacao = this.triggerObservacaoNaoSalva[i];
                //this.itensDeAvaliacao[i].observacao = observacaoNaoSalva;

              }else
                this.itensDeAvaliacao = data;
          }
      }
      else
        this.itensDeAvaliacao = data;

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaliacaoItensPage');
  }

  ionViewWillLeave(){
    if(this.itensSubscription)
      this.itensSubscription.unsubscribe();

    if(this.criterioSubscription)
      this.criterioSubscription.unsubscribe();
  }


  avaliarComo(item: ItemDeAvaliacao, avaliacao: string) {
    item.avaliacao = avaliacao;
    item.usuarioAvaliacao = this.angularFireAuth.auth.currentUser.email;

    //DEBUG
    console.log('Avaliado Por: '+ this.angularFireAuth.auth.currentUser.email);

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
    item.usuarioObservacao = this.angularFireAuth.auth.currentUser.email;
    this.avaliacaoService.saveItem(item, this.refCriterio+'/'+'itensDeAvaliacao');

    /*
    Fecha campos de observação
    caso observação seja vazia
    */
    if(!observacao)
      this.observacaoVisible[index] = false;

    this.triggerObservacaoNaoSalva[index] = null;
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
    this.criterio.usuarioAvaliacaoManual = this.angularFireAuth.auth.currentUser.email;
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

  backClick() {

    if(this.checkObservacoesInseridas())
      this.navCtrl.pop();
    else {
      console.log('Faltam observações');


        let alert = this.alertCtrl.create({
          title: 'Observações',
          message: 'É obrigatória a inserção de observações em itens avaliados como Amarelo ou Vermelho, não será possível finalizar a avaliação com observações pendentes.',
          buttons: [
            {
              text: 'Voltar mesmo assim',
              handler: () => {
                this.navCtrl.pop();
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel'
            },
          ]
        });
        alert.present();
    }
  }

  checkObservacoesInseridas(){

    let flagEmOrdem = true;

    this.criterio.itensDeAvaliacao.forEach(item => {

      if((item.avaliacao !== 'verde' && item.avaliacao !== undefined) && item.observacao === undefined){
        flagEmOrdem = false;
        return;
      }
    });

    return flagEmOrdem;
  }

  observacaoOnChange(observacao: string,i: any) {
    this.triggerObservacaoNaoSalva[i] = observacao;
  }
}
