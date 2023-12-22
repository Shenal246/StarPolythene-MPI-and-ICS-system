import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Materialstatus } from '../entity/materialstatus';


@Injectable({
  providedIn: 'root'
})
export class Materialstatusservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Materialstatus>>{
    const materialstatuses = await this.http.get<Array<Materialstatus>>('http://localhost:8080/materialstatuses/list').toPromise();
    if (materialstatuses == undefined){
      return [];
    }
    return materialstatuses;

  }

}
