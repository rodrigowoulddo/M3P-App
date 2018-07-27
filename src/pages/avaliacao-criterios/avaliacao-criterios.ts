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
import {AngularFireAuth} from "angularfire2/auth";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private avaliacaoService: AvaliacaoService, private angularFireAuth: AngularFireAuth) {


    this.refNivel = this.navParams.get('refNivel');
    this.nivel = this.navParams.get('nivel');

    //DEBUG
    console.log(this.nivel);

    console.log(this.refNivel);

    this.nivel$ = this.avaliacaoService.getNivel(this.refNivel).snapshotChanges().map(c => ({key: c.payload.key, ...c.payload.val(),}));
    this.nivelSubscription = this.nivel$.subscribe((data) => {
      this.nivel = data;

      if(this.avaliacaoService.getCorNivelAutomatico(this.nivel) !== 'avaliacaoAmarelo'){
        this.resetarAvaliacaoManualDeNivel();
      }

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

  avaliarNivelManual(cor: string) {
    this.nivel.avaliacaoManual = (cor !== 'cinza')? cor : null;
    this.nivel.usuarioAvaliacaoManual = this.angularFireAuth.auth.currentUser.email;
    this.avaliacaoService.saveNivelAvaliacao(this.nivel, this.refNivel);
  }

  resetarAvaliacaoManualDeNivel() {
    this.nivel.avaliacaoManual = null;
    this.avaliacaoService.saveAvaliacaoManualCriterio(null, this.refNivel);
  }
}
