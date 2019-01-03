import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import {Setor} from "../../data/setorInterface";
import {CadastroSetorPage} from "../cadastro-setor/cadastro-setor";
import {SetorService} from "../../services/setor";
import {AvaliacaoPage} from "../avaliacao/avaliacao";
import {PreAvaliacaoPage} from "../pre-avaliacao/pre-avaliacao";
import {AvaliacaoService} from "../../services/avaliacao";
import {Observable} from "rxjs/Observable";
import {Avaliacao} from "../../data/avaliacaoInterface";
import {map} from "rxjs/operators";
import {AvaliacaoAnteriorPage} from "../avaliacao-anterior/avaliacao-anterior";

/**
 * Generated class for the SetorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setor',
  templateUrl: 'setor.html',
})
export class SetorPage {

  setor:Setor;
  historico$ : Observable<Avaliacao[]>;
  mostrarHistoricoCompleto: boolean;
  btnVerMaisMenosContent: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private setorService: SetorService,
              private avaliacaoService: AvaliacaoService,
              private viewCtrl: ViewController
  ) {

    //Startar botão 'ver mais / menos'
    this.mostrarHistoricoCompleto = false;
    this.btnVerMaisMenosContent = "Ver Mais";

    this.setor = this.navParams.get('setor');

    this.historico$ = this.avaliacaoService
      .getRef3UltimasAvaliacoes(this.setor.key) //DB LIST
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
    console.log('ionViewDidLoad SetorPage');
  }

  ngOnInit(){
  }

  editarSetor() {
    this.navCtrl.push(CadastroSetorPage, {setor: this.setor});
  }

  excluirSetor() {

    //Alert de confirmação
      const confirm = this.alertCtrl.create({
        title: 'Excluir Setor',
        message: 'Ao excluir um setor todos seus dados e histórico de avaliações serão excluídos. Deseja Continuar?',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {}
          },
          {
            text: 'Excluir',
            handler: () => {
              this.setorService.delete(this.setor);
              this.fecharPágina();
            }
          }
        ]
      });
      confirm.present();
    }

  fecharPágina(){
    this.viewCtrl.dismiss();
  }

  avaliarSetor() {

    if(!this.setor.sendoAvaliado){
      this.navCtrl.push(PreAvaliacaoPage, {setor: this.setor});
    }else{
      this.avaliacaoService.getAvaliacaoMaisRecente(this.setor.key, this.abrirPaginaAvaliacao, this);
    }
  }

  abrirPaginaAvaliacao(refAvaliacaoCorrente, self){

    self.navCtrl.push(
                      AvaliacaoPage,
                            {
                                      setor: self.setor,
                                      avaliacao: refAvaliacaoCorrente
                                    });
  }

  verMaisMenosClick() {
    if (!this.mostrarHistoricoCompleto){
      this.btnVerMaisMenosContent = "Ver Menos";
      this.mostrarHistoricoCompleto = true;
    } else{
      this.btnVerMaisMenosContent = "Ver Mais";
      this.mostrarHistoricoCompleto = false;
    }
  }

  iniciarAvaliacaoComplementarClick(avaliacao: Avaliacao) {

    //Alert de confirmação
    const confirm = this.alertCtrl.create({
      title: 'Avaliação Complementar',
      message: 'Deseja retomar a avaliação do setor?',
      buttons: [
        {
          text: 'Retomar',
          handler: () => {
            this.iniciarAvaliacaoComplementar(avaliacao);
          }
        },
        {
          text: 'Cancelar',
          handler: () => {}
        }
      ]
    });
    confirm.present();
  }

  iniciarAvaliacaoComplementar(avaliacao: Avaliacao){

    this.setor.sendoAvaliado = true;
    avaliacao.dataInicioAvaliacaoComplementar = this.avaliacaoService.getDataAgora();

    this.setorService.save(this.setor);
    this.avaliacaoService.save(avaliacao);


    this.avaliarSetor();

  }

  verAvaliacaoAnterior(avaliacao: Avaliacao) {
    this.navCtrl.push(AvaliacaoAnteriorPage, {avaliacao: avaliacao, setor:this.setor});
  }
}
