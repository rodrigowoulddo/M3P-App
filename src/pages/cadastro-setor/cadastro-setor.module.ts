import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroSetorPage } from './cadastro-setor';

@NgModule({
  declarations: [
    CadastroSetorPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroSetorPage),
  ],
})
export class CadastroSetorPageModule {}
