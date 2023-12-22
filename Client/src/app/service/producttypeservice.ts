import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Producttype } from 'src/app/entity/producttype';


@Injectable({
  providedIn: 'root'
})
export class Producttypeservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Producttype>>{
    const producttypes = await this.http.get<Array<Producttype>>('http://localhost:8080/producttypes/list').toPromise();
    if (producttypes == undefined){
      return [];
    }
    return producttypes;

  }

}
