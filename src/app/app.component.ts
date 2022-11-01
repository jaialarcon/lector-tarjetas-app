import { Component, OnInit } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  public ip: string;
  public port: string;
  public requestURL: string;
  readerMode$: any;
  info: any;
  constructor(private nfc: NFC, private ndef: Ndef) {}

  async ngOnInit() {
    this.info = {
      puerta:1,
      localidades:'Palcos 1'
    };
  }
  readCard() {
    // Read NFC Tag - Android
    // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
    // eslint-disable-next-line no-bitwise
    const flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
    this.readerMode$ = this.nfc.readerMode(flags).subscribe(
      (tag) => console.log(JSON.stringify(tag)),
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
configurar(){
  //http://localhost:8080/cardService/v1/findByCode/6834452
  this.requestURL = 'http:'+this.ip+':'+this.port+'cardService/V1';

}

convertHex2Bin(hex: string){
  let nuevo = '';
  const hexlen = hex.length;
  if(hexlen > 23 ){
    nuevo = (parseInt(hex, 16)).toString(2).substring(-23);
  }
  else{
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
  if(fromBase === 16 ){
    if (n.length > 23){
      converted = parseInt(n.toString(), fromBase).toString(toBase).substring(-23);
    }
    else{
      converted = (parseInt(n, fromBase)).toString(toBase);
    }
  }
  else{
    converted = (parseInt(n, fromBase)).toString(toBase);
  }

  return converted;//parseInt(n.toString(), fromBase).toString(toBase);
}

convBin2Dec(n: string){

}
}


