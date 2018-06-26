import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {NivelService} from "../../services/nivel";
import {Nivel} from "../../data/nivelInterface";
import {Setor} from "../../data/setorInterface";
import {Observable} from "rxjs/index";
import {map} from "rxjs/operators";
import {Avaliacao} from "../../data/avaliacaoInterface";
import {AvaliacaoService} from "../../services/avaliacao";

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
              private avaliacaoService: AvaliacaoService
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

    console.log(this.niveis$);

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
      // corpo: this.transformarNiveisEmArray(this.niveis$)
      corpo: []
    };

    // this.avaliacaoService.save(avaliacao);
    console.log(avaliacao);
    this.setor.sendoAvaliado = true;
  }

  async transformarNiveisEmArray(niveis$: Observable<Nivel[]>){
    // let niveis : Nivel[];
    // niveis = [];

    // this.niveis$.forEach(function(nivel){
    //   console.log(nivel);
    //   niveis.concat(nivel);
    // }).then(v => {return niveis});

  }
}
