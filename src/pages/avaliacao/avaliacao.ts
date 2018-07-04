import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Setor} from "../../data/setorInterface";
import {AngularFireObject} from "angularfire2/database";
import {Avaliacao} from "../../data/avaliacaoInterface";
import {Subscription} from "rxjs/Subscription";
import {AvaliacaoCriteriosPage} from "../avaliacao-criterios/avaliacao-criterios";
import {Nivel} from "../../data/nivelInterface";


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


  constructor(public navCtrl: NavController, public navParams: NavParams) {

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

  ionViewWillLeave(){
     //this.avaliacaoSubscription.unsubscribe();
  }


  abrirCriterios(nivel) {
    //Abrir página do nível com os critérios
    this.navCtrl.push(AvaliacaoCriteriosPage,{nivel: nivel, refNivel:'avaliacoes'+'/'+this.setor.key+'/'+this.objAvaliacao.key+'/'+'corpo'+'/'+nivel.key});
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
              cor = 'amarelo';
            }
          } else{
            cor = 'cinza'; return;
          }
        });
      });
      //                  Referência de variable.scss > $colors
      if(cor === 'vermelho')  {return 'avaliacaoVermelho';}
      if(cor === 'amarelo')   {return 'avaliacaoAmarelo';}
      if(cor === 'verde')     {return 'avaliacaoVerde';}
      if (cor === 'cinza')    {return 'avaliacaoCinza';}
    } else{
      return 'avaliacaoCinza' //Cinza ()
    }


  }
}
