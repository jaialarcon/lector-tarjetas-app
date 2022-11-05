/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { CardsService } from 'src/services/cards.service';
import { SharedService } from 'src/services/shared.services';
import { BehaviorSubject, Observable } from 'rxjs';
import { ENV } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  contador = 0;
  editConf = true;
  nfcEnabled = false;
  contador2 = 0;
  hasResponse: boolean;
  public ip?: string = '';
  public port?: string = '';
  card: any;
  cardcardInfo: any;
  cardInfo: any;
  public dir: string;
  public requestURL: string;
  readerMode$: any;
  info: any;
  asyncTask: any;


  constructor(
    private nfc: NFC,
    private ndef: Ndef,
    private cardService: CardsService,
    private share: SharedService
  ) { }
  async ionViewWillEnter() {
    this.nfcEnabled = await ((await this.nfc.enabled()).toPromise());
    //console.log("IS ENABLED", this.nfcEnabled);

    if (this.nfcEnabled) {
      //console.log("NFC ENABLED");
      this.nfc.addNdefListener(() => {
        //console.log('successfully attached ndef listener');
      }, (err) => {
        //console.log('error attaching ndef listener', err);
      }).subscribe((event) => {
        //console.log('received ndef message. the tag contains: ', event.tag);
        //console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));
      });
    }
    else {
      //console.log("NFC DISABLED");
    }
  }
  async ngOnInit() {
    this.info = {
      puerta: 1,
      localidades: 'Palcos 1'
    };

    this.executeTask();

    this.nfcEnabled = await ((await this.nfc.enabled()).toPromise());
    //console.log("IS ENABLED", this.nfcEnabled);

    if (this.nfcEnabled) {
      //console.log("NFC ENABLED");
      this.nfc.addNdefListener(() => {
        //console.log('successfully attached ndef listener');
      }, (err) => {
        //console.log('error attaching ndef listener', err);
      }).subscribe((event) => {
        //console.log('received ndef message. the tag contains: ', event.tag);
        //console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));
      });
    }
    else {
      //console.log("NFC DISABLED");
    }

  }
  readCard() {
    // Read NFC Tag - Android
    // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
    // eslint-disable-next-line no-bitwise
    const flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
    this.readerMode$ = this.nfc.readerMode(flags).subscribe(
      async (tag) => {
        //console.log(JSON.stringify(tag));
        //console.log('decoded tag id', this.nfc.bytesToHexString(tag.id));
        //console.log("Estoy enabled");
        if (this.contador > 0) {
          //console.log("habilitado");
          try {
            //await this.readCard();
            this.card = this.nfc.bytesToHexString(tag.id);
            //console.log(this.card);
            const serialNumber = this.card;
            const reversed = serialNumber.slice(-2) + serialNumber.slice(4, 6) + serialNumber.slice(2, 4) + serialNumber.slice(0, 2);
            const firstBin = this.convertNumber(reversed, 16, 2);
            const cardCode = this.convertNumber(firstBin, 2, 10);
            //console.log("NUMERO ESPERADO:", cardCode);
            const results = await (await this.cardService.findByCode(this.requestURL, cardCode)).toPromise();
            localStorage.setItem("results", JSON.stringify(results));
            if (results.code == null) {
              //this.setCardInfo(results[0]);
              this.cardInfo = results[0];
              if (this.cardInfo.code !== null && this.cardInfo.estado === 'N') {
                this.hasResponse = true;
                this.cardInfo.estado = 'S';
                this.cardInfo.fecha_uso = new Date().toISOString();
                sessionStorage.setItem('card', JSON.stringify(this.cardInfo));
                const responseUpdate = await (await this.cardService.updateState(this.requestURL, this.cardInfo)).toPromise();
                //alert('Access Granted and updated');
                this.share.showToastColor('', 'Access Granted and updated', 's');
                this.contador2 += 1;
                //console.log('Access Granted and updated');
                this.card = '';
                //localStorage.removeItem('tarjeta');
              } else {
                alert(this.cardInfo.message);
                this.hasResponse = false;
                this.card = '';
                //localStorage.removeItem('tarjeta');
              }
            } else {
              this.card = '';
              localStorage.removeItem('tarjeta');
              this.share.showToastColor('', results.message, 'w');
            }

          } catch (ex) {
            //console.log(ex);
            this.share.showToastColor('', ex.message, 'd');
          }

        } else {
          this.share.showToastColor('', "NFC ACTIVADO", 's');
          this.contador += 1;
        }
        //localStorage.setItem('tarjeta', JSON.stringify(this.nfc.bytesToHexString(tag.id)));
      },
      (err) => console.log('Error reading tag', err)
    );
    if (this.contador2 > 0) {
      const results2 = JSON.parse(localStorage.getItem("results"));
      if (results2.code == null) {
        //this.setCardInfo(results2[0]);
        //this.cardcardInfo = this.cardcardInfo.getValue();
        this.cardcardInfo = results2[0];
        if (this.cardcardInfo.code !== null && this.cardcardInfo.estado === 'N') {
          this.hasResponse = true;
          this.cardcardInfo.estado = 'S';
          this.cardcardInfo.fecha_uso = new Date().toISOString();
          //const responseUpdate = await (await this.cardService.updateState(this.requestURL, this.cardInfo)).toPromise();
          //alert('Access Granted and updated');
          //this.share.showToastColor('', 'Access Granted and updated', 's');
          sessionStorage.setItem('card', JSON.stringify(this.cardcardInfo));
          //console.log('Access Granted and updated');
          this.card = '';
          //localStorage.removeItem('tarjeta');
        } else {
          alert(this.cardcardInfo.message);
          this.hasResponse = false;
          this.card = '';
          //localStorage.removeItem('tarjeta');
        }
      } else {
        this.card = '';
        localStorage.removeItem('tarjeta');
        this.share.showToastColor('', results2.message, 'w');
      }
    }

  }

  executeTask() {
    this.asyncTask = setInterval(() => { this.readSessionStorageCard() }, 1000);
  }

  readSessionStorageCard() {
    const card = JSON.parse(sessionStorage.getItem('card'));
    if (card !== null || card !== '') {
      this.cardcardInfo = card;
    }
  }

  onNfc(nfcEvent) {

    //console.log(nfcEvent.tag);

    const message = [
      // eslint-disable-next-line no-new-wrappers
      this.ndef.textRecord('test')
    ];

    this.nfc.write(
      message,
    );

    this.nfc.addNdefListener(this.onNfc);
  }

  configurar() {
    this.editConf = !this.editConf;
  }
  saveConfig() {
    if (this.ip !== '' && this.port !== '') {
      this.requestURL = "";
      //http://localhost:8080/cardService/v1/findByCode/6834452
      this.requestURL = 'http://' + this.ip + ':' + this.port + '/cardService/v1';
      this.editConf = true;
      this.share.showToastColor('', "IP y puerto actualizados correctamente.", 's');
    } else {
      this.share.showToastColor('', "IP o puerto vacío", 'w');
    }
  }

  convertHex2Bin(hex: string) {
    let nuevo = '';
    const hexlen = hex.length;
    if (hexlen > 23) {
      nuevo = (parseInt(hex, 16)).toString(2).substring(-23);
    }
    else {
      nuevo = (parseInt(hex, 16)).toString(2);
    }

    return nuevo;

  }
  convertNumber(n: string, fromBase: number, toBase: number): string {
    let converted = '';
    if (fromBase === void 0) {
      fromBase = 10;
    }
    if (toBase === void 0) {
      toBase = 10;
    }
    if (fromBase === 2) {
      //console.log("BIN", n);

      if (n.length > 23) {
        ////console.log("tiene >23");
        converted = parseInt(n.slice(-23), fromBase).toString(toBase);
        //console.log("converted provisional >23", converted);
      } else {
        ////console.log("no tiene");
        converted = converted;
        //console.log("converted provisional <23", converted);
      }
    }
    else {
      converted = (parseInt(n, fromBase)).toString(toBase);
    }

    return converted;//parseInt(n.toString(), fromBase).toString(toBase);
  }

  convBin2Dec(n: string): number {
    return Number.parseInt(n, 10);
  }

  async processRead() {
    try {
      await this.readCard();
      this.card = JSON.parse(localStorage.getItem('tarjeta'));
      //console.log(this.card);
      const serialNumber = this.card;
      const processedString = this.convertNumber(serialNumber, 16, 2);
      const cardCode = this.convertNumber(processedString, 2, 10);
      //console.log("NUMERO ESPERADO:", cardCode);
      const results = await (await this.cardService.findByCode(this.requestURL, cardCode)).toPromise();
      if (results.code == null) {
        this.cardInfo = results[0];
        if (this.cardcardInfo.code !== null && this.cardcardInfo.estado === 'N') {
          this.hasResponse = true;
          this.cardcardInfo.estado = 'S';
          this.cardcardInfo.fecha_uso = new Date().toISOString();
          const responseUpdate = await (await this.cardService.updateState(this.requestURL, this.cardInfo)).toPromise();
          alert('Access Granted and updated');
          //console.log('Access Granted and updated');
          this.card = '';
          localStorage.removeItem('tarjeta');
        } else {
          alert(this.cardcardInfo.message);
          this.hasResponse = false;
          this.card = '';
          localStorage.removeItem('tarjeta');
        }
      } else {
        this.card = '';
        localStorage.removeItem('tarjeta');
        this.share.showToastColor('', results.message, 'w');
      }

    } catch (ex) {
      //console.log(ex);
      this.share.showToastColor('', ex.message, 'd');
    }
  }
  setCardInfo(info: any) {
    this.cardInfo.next(info);
  };

}
