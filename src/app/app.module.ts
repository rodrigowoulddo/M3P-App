import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Ionic Imports
import { TabsPage } from '../pages/tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {SetoresPage} from "../pages/setores/setores";
import {NiveisPage} from "../pages/niveis/niveis";
import {NgPipesModule} from "ngx-pipes";


//Imports Database
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {FIREBASE_CONFIG} from "./firebase.credentials";

// Own Services and Pages
import {SetorService} from "../services/setor";
import {CadastroSetorPage} from "../pages/cadastro-setor/cadastro-setor";
import {SetorPage} from "../pages/setor/setor";
import {PreAvaliacaoPage} from "../pages/pre-avaliacao/pre-avaliacao";
import {AvaliacaoPage} from "../pages/avaliacao/avaliacao";
import {NivelService} from "../services/nivel";
import {AvaliacaoService} from "../services/avaliacao";
import {Toaster} from "../services/toaster";
import {AvaliacaoCriteriosPage} from "../pages/avaliacao-criterios/avaliacao-criterios";
import {AvaliacaoItensPage} from "../pages/avaliacao-itens/avaliacao-itens";
import {AvaliacaoAnteriorPage} from "../pages/avaliacao-anterior/avaliacao-anterior";
import {AvaliacaoCriteriosAnteriorPage} from "../pages/avaliacao-criterios-anterior/avaliacao-criterios-anterior";
import {AvaliacaoItensAnteriorPage} from "../pages/avaliacao-itens-anterior/avaliacao-itens-anterior";
import {LoginPage} from "../pages/login/login";
import {AngularFireAuth} from "angularfire2/auth";
import {AppMinimize} from "@ionic-native/app-minimize";
import {IonicStorageModule} from "@ionic/storage";
import { Autosize} from '../components/autosize/autosize'

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    SetoresPage,
    NiveisPage,
    CadastroSetorPage,
    SetorPage,
    PreAvaliacaoPage,
    AvaliacaoPage,
    AvaliacaoCriteriosPage,
    AvaliacaoItensPage,
    AvaliacaoAnteriorPage,
    AvaliacaoCriteriosAnteriorPage,
    AvaliacaoItensAnteriorPage,
    LoginPage,
    Autosize,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    NgPipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    SetoresPage,
    NiveisPage,
    CadastroSetorPage,
    SetorPage,
    PreAvaliacaoPage,
    AvaliacaoPage,
    AvaliacaoCriteriosPage,
    AvaliacaoItensPage,
    AvaliacaoAnteriorPage,
    AvaliacaoCriteriosAnteriorPage,
    AvaliacaoItensAnteriorPage,
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    SetorService,
    NivelService,
    AvaliacaoService,
    Toaster,
    AppMinimize,
  ]
})
export class AppModule {}
