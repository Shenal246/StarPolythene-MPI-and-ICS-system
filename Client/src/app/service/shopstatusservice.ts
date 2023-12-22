import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Shopstatus } from '../entity/shopstatus';


@Injectable({
  providedIn: 'root'
})
export class Shopstatuseservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Shopstatus>>{
    const shopstatuses = await this.http.get<Array<Shopstatus>>('http://localhost:8080/shopstatuses/list').toPromise();
    if (shopstatuses == undefined){
      return [];
    }
    return shopstatuses;

  }

}
