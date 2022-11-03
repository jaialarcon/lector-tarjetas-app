/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, Optional } from '@angular/core';
import { ComponentRef } from '@ionic/core';
import {
  IonRouterOutlet,
  ModalOptions,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';


export const regxs = {
  lower: /^[a-z]+$/,
  upper: /^[A-Z]+$/,
  numberFormat: /^[0-9]+$/,
  upperLower: /^[A-Za-z0-9 ]+$/,
};

export let currentModal = null;
export let currentModal2 = null;


@Injectable({
  providedIn: 'root',
})
export class SharedService {
  questionAlert: any[] = [];
  loading;
  popover;
  header: any;
  hasNotification: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    @Optional() private routerOutlet: IonRouterOutlet,
    private router: Router,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private sanitizer: DomSanitizer,
  ) { }


  async startLoading() {
    this.loading = await this.loadingController.create({
      message: '',
      translucent: true,
      spinner: 'lines',
    });
    this.loading.present();
  }

  async stopLoading() {
    this.loading.dismiss();
  }

  closeModal() {
    if (currentModal2) {
      currentModal2.dismiss().then(() => {
        currentModal2 = null;
      });
    } else {
      currentModal?.dismiss().then(() => {
        currentModal = null;
      });
    }
  }

  async presentConfirm(
    header: any,
    message: string,
    actionDescription: string,
    ruta: string
  ) {
    const alert = this.alertController.create({
      cssClass: 'alertSms',
      header,
      message,
      buttons: [
        {
          text: actionDescription,
          handler: () => {
            this.router.navigate([ruta]).then(() => { });
            sessionStorage.setItem('ruta', '/inicio');
          },
        },
        {
          text: 'Mas luego',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    this.questionAlert.push(alert);
    (await alert).present();
  }

  async presentConfirmDelete(
    header: any,
    message: string,
    actionDescription: string,
    ruta: string
  ) {
    const alert = this.alertController.create({
      cssClass: 'alertSms',
      header,
      message,
      buttons: [
        {
          text: actionDescription,
          handler: () => {
            this.router.navigate([ruta]).then(() => { });
            sessionStorage.setItem('ruta', '/inicio');
          },
        },
      ],
    });
    this.questionAlert.push(alert);
    (await alert).present();
  }

  async presentConfirmPay(
    header: any,
    message: string,
    actionDescription: string,
  ) {
    const alert = this.alertController.create({
      cssClass: 'alertSms',
      header,
      message,
      buttons: [
        {
          text: actionDescription,
          // handler: () => {
          //   this.router.navigate([ruta]).then(() => {});
          //   sessionStorage.setItem("ruta", "/inicio");
          // },
        },
        {
          text: 'Mas luego',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    this.questionAlert.push(alert);
    (await alert).present();
  }

  async presentConfirmAction(
    header: any,
    message: any,
    cancelText: any,
    okText: any,
    context: object,
    confirmAction: () => any
  ) {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'buttonCss',
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          cssClass: 'exit-button',
        },
        {
          text: okText,
          cssClass: 'exit-button',
          handler: confirmAction.bind(context),
        },
      ],
    });
    this.questionAlert.push(alert);
    await alert.present();
  }

  async confirm(
    header: any,
    message: string,
    actionDescription: string,
    ruta: string
  ) {
    const alert = this.alertController.create({
      cssClass: 'alertSms',
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: actionDescription,
          handler: async () => {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('tokenP');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('tipo-user');
            sessionStorage.clear();
            location.replace(ruta);
          },
        },
      ],
    });
    this.questionAlert.push(alert);
    (await alert).present();
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000,
      position: 'top',
    });
    toast.present();
  }

  async showToastColor(head: string, msg: string, color: string) {
    // 'success', 'warning', 'danger'
    let icon: any;
    let col;
    switch (color) {
      case 's':
        icon = 'checkmark-circle-outline';
        col = 'success';
        break;
      case 'w':
        icon = 'alert-circle-outline';
        col = 'warning';
        break;
      case 'd':
        icon = 'close-circle-outline';
        col = 'danger';
        break;
    }

    const toast = await this.toastController.create({
      header: head,
      message: msg,
      duration: 1000,
      position: 'middle',
      color: col,
      animated: true,
      cssClass: 'text-alain',
      buttons: [
        {
          side: 'start',
          icon,
        },
        {
          icon: 'close-outline',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  calcularEdad(fecha) {
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }

    return edad;
  }

  error = async (header: any, message: string) => {
    try {
      this.dismissAlert();
    } catch (ex) { }
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'buttonCss',
      buttons: [
        {
          text: 'Aceptar',
          role: 'cancel',
          cssClass: 'exit-button',
        },
      ],
    });
    this.questionAlert.push(alert);
    await alert.present();
  };

  public dismissAlert() {
    console.log(this.questionAlert.length);
    if (this.questionAlert.length) {
      this.questionAlert.forEach((element) => {
        element.dismiss();
      });
    }
    this.questionAlert = [];
  }

  async presentPopover(page: any, css: string) {
    this.popover = await this.popoverController.create({
      component: page,
      translucent: true,
      cssClass: css,
      mode: 'md',
    });
    await this.popover.present();

    await this.popover.onDidDismiss();
  }

  async dimissPopover() {
    this.popover.dismiss();
  }

  async openModalPage<T extends ComponentRef = ComponentRef>(
    component: T,
    routerOutlet = null,
    canDismiss = true
  ) {
    const modalOptions: ModalOptions<T> = {
      component,
      canDismiss,
      presentingElement:
        routerOutlet == null
          ? await this.modalController.getTop()
          : routerOutlet.nativeEl,
    };
    const modal = await this.modalController.create(modalOptions);
    if (currentModal) {
      currentModal2 = modal;
    } else {
      currentModal = modal;
    }
    await modal.present();
    const result = await modal.onDidDismiss();
    return result;
  }
  async openModalPageData(page: any, data: any) {
    const modal = await this.modalController.create({
      component: page,
      componentProps: {
        data,
      },
    });
    if (currentModal) {
      currentModal2 = modal;
    } else {
      currentModal = modal;
    }

    await modal.present();
    const result = await modal.onDidDismiss();
    return result;
  }

  async stateTransaccition(trans: any) {
    const alert = await this.alertController.create({
      cssClass: 'doblePago',
      header: 'ALERTA',
      message:
        'Tiene la transacción ' +
        trans.reference +
        ', por un monto de $' +
        trans.monto +
        ' en estado pendiente.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'false',
          cssClass: 'secondary',
        },
        {
          text: 'Continuar',
          role: 'true',
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role;
  }

  public htmlProperty(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  async presentResult(header: any, message: string) {
    const alert = this.alertController.create({
      header,
      message,
      cssClass: 'optionMenu',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel');
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Ok');
          },
        },
      ],
    });
    this.questionAlert.push(alert);
    (await alert).present();
    (await alert).onDidDismiss();
  }

  async presentResultOk(header: any, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'optionMenu',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Ok');
          },
        },
      ],
    });
    this.questionAlert.push(alert);
    await alert.present();
    await alert.onDidDismiss();
  }

}
