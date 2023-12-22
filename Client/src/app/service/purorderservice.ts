import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Purorder } from '../entity/purorder';

@Injectable({
  providedIn: 'root'
})
export class PurorderService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Purorder>>{
    const purorders = await this.http.get<Array<Purorder>>('http://localhost:8080/purorders'+query).toPromise();//+query
    if (purorders == undefined){
      return [];
    }
    return purorders;
  }

  async getAllListforS(id:number): Promise<Purorder | undefined>{
    const purorder = await this.http.get<Purorder>('http://localhost:8080/purorders/list/'+id).toPromise();//+query
    if (purorder == undefined){
      return undefined;
    }
    return purorder;
  }

  async getAllListforGrn(id:number): Promise<Purorder | undefined>{
    const purorder = await this.http.get<Purorder>('http://localhost:8080/purorders/list/mats/'+id).toPromise();//+query
    if (purorder == undefined){
      return undefined;
    }
    return purorder;
  }

  async add(purorder: Purorder): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/purorders', purorder).toPromise();
  }

  async update(purorder: Purorder): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/purorders', purorder).toPromise();
  }

  async delete(id:number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/purorders/' + id).toPromise();
  }

  async getAllMat(id: number): Promise<Purorder|undefined >{
    const purorder = await this.http.get<Purorder>('http://localhost:8080/purorders/list/mats/'+id).toPromise();//+query
    console.log("Massss"+ purorder);
    return purorder;
  }


}
