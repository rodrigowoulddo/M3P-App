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


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private setorService: SetorService, private viewCtrl: ViewController, private toastCtrl: ToastController) {

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

      //DEBUG
      console.log('AVALIACAO ATUALIZADA:');
      console.log(data);


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

  getCor(nivel) {

    if(nivel.criterios){

      nivel.criterios = Object.keys( nivel.criterios).map(i => {
        let value = nivel.criterios[i];
        value.key = i;
        return value;
      });

      let cor = 'verde';
      nivel.criterios.forEach((criterio, index) => {

        criterio.itensDeAvaliacao = Object.keys( criterio.itensDeAvaliacao).map(i => {
          let value = criterio.itensDeAvaliacao[i];
          value.key = i;
          return value;
        });


        criterio.itensDeAvaliacao.forEach((itemAvaliacao, index) => {
          if(itemAvaliacao.avaliacao){
            if (itemAvaliacao.avaliacao === 'vermelho') {
              cor = 'vermelho';
              return;
            }
            if (itemAvaliacao.avaliacao === 'amarelo') {
              if(cor !== 'vermelho')
                cor = 'amarelo';

              return;
            }
          } else{
            cor = 'cinza'; return;
          }
        });
      });
      //                       Referência de variable.scss > $colors
      if (cor === 'vermelho')  {return 'avaliacaoVermelho';}
      if (cor === 'amarelo')   {return 'avaliacaoAmarelo';}
      if (cor === 'verde')     {return 'avaliacaoVerde';}
      if (cor === 'cinza')     {return 'avaliacaoCinza';}
    } else{
      return 'avaliacaoCinza' //Cinza ()
    }


  }

  finalizarAvaliacaoClick() {
      let alert = this.alertCtrl.create({
        title: 'Finalizar avaliação',
        message: 'Deseja finalizar avaliação do setor? o nível atingido será: [nivel]',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Finalizar',
            handler: () => {
              this.finalizarAvaliacao()
              console.log('Avaliação do setor '+this.setor.sigla+' finalizada.');
            }
          }
        ]
      });
      alert.present();
  }

  finalizarAvaliacao() {
    this.setor.sendoAvaliado = false;
    this.setorService.save(this.setor);
    this.fecharPágina();
    this.mostrarToastAvaliacaoFinalizada();
  }

  fecharPágina(){
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
}
