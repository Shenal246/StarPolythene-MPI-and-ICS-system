import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Employeestatus } from 'src/app/entity/employeestatus';
import {Grnstatus} from "../entity/grnstatus";


@Injectable({
  providedIn: 'root'
})
export class Grnstatusservice {

  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Grnstatus>>{
    const grnstatuses = await this.http.get<Array<Grnstatus>>('http://localhost:8080/grnstatuses/list').toPromise();
    if (grnstatuses == undefined){
      return [];
    }
    return grnstatuses;

  }

}
