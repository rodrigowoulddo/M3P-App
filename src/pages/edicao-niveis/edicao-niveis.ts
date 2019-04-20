import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, reorderArray, ToastController} from 'ionic-angular';
import {Nivel} from "../../data/nivelInterface";
import {AngularFireDatabase} from "angularfire2/database";
import { ChangeDetectorRef } from '@angular/core'
import {SetorPage} from "../setor/setor";
import {EdicaoNivelPage} from "../edicao-nivel/edicao-nivel";
import {NivelService} from "../../services/nivel";
import {detectChanges} from "@angular/core/src/render3";
import {HistoricoDeNivel} from "../../data/historicoDeNivel";
import {Criterio} from "../../data/criterioInterface";
import {ItemDeAvaliacao} from "../../data/itemDeAvaliacaoInterface";



/**
 * Generated class for the EdicaoNiveisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edicao-niveis',
  templateUrl: 'edicao-niveis.html',
})
export class EdicaoNiveisPage {

  niveis: Nivel[] = [];
  nivelHistorico: HistoricoDeNivel;
  niveisRollback: Nivel[] = [];
  editableOn: boolean = false;

  constructor(public navCtrl: NavController,
              private nivelService: NivelService,
              public navParams: NavParams,
              private db: AngularFireDatabase,
              private changeRef: ChangeDetectorRef,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController) {

    // this.nivelHistorico.nome = "";

    this.db.database.ref('niveis').on("value",
      (data) => {

      if(!data.val()) return;

        this.niveis = (<any>Object).values(data.val());
        this.niveisRollback = [...this.niveis]; // copia
        this.changeRef.detectChanges(); // força atualizações quando pega primeira resposta

      },
      () => {console.log('ERRO AO BUSCAR NÍVEIS'); return []}
    );

    let refUltimaOrganizacaoDeNiveis = this.db.database.ref('historicoDeNiveis').orderByChild('dataCriacao').limitToLast(1);

    let self = this;

    refUltimaOrganizacaoDeNiveis.on("value",
      data => {
        this.nivelHistorico = (<any>Object).values(data.val())[0];
        this.changeRef.detectChanges(); // força atualizações quando pega primeira resposta

        //debug
        console.log(this.nivelHistorico)

      }
    );


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EdicaoNiveisPage');
  }

  reorderItems(indexes) {
    this.niveis = reorderArray(this.niveis, indexes);
  }

  salvarNiveis(){

    let menssagemDeErro = this.validarEstruturaDeNíveis(this.niveis);

    if (menssagemDeErro)
      this.mostrarAlertDeErroNaEstrutura(menssagemDeErro);
    else
      this.mostrarAlertDeTipoDeAlteracao();



  }

  private mostrarAlertDeTipoDeAlteracao() {
    console.log('salvar nova versão');

    let alert = this.alertCtrl.create({
      title: 'Editar Níveis',
      message: 'Criar uma nova versão da estrutura de níveis ou fazer uma alteração simples na versão já existente?',
      buttons: [

        {
          text: 'Alteração',
          handler: () => {
            this.salvarAlteracaoSimplesNaEstruturaAtual();
          }
        },

        {
          text: 'Nova Versão',
          handler: () => {
            this.salvarNovaVersaoDeNivel();
          }
        },

        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      ]
    });

    alert.present();
  }

  private salvarAlteracaoSimplesNaEstruturaAtual() {

    this.nivelService.deleteNiveis();
    this.nivelService.saveNiveis(this.niveis);

    let toast = this.toastCtrl.create({
      message: 'Alteração da versão atual salva com sucesso!',
      duration: 3000,
    });

    toast.present();
  }

  private salvarNovaVersaoDeNivel() {
    console.log('salvar nova versão');

    let alert = this.alertCtrl.create({
      title: 'Nova Estrutura de Níveis',
      message: 'Defina um nome para a nova estrutura de níveis.',
      inputs: [
        {
          name: 'nome',
          placeholder: 'Nome da Estrutra'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Salva',
          handler: data => {
            this.nivelService.saveNiveisHistorico(this.niveis, data.nome);
            this.nivelService.deleteNiveis();
            this.nivelService.saveNiveis(this.niveis);

            let toast = this.toastCtrl.create({
              message: 'Nova estrutura de níveis salva com sucesso!',
              duration: 3000,
            });

            toast.present();

          }
        }
      ]
    });
    alert.present();
  }

  irParaEdicaoDeNivel(nivel: Nivel){

    this.navCtrl.push(EdicaoNivelPage, {nivel: nivel});

  }

  toggleEditable(){

    //debug
    console.log(this.niveis);

    this.editableOn = !this.editableOn;
    this.changeRef.detectChanges();
  }
  removerNivel(nivel: Nivel){

    let alert = this.alertCtrl.create({
      title: 'Excluir Nível?',
      message: 'Você quer excluir este nível?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Excluir',
          handler: () => {

            const index: number = this.niveis.indexOf(nivel);
            if (index !== -1) {
              this.niveis.splice(index, 1);
            }

          }
        }
      ]
    });

    alert.present();

  }

  adicionar(){
    let novoNivel: Nivel = {nome: '', criterios: []};
    this.niveis.push(novoNivel);
    this.changeRef.detectChanges();
  }

  getUrlImagemNivel(nivel) {

    if(nivel === "Novo Nível")
      return 'http://nqi.ufcspa.edu.br/wiki/selos-niveis/' + "Nível 0" + '.png';

    return 'http://nqi.ufcspa.edu.br/wiki/selos-niveis/' + nivel + '.png';
  }

  validarNivel(nivel: Nivel){

      if(!nivel) return 'Não há nível';

      if (!nivel.nome)
        return 'Níveis devem possuir um nome';

      if(!nivel.criterios || nivel.criterios.length == 0)
        return 'Níveis devem possuir ao menos um Critério';

    return null;

  }

  validarCriterio(criterio: Criterio){

    if (!criterio) return 'Não há critério';

      if (!criterio.descricao || !criterio.nome)
        return 'Critérios devem possuir nome e descrição';

      //DEBUG
    console.log('itens de avaliação do criterio:');
    console.log(criterio.itensDeAvaliacao);

      if (!criterio.itensDeAvaliacao || criterio.itensDeAvaliacao.length == 0)
        return 'Critérios devem possuir ao menos um Item de Avaliação';

    return null;

  }

  validarItensDeAvaliacao(item: ItemDeAvaliacao) {

    if (!item) return 'Deve haver ao menos um Item de Avaliação por critério';

    if (!item.descricao) return 'Itens de Avaliação devem possuir uma descrição';

    return null;

  }

  validarEstruturaDeNíveis(niveis: Nivel[]){

    let msg: String = '';

    if (!niveis) return 'Não há níveis!';

    niveis.forEach(nivel => {

      let preAviso = '<br>'+(niveis.indexOf(nivel)+1) +'º Nível: ';

      if(this.validarNivel(nivel))
        msg += preAviso +  this.validarNivel(nivel);
      else
        nivel.criterios = (<any>Object).values(nivel.criterios);

        if(nivel.criterios)
          nivel.criterios.forEach(criterio => {

            if(this.validarCriterio(criterio))
              msg += preAviso + this.validarCriterio(criterio);
            else
              criterio.itensDeAvaliacao = (<any>Object).values(criterio.itensDeAvaliacao);

              if(criterio.itensDeAvaliacao)
                criterio.itensDeAvaliacao.forEach(item => {

                  if(this.validarItensDeAvaliacao(item))
                    msg += preAviso + this.validarItensDeAvaliacao(item);

                });

          });

    });

    if (msg)
      console.log(msg);
    else
      console.log('Estrutura de Níveis validada');

    return msg;

  }

  mostrarAlertDeErroNaEstrutura(msg: String){

    let alert = this.alertCtrl.create({
      title: 'Erro',
      message:
        'Foram encontrados os seguintes erros na nova estrutura de níveis:'
        + msg
        + '<br> <br>'
        + '<strong>A estrutura de níveis não será salva</strong>',

      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
      ]
    });

    alert.present();

  }







}
