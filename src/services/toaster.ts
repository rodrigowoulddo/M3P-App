import {ToastController} from "ionic-angular";
import {Injectable} from "@angular/core";

@Injectable()
export class Toaster{

  private DEFAULT_DURATION = 3000;

  constructor(private toastCtrl: ToastController){ }

  public mostrarToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: this.DEFAULT_DURATION
    });
    toast.present();
  }

}
