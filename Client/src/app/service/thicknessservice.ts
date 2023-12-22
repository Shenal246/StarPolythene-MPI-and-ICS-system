import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Thickness } from '../entity/thickness';

@Injectable({
  providedIn: 'root'
})
export class Thicknesseservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Thickness>>{
    const thicknesses = await this.http.get<Array<Thickness>>('http://localhost:8080/thicknesses/list').toPromise();
    if (thicknesses == undefined){
      return [];
    }
    return thicknesses;

  }

}
