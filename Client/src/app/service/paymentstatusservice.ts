import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Paymentstatus } from '../entity/paymentstatus';


@Injectable({
  providedIn: 'root'
})
export class Paymentstatuseservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Paymentstatus>>{
    const paymentstatuses = await this.http.get<Array<Paymentstatus>>('http://localhost:8080/paymentstatuses/list').toPromise();
    if (paymentstatuses == undefined){
      return [];
    }
    return paymentstatuses;

  }

}
