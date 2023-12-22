import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Payment } from '../entity/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Payment>>{
    const payments = await this.http.get<Array<Payment>>('http://localhost:8080/payments'+query).toPromise();//+query
    if (payments == undefined){
      return [];
    }
    return payments;
  }

  async add(payment: Payment): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/payments', payment).toPromise();
  }

  async update(payment: Payment): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/payments', payment).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/payments/' + id).toPromise();
  }


}
