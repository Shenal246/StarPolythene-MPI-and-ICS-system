import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Materialcategory } from '../entity/materialcategory';


@Injectable({
  providedIn: 'root'
})
export class Materialcategoryservice {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Materialcategory>>{
    const materialcategories = await this.http.get<Array<Materialcategory>>('http://localhost:8080/materialcategories/list').toPromise();
    if (materialcategories == undefined){
      return [];
    }
    return materialcategories;

  }

}
