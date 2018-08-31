import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from "../pages/login/login";
import {AngularFireAuth} from "angularfire2/auth";
import { AppMinimize } from '@ionic-native/app-minimize'; import { App } from 'ionic-angular';




@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, af: AngularFireAuth, public appMinimize: AppMinimize, public app: App) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Listen for auth sub
        this.rootPage = af.auth.currentUser ? TabsPage : LoginPage;

        /*
        * Remove o fechamento do app quando
        * o botão 'back' é clicado na página inicial
        * */
      platform.registerBackButtonAction(() => {

        let nav = app.getActiveNavs()[0];
        let activeView = nav.getActive();

        if (activeView.name === "LoginPage" || activeView.name === "SetoresPage") {
          /** minimize the app in background **/
          this.appMinimize.minimize();
        }
        else {
          nav.pop();
        }
      });

    });
  }




}
