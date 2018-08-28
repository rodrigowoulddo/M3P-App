import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  ToastController,
  ViewController
} from 'ionic-angular';
import {Observable} from "rxjs/Observable";
import {Setor} from "../../data/setorInterface";
import {AngularFireObject} from "angularfire2/database";
import {Avaliacao} from "../../data/avaliacaoInterface";
import {Subscription} from "rxjs/Subscription";
import {AvaliacaoCriteriosPage} from "../avaliacao-criterios/avaliacao-criterios";
import {Nivel} from "../../data/nivelInterface";
import {SetorService} from "../../services/setor";
import {AvaliacaoService} from "../../services/avaliacao";
import {ModalObservacoesPage} from "../modal-observacoes/modal-observacoes";


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
              private avaliacaoService: AvaliacaoService,
              private modalCtrl: ModalController
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

    let todosItensAvaliados = this.verificarTodosItensAvaliados();

    if(todosItensAvaliados){
      let observacoesConformidade = this.verificarObservacoes(true);
      let avaliacoesManuaisConformidade = this.verificarAvaliacoesManuais();

      if(observacoesConformidade && avaliacoesManuaisConformidade)
        this.finalizarAvaliacaoVerificandoConformidade(nivelAtingido);

    }

    // //Checar conformidade da avaliação
    // let observacoesConformidade = this.verificarObservacoes(true);
    // let todosItensAvaliados = this.verificarTodosItensAvaliados();
    // let avaliacoesManuaisConformidade = this.verificarAvaliacoesManuais();
    //
    // //IF tudo ok
    // this.finalizarAvaliacaoVerificandoConformidade(observacoesConformidade, todosItensAvaliados, avaliacoesManuaisConformidade, nivelAtingido);

  }


  private finalizarAvaliacaoVerificandoConformidade(nivelAtingido) {

      let alertFinalizar = this.alertCtrl.create({
        title: 'Finalizar avaliação',
        message: 'Deseja finalizar avaliação do setor? <br><br> o nível atingido será: ' + '<strong>'+nivelAtingido+'<strong>',
        buttons: [
          {
            text: 'Finalizar',
            handler: () => {
              this.finalizarAvaliacao(nivelAtingido);
              console.log('Avaliação do setor ' + this.setor.sigla + ' finalizada.');
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      alertFinalizar.present();
  }

  finalizarAvaliacao(nivelAtingido: string) {

    this.objAvaliacao.nivelAtingido = nivelAtingido;
    this.objAvaliacao.dataFim = this.avaliacaoService.getDataAgora();
    this.avaliacaoService.save(this.objAvaliacao);

    this.setor.sendoAvaliado = false;
    this.setor.nivel = nivelAtingido;
    this.setor.ultimaAvaliacao = this.objAvaliacao.dataFim;
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

    let nivelAtingido;
    let flagNivelNaoVerde = false;


    let corpo = Object.keys( this.objAvaliacao.corpo).map(i => {
      let value = this.objAvaliacao.corpo[i];
      value.key = i;
      return value;
    });

    corpo.forEach(nivel => {
      if(!flagNivelNaoVerde && this.avaliacaoService.newGetAvaliacaoNivel(nivel) === 'avaliacaoVerde') nivelAtingido = nivel.nome;
      else flagNivelNaoVerde = true;
    });

    if(nivelAtingido) return nivelAtingido;
    else return 'Nível 0';

  }

  private verificarObservacoes(mostrarAlert: boolean) {
    let flagEmOrdem = true;

    let corpo = Object.keys( this.objAvaliacao.corpo).map(i => {
      let value = this.objAvaliacao.corpo[i];
      value.key = i;
      return value;
    });

    let faltantes = [];

    corpo.forEach((nivel) => {
      //if (!flagEmOrdem) return;
      if(nivel.criterios){
        nivel.criterios.forEach(criterio => {
          //if (!flagEmOrdem) return;
          criterio.itensDeAvaliacao.forEach(item => {
            if ((item.avaliacao == 'amarelo' || item.avaliacao == 'vermelho') && item.observacao === undefined) {
              flagEmOrdem = false;

              //DEBUG
              console.log("Observação faltante no item:",item);

              let obsrvacaoFaltanteString = nivel.nome+" > "+criterio.nome+" > Item "+item.ordem;
              faltantes.push(obsrvacaoFaltanteString);

              //return;
            }
          });
        });
      }
    });

    let faltantesString = "";
    faltantes.forEach(string => {
      faltantesString += string + '<br>';
    });

    if (!flagEmOrdem) {
      let alertFaltamObservaoes = this.alertCtrl.create({
        title: 'Observações Faltantes',
        subTitle: 'Faltam observações em itens de valiação avaliados como Amarelo ou Vermelho.' + '<br><br><ion-item><strong>' + faltantesString + '<strong><ion-note>',
        buttons: ['Ok']
      });

      if(mostrarAlert) alertFaltamObservaoes.present();
    }

    return flagEmOrdem;
  }

  private verificarTodosItensAvaliados() {

    let continuar = true;
    let flagTodosAvaliados = true;

    let corpo = Object.keys( this.objAvaliacao.corpo).map(i => {
      let value = this.objAvaliacao.corpo[i];
      value.key = i;
      return value;
    });

    let flagNivelPretendido = false;
    corpo.forEach((nivel) => {
      if(flagNivelPretendido) return;
      if (!flagTodosAvaliados) return;
      if (this.objAvaliacao.nivelPretendido == nivel.nome) flagNivelPretendido = true;
      if(nivel.criterios){
        nivel.criterios.forEach(criterio => {
          if (!flagTodosAvaliados) return;
          criterio.itensDeAvaliacao.forEach(item => {
            if (!item.avaliacao) {
              flagTodosAvaliados = false;
              return;
            }
          });
        });
      }
    });

    if (!flagTodosAvaliados) {

      continuar = false;

      let alertAvaliacoesFaltantes = this.alertCtrl.create({
        title: 'Avaliações Faltantes',
        subTitle: 'Nem todos os itens correspondentes ao nível desejado foram avaliados, deseja continuar?',
        buttons: [
          {
            text: 'Continuar',
            handler: () => {


              // Verifica avaliação novamente
              // sem levar em consideração esse
              // aspecto da verificação

              continuar = true;

              let nivelAtingido = this.getNivelAtingidoAutomaticamente();

              //Checar conformidade da avaliação
              let observacoesConformidade = this.verificarObservacoes(true);
              let avaliacoesManuaisConformidade = this.verificarAvaliacoesManuais();

              //IF tudo ok
              if(observacoesConformidade && avaliacoesManuaisConformidade)
                this.finalizarAvaliacaoVerificandoConformidade(nivelAtingido);
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          }
        ]
      });
      alertAvaliacoesFaltantes.present();
    }

    return flagTodosAvaliados;
  }

  private verificarAvaliacoesManuais() {

    let flagAvaliacoesManuaisConformidade = true;

    let corpo = Object.keys( this.objAvaliacao.corpo).map(i => {
      let value = this.objAvaliacao.corpo[i];
      value.key = i;
      return value;
    });

    corpo.forEach(nivel => {
      if((this.avaliacaoService.newGetCorNivel(nivel) === 'avaliacaoAmarelo') && !nivel.avaliacaoManual){flagAvaliacoesManuaisConformidade = false}
    });

    if(!flagAvaliacoesManuaisConformidade){
      let alertAvaliacoesManuais = this.alertCtrl.create({
        title: 'Avaliações Manuais Faltantes',
        subTitle: 'Faltam avaliações manuais em níveis com critérios avaliados como Amarelo.',
        buttons: ['Ok']
      });
      alertAvaliacoesManuais.present();
    }

    return flagAvaliacoesManuaisConformidade;

  }

}
