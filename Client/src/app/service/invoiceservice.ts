import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Designation } from 'src/app/entity/designation';
import { Invoice } from 'src/app/entity/invoice';
import { Gender } from 'src/app/entity/gender';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  cols = '12';
  constructor(private http: HttpClient) { }
  async getAll(query:string): Promise<Array<Invoice>> {
    const invoices = await this.http.get<Array<Invoice>>('http://localhost:8080/invoices'+query).toPromise();
    if(invoices == undefined){
      return [];
    }
    return invoices;
  }

  async add(invoice: Invoice): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/invoices', invoice).toPromise();
  }

  async update(invoice: Invoice): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/invoices', invoice).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/invoices/' + id).toPromise();
  }

}
