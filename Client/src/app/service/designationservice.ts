import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Designation } from 'src/app/entity/designation';


@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Designation>>{
    const designations = await this.http.get<Array<Designation>>('http://localhost:8080/designations/list').toPromise();
    if (designations == undefined){
      return [];
    }
    return designations;

  }

}
