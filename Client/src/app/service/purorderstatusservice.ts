import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Purorderstatus } from '../entity/purorderstatus';


@Injectable({
  providedIn: 'root'
})
export class Purorderstatusservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Purorderstatus>>{
    const purorderstatuses = await this.http.get<Array<Purorderstatus>>('http://localhost:8080/purorderstatuses/list').toPromise();
    if (purorderstatuses == undefined){
      return [];
    }
    return purorderstatuses;

  }

}
