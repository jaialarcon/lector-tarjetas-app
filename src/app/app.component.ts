import { Component } from '@angular/core';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public ip: string;
  public port: string;
  public requestURL: string;
  readerMode$: any;
  constructor(private nfc: NFC, private ndef: Ndef) {}

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

}
