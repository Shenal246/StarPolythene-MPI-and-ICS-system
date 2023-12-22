import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Employeestatus } from 'src/app/entity/employeestatus';
import {Grnstatus} from "../entity/grnstatus";
import {Grn} from "../entity/grn";
import {Employee} from "../entity/employee";


@Injectable({
  providedIn: 'root'
})
export class Grnservice {

  constructor(private http: HttpClient) { }

  async getAll(query:string): Promise<Array<Grn>>{
    const grns = await this.http.get<Array<Grn>>('http://localhost:8080/grns'+query).toPromise();
    if (grns == undefined){
      return [];
    }
    return grns;

  }

  async add(grn: Grn): Promise<[]|undefined>{
   // console.log(JSON.stringify(grn));
    return this.http.post<[]>('http://localhost:8080/grns', grn).toPromise();
  }

  async update(grn: Grn): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/grns', grn).toPromise();
  }

  async delete(id: number): Promise<[]|undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/grns/' + id).toPromise();
  }


}
