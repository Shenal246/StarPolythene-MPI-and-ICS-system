import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Designation } from 'src/app/entity/designation';
import { Color } from 'src/app/entity/color';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Color>>{
    const colors = await this.http.get<Array<Color>>('http://localhost:8080/colors/list').toPromise();
    if (colors == undefined){
      return [];
    }
    return colors;

  }

}
