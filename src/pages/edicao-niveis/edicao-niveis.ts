import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, reorderArray} from 'ionic-angular';
import {Nivel} from "../../data/nivelInterface";
import {AngularFireDatabase} from "angularfire2/database";
import { ChangeDetectorRef } from '@angular/core'
import {SetorPage} from "../setor/setor";
import {EdicaoNivelPage} from "../edicao-nivel/edicao-nivel";
import {NivelService} from "../../services/nivel";
import {detectChanges} from "@angular/core/src/render3";



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
  niveisRollback: Nivel[] = []
  editableOn: boolean = false;

  constructor(public navCtrl: NavController,
              private nivelService: NivelService,
              public navParams: NavParams,
              private db: AngularFireDatabase,
              private changeRef: ChangeDetectorRef,
              private alertCtrl: AlertController) {


    this.db.database.ref('niveis').on("value",
      (data) => {
        this.niveis = (<any>Object).values(data.val());
        this.niveisRollback = [...this.niveis]; // copia
        console.log(this.niveis);
        this.changeRef.detectChanges(); // força atualizações quando pega primeira resposta

      },
      () => {console.log('ERRO AO BUSCAR NÍVEIS'); return []}
    );


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EdicaoNiveisPage');
  }

  reorderItems(indexes) {
    this.niveis = reorderArray(this.niveis, indexes);
  }

  salvarNiveis(){
    console.log('salvar niveis');



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
    let novoNivel: Nivel = {nome: 'Novo Nível', criterios: []};
    this.niveis.push(novoNivel);
    this.changeRef.detectChanges();
  }

  getUrlImagemNivel(nivel) {

    if(nivel === "Novo Nível")
      return 'http://nqi.ufcspa.edu.br/wiki/selos-niveis/' + "Nível 0" + '.png';

    return 'http://nqi.ufcspa.edu.br/wiki/selos-niveis/' + nivel + '.png';
  }



}
