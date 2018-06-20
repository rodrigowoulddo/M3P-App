import { Component } from '@angular/core';
import {SetoresPage} from "../setores/setores";
import {NiveisPage} from "../niveis/niveis";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  setoresPage:any = SetoresPage;
  niveisPage:any = NiveisPage;

  constructor() {

  }
}
