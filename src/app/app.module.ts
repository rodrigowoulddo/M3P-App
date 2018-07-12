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
    AvaliacaoItensPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
    AvaliacaoItensPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SetorService,
    NivelService,
    AvaliacaoService,
    Toaster
  ]
})
export class AppModule {}
