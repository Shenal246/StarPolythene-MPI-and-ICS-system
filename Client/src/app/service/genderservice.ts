import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Designation } from 'src/app/entity/designation';
import { Gender } from 'src/app/entity/gender';

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Gender>>{
    const genders = await this.http.get<Array<Gender>>('http://localhost:8080/genders/list').toPromise();
    if (genders == undefined){
      return [];
    }
    return genders;

  }

}
