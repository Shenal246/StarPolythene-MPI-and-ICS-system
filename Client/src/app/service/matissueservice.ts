import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Matissue } from '../entity/matissue';

@Injectable({
  providedIn: 'root'
})
export class MatissueService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Matissue>>{
    const matissues = await this.http.get<Array<Matissue>>('http://localhost:8080/matissues'+query).toPromise();//+query
    if (matissues == undefined){
      return [];
    }
    return matissues;
  }

  async add(matissue: Matissue): Promise<[]|undefined>{
    console.log(JSON.stringify(matissue));
    return this.http.post<[]>('http://localhost:8080/matissues', matissue).toPromise();
  }

  async update(matissues: Matissue): Promise<[]|undefined>{
    console.log(JSON.stringify(matissues));
    return this.http.put<[]>('http://localhost:8080/matissues', matissues).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/matissues/' + id).toPromise();
  }


}
