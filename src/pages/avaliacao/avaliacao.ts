import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Setor} from "../../data/setorInterface";
import {AngularFireObject} from "angularfire2/database";
import {Avaliacao} from "../../data/avaliacaoInterface";
import {Subscription} from "rxjs/Subscription";
import {AvaliacaoCriteriosPage} from "../avaliacao-criterios/avaliacao-criterios";
import {Nivel} from "../../data/nivelInterface";
import {SetorService} from "../../services/setor";
import {AvaliacaoService} from "../../services/avaliacao";


/**
 * Generated class for the AvaliacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-avaliacao',
  templateUrl: 'avaliacao.html',
})

export class AvaliacaoPage {

  avaliacao$: Observable<Avaliacao>;
  setor: Setor;
  avaliacaoRef: AngularFireObject<Avaliacao>;
  objAvaliacao: Avaliacao;
  niveis: Nivel[];
  avaliacaoSubscription: Subscription;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private setorService: SetorService,
              private viewCtrl: ViewController,
              private toastCtrl: ToastController,
              private avaliacaoService: AvaliacaoService
              ) {

    this.setor = this.navParams.get('setor');
    this.avaliacaoRef = {...this.navParams.get('avaliacao')}; // cópia

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AvaliacaoPage');
  }

  ngOnInit(){
    this.avaliacao$ = this.avaliacaoRef.snapshotChanges().map(c => ({key: c.payload.key, ...c.payload.val(),}));

    this.avaliacaoSubscription = this.avaliacao$.subscribe((data) => {
      this.objAvaliacao = data;

      this.niveis = [];
      Object.keys(this.objAvaliacao.corpo).forEach((keyNivel) =>{
        this.objAvaliacao.corpo[keyNivel].key = keyNivel;
        this.niveis.push(this.objAvaliacao.corpo[keyNivel]);
      })

      });
  }

  abrirCriterios(nivel) {
    //Abrir página do nível com os critérios
    let refNivel = 'avaliacoes'+'/'+this.setor.key+'/'+this.objAvaliacao.key+'/'+'corpo'+'/'+nivel.key;
    this.navCtrl.push(AvaliacaoCriteriosPage,{nivel: nivel, refNivel: refNivel});
  }

  finalizarAvaliacaoClick() {

    let nivelAtingido = this.getNivelAtingidoAutomaticamente();

      let alert = this.alertCtrl.create({
        title: 'Finalizar avaliação',
        message: 'Deseja finalizar avaliação do setor? o nível atingido será: '+nivelAtingido,
        buttons: [
          {
            text: 'Finalizar',
            handler: () => {
              this.finalizarAvaliacao(nivelAtingido);
              console.log('Avaliação do setor '+this.setor.sigla+' finalizada.');
            }
          },
          {
            text: 'Nível Manual',
            handler: () => {
              this.setarNivelManualmente();
              console.log('Avaliação do setor '+this.setor.sigla+' finalizada.');
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {}
          }
        ]
      });
      alert.present();
  }

  finalizarAvaliacao(nivelAtingido: string) {

    this.objAvaliacao.nivelAtingido = nivelAtingido;
    this.objAvaliacao.dataFim = this.avaliacaoService.getDataAgora();
    this.avaliacaoService.save(this.objAvaliacao);

    this.setor.sendoAvaliado = false;
    this.setor.nivel = nivelAtingido;
    this.setorService.save(this.setor);
    this.fecharPagina();
    this.mostrarToastAvaliacaoFinalizada();
  }

  fecharPagina(){
    this.viewCtrl.dismiss();
  }


  mostrarToastAvaliacaoFinalizada() {
    let toast = this.toastCtrl.create({
      message: 'Avaliação do setor '+this.setor.sigla+' finalizada.',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  private getNivelAtingidoAutomaticamente() {

    //TODO Buscar nível

    let nivelAtingido;
    let flagNivelNaoVerde = false;


    this.objAvaliacao.corpo = Object.keys( this.objAvaliacao.corpo).map(i => {
      let value = this.objAvaliacao.corpo[i];
      value.key = i;
      return value;
    });

    this.objAvaliacao.corpo.forEach(nivel => {
      if(!flagNivelNaoVerde && this.avaliacaoService.getCorNivel(nivel) === 'avaliacaoVerde') nivelAtingido = nivel.nome;
      else flagNivelNaoVerde = true;
    });

    if(nivelAtingido) return nivelAtingido;
    else return this.objAvaliacao.corpo[0].nome;

  }

  private setarNivelManualmente() {

    let nivelAvaliado;

    let alert = this.alertCtrl.create();
    alert.setTitle('Nível Manual');

    this.objAvaliacao.corpo = Object.keys( this.objAvaliacao.corpo).map(i => {
      let value = this.objAvaliacao.corpo[i];
      value.key = i;
      return value;
    });

    this.objAvaliacao.corpo.forEach(nivel => {
      alert.addInput({
        type: 'radio',
        label: nivel.nome,
        value: nivel.nome
      });
    });

    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Confirmar',
      handler: (data: string) => {
        nivelAvaliado = data;
        this.finalizarAvaliacao(nivelAvaliado);
      }
    });

    alert.present();
  }
}
