import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Supplierstatus } from 'src/app/entity/supplierstatus';


@Injectable({
  providedIn: 'root'
})
export class SupplierstatusService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Supplierstatus>>{
    const supplierstatuses = await this.http.get<Array<Supplierstatus>>('http://localhost:8080/supplierstatuses/list').toPromise();
    if (supplierstatuses == undefined){
      return [];
    }
    return supplierstatuses;

  }

}
