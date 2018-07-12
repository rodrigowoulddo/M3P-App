import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {NivelService} from "../../services/nivel";
import {Nivel} from "../../data/nivelInterface";
import {Setor} from "../../data/setorInterface";
import {Observable} from "rxjs/index";
import {map} from "rxjs/operators";
import {Avaliacao} from "../../data/avaliacaoInterface";
import {AvaliacaoService} from "../../services/avaliacao";
import {SetorService} from "../../services/setor";
import {AvaliacaoPage} from "../avaliacao/avaliacao";

/**
 * Generated class for the PreAvaliacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pre-avaliacao',
  templateUrl: 'pre-avaliacao.html',
})
export class PreAvaliacaoPage {

  niveis$: Observable<Nivel[]>;
  nivelPretendido: string;
  setor: Setor;

  constructor(
              public navCtrl: NavController,
              public navParams: NavParams,
              private nivelService: NivelService,
              private avaliacaoService: AvaliacaoService,
              private setorService: SetorService,
              private viewCtrl: ViewController
  ) {

    //Debug
    this.niveis$ = this.nivelService
      .getAll() //DB LIST
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
    console.log('ionViewDidLoad PreAvaliacaoPage');
  }

  ngOnInit(){
    this.setor = this.navParams.get('setor');
  }

  iniciarAvaliacao() {

    let avaliacao: Avaliacao = {
      setor: this.setor.key,
      dataInicio: this.avaliacaoService.getDataAgora(),
      nivelPretendido: this.nivelPretendido,
      corpo: []
    };

    this.salvaNovaAvaliacao(avaliacao, this.insereNovaAvaliacao);
  }



  salvaNovaAvaliacao(avaliacao: Avaliacao, insereNovaAvaliacao){

    let niveis: Nivel[];
    niveis = [];

    this.niveis$.forEach( nivel_array =>{
      nivel_array.forEach(nivel => {
        niveis.push(nivel);
      })
    });

    avaliacao.corpo = niveis;

    insereNovaAvaliacao(avaliacao, this);

    this.avaliacaoService.getAvaliacaoMaisRecente(this.setor.key, this.abrirPaginaAvaliacao, this);

    this.fecharPágina();

  }

  insereNovaAvaliacao(avaliacao: Avaliacao, self){
    self.avaliacaoService.save(avaliacao);
    self.setor.sendoAvaliado = true;
    self.setorService.save(self.setor);
  }

  fecharPágina(){
    this.viewCtrl.dismiss();
  }

  abrirPaginaAvaliacao(refAvaliacaoCorrente, self){

    self.navCtrl.push(
      AvaliacaoPage,
      {
        setor: self.setor,
        avaliacao: refAvaliacaoCorrente
      });
  }
}
