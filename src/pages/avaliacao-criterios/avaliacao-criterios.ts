import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Nivel} from "../../data/nivelInterface";
import {Observable} from "rxjs/Observable";
import {Criterio} from "../../data/criterioInterface";
import {map} from "rxjs/operators";
import {AvaliacaoService} from "../../services/avaliacao";
import {AvaliacaoItensPage} from "../avaliacao-itens/avaliacao-itens";
import {NivelService} from "../../services/nivel";
import {Subscription} from "rxjs/Subscription";

/**
 * Generated class for the AvaliacaoCriteriosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-avaliacao-criterios',
  templateUrl: 'avaliacao-criterios.html',
})
export class AvaliacaoCriteriosPage {

  nivel: Nivel;
  nivel$: Observable<Nivel>;
  criterios$ : Observable<Criterio[]>;
  refNivel: string;
  nivelSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, private avaliacaoService: AvaliacaoService) {


    this.refNivel = this.navParams.get('refNivel');
    this.nivel = this.navParams.get('nivel');

    this.nivel$ = this.avaliacaoService.getNivel(this.refNivel).snapshotChanges().map(c => ({key: c.payload.key, ...c.payload.val(),}));
    this.nivelSubscription = this.nivel$.subscribe((data) => {
      this.nivel = data;

      //DEBUG
      console.log('NIVEL ATUALIZADO:');
      console.log(data);
    });

    this.criterios$ = this.avaliacaoService
      .getCriterios(this.refNivel+'/'+'criterios')
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
    console.log('ionViewDidLoad AvaliacaoCriteriosPage');
  }

  abrirItensDeAvaliacao(criterio: Criterio) {
    let refCriterio = this.refNivel+'/'+'criterios'+'/'+criterio.key;
    this.navCtrl.push(AvaliacaoItensPage,{criterio: criterio, refCriterio: refCriterio});

  }

  getCor(criterio) {

    //Verifica set manual
    if(criterio.avaliacaoManual !== undefined){
      if(criterio.avaliacaoManual == 'verde') return 'avaliacaoVerde';
      if(criterio.avaliacaoManual == 'amarelo') return 'avaliacaoAmarelo';
      if(criterio.avaliacaoManual == 'vermelho') return 'avaliacaoVermelho';
    }

    if (criterio.itensDeAvaliacao) {
      let cor = 'verde';

      criterio.itensDeAvaliacao = Object.keys( criterio.itensDeAvaliacao).map(i => {
        let value = criterio.itensDeAvaliacao[i];
        value.key = i;
        return value;
      });

        criterio.itensDeAvaliacao.forEach((itemAvaliacao, index) => {
          if(itemAvaliacao.avaliacao){
            if (itemAvaliacao.avaliacao === 'vermelho') {
              cor = 'vermelho'; return;
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
      //                  Referência de variable.scss > $colors
      if (cor === 'vermelho') {
        return 'avaliacaoVermelho';
      }
      if (cor === 'amarelo') {
        return 'avaliacaoAmarelo';
      }
      if (cor === 'verde') {
        return 'avaliacaoVerde';
      }
      if (cor === 'cinza') {
        return 'avaliacaoCinza';
      }
      }
    else {
      return 'avaliacaoCinza' //Cinza ()
    }

  }


  avaliarNivelManual(cor: string) {
    this.nivel.avaliacaoManual = (cor !== 'cinza')? cor : null;
    this.avaliacaoService.saveNivelAvaliacao(this.nivel, this.refNivel);
  }
}
