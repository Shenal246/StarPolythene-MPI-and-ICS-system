import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Designation } from 'src/app/entity/designation';
import { Supplier } from 'src/app/entity/supplier';
import { Gender } from 'src/app/entity/gender';
import {User} from "../entity/user";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Supplier>>{
    const suppliers = await this.http.get<Array<Supplier>>('http://localhost:8080/suppliers'+query).toPromise();
    if (suppliers == undefined){
      return [];
    }
    return suppliers;
  }

  async add(supplier: Supplier): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/suppliers', supplier).toPromise();
  }

  async update(supplier: Supplier): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/suppliers', supplier).toPromise();
  }


  async delete(id: number): Promise<[]|undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/suppliers/' + id).toPromise();
  }
  //
  // async getAllList(): Promise<Array<Supplier>>{
  //   const suppliers = await this.http.get<Array<Supplier>>('http://localhost:8080/suppliers').toPromise();
  //   if (suppliers == undefined){
  //     return [];
  //   }
  //   return suppliers;
  //
  // }
  //

}
