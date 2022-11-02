/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment, } from '../environments/environment';
//import { NetworkInterface } from '@awesome-cordova-plugins/network-interface/ngx';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  urlProp: any;
  constructor(
    private httpClient: HttpClient,
    //private networkInterface: NetworkInterface
  ) {
    // this.url = hostBarceApi;
    // this.urlProp = hostBarceApiProp;
  }

  async findByCode(url: string,codigo: any): Promise<Observable<any>> {
    let $URL;
    // eslint-disable-next-line prefer-const
    $URL = `${url}/findByCode/` + codigo;

    const http_options_token = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
        'Access-Control-Allow-Headers':
          'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
      }),
    };
    //return this.httpClient.get<any>($URL, http_options_token);
    return this.httpClient.get<any>($URL, http_options_token);
  }

  async updateState(url: string,card: any): Promise<Observable<any>> {
    let $URL;
    // eslint-disable-next-line prefer-const
    $URL = `${url}/updateState`;

    const http_options_token = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
        'Access-Control-Allow-Headers':
          'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
      }),
    };
    //return this.httpClient.get<any>($URL, http_options_token);
    ///return this.httpClient.get<any>($URL, http_options_token);
    return this.httpClient.put<any>($URL, card, http_options_token);
  }

}
