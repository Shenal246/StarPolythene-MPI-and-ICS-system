import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Invoicestatus } from 'src/app/entity/invoicestatus';


@Injectable({
  providedIn: 'root'
})
export class InvoicestatusService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Invoicestatus>>{
    const invoicestatuses = await this.http.get<Array<Invoicestatus>>('http://localhost:8080/invoicestatuses/list').toPromise();
    if (invoicestatuses == undefined){
      return [];
    }
    return invoicestatuses;

  }

}
