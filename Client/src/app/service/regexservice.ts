import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Designation } from 'src/app/entity/designation';


@Injectable({
  providedIn: 'root'
})
export class RegexService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async get(type: string): Promise<[]>{
    const regexes = await this.http.get<[]>('http://localhost:8080/regexes/'+type).toPromise();
    if (regexes == undefined){
      return [];
    }
    return regexes;

  }

}
