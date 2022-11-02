import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouteReuseStrategy } from '@angular/router';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule  } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [FormsModule ,BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },NFC,Ndef],
  bootstrap: [AppComponent],
})
export class AppModule {}
