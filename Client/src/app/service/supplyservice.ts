import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Supply } from 'src/app/entity/supply';

@Injectable({
  providedIn: 'root'
})
export class Supplyservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Supply>>{
    const supplies = await this.http.get<Array<Supply>>('http://localhost:8080/supplies'+query).toPromise();
    if (supplies == undefined){
      return [];
    }
    return supplies;
  }
  //
  // async add(supply: Supply): Promise<[]|undefined>{
  //   return this.http.post<[]>('http://localhost:8080/supplies', supply).toPromise();
  // }
  //
  // async update(supply: Supply): Promise<[]|undefined>{
  //   return this.http.put<[]>('http://localhost:8080/supplies', supply).toPromise();
  // }
  //
  // async delete(id: number): Promise<[]|undefined> {
  //   // @ts-ignore
  //   return this.http.delete('http://localhost:8080/supplies/' + id).toPromise();
  // }
  //
  // async getAllList(): Promise<Array<Supply>>{
  //   const supplies = await this.http.get<Array<Supply>>('http://localhost:8080/supplies').toPromise();
  //   if (supplies == undefined){
  //     return [];
  //   }
  //   return supplies;
  //
  // }


}
