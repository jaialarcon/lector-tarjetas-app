/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { CardsService } from 'src/services/cards.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  hasResponse: boolean;
  public ip?: string;
  card: any;
  cardInfo: any;
  public dir: string;
  public port?: string;
  public requestURL: string;
  readerMode$: any;
  info: any;
  constructor(private nfc: NFC, private ndef: Ndef, private cardService: CardsService,) { }

  async ngOnInit() {
    this.info = {
      puerta: 1,
      localidades: 'Palcos 1'
    };
  }
  readCard() {
    // Read NFC Tag - Android
    // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
    // eslint-disable-next-line no-bitwise
    const flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
    this.readerMode$ = this.nfc.readerMode(flags).subscribe(
      (tag) => {
        console.log(JSON.stringify(tag));
        console.log('decoded tag id', this.nfc.bytesToHexString(tag.id));
        localStorage.setItem('tarjeta', JSON.stringify(this.nfc.bytesToHexString(tag.id)));
      },
      (err) => console.log('Error reading tag', err)
    );
  }
  onNfc(nfcEvent) {

    console.log(nfcEvent.tag);

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
    //http://localhost:8080/cardService/v1/findByCode/6834452
    this.requestURL = 'http:' + this.ip + ':' + this.port + '/cardService/V1';
    environment.apiURL = this.requestURL;
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

    // eslint-disable-next-line eqeqeq
    if (fromBase === 16) {
      if (n.length > 23) {
        converted = parseInt(n, toBase).toString().substring(-23);
      }
      else {
        converted = (parseInt(n, toBase)).toString();
      }
    }
    else {
      converted = (parseInt(n, toBase)).toString();
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
      console.log(this.card);
      const serialNumber = this.card;
      const processedString = this.convertNumber(serialNumber, 16, 2);
      const cardCode = this.convertNumber(processedString, 2, 10);
      console.log("NUMERO ESPERADO:", cardCode);
      const results = await (await this.cardService.findByCode(this.requestURL, Number.parseInt(cardCode, 10))).toPromise();
      this.cardInfo = results[0];
      if (this.cardInfo.code !== null && this.cardInfo.estado === 'N') {
        this.hasResponse = true;
        const responseUpdate = await (await this.cardService.updateState(this.requestURL, this.cardInfo)).toPromise();
        alert('Access Granted and updated');
        console.log('Access Granted and updated');
      } else {
        alert(this.cardInfo.message);
        this.hasResponse = false;
      }

    } catch (ex) {
      console.log(ex);

    }
  }
}
