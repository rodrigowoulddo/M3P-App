import { Component } from '@angular/core';
import {SetoresPage} from "../setores/setores";
import {EdicaoNiveisPage} from "../edicao-niveis/edicao-niveis";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  setoresPage:any = SetoresPage;
  niveisPage:any = EdicaoNiveisPage;

  constructor() {

  }
}
