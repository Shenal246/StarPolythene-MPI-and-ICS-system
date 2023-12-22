import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Production } from '../entity/production';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Production>>{
    const productions = await this.http.get<Array<Production>>('http://localhost:8080/productions'+query).toPromise();//+query
    if (productions == undefined){
      return [];
    }
    return productions;
  }

  async add(production: Production): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/productions', production).toPromise();
  }

  async update(production: Production): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/productions', production).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/productions/' + id).toPromise();
  }


}
