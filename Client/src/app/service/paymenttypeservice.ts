import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Paymenttype } from 'src/app/entity/paymenttype';


@Injectable({
  providedIn: 'root'
})
export class Paymenttypeservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Paymenttype>>{
    const paymenttypes = await this.http.get<Array<Paymenttype>>('http://localhost:8080/paymenttypes/list').toPromise();
    if (paymenttypes == undefined){
      return [];
    }
    return paymenttypes;

  }

}
