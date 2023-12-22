import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Size } from 'src/app/entity/size';


@Injectable({
  providedIn: 'root'
})
export class SizeService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Size>>{
    const sizes = await this.http.get<Array<Size>>('http://localhost:8080/sizes/list').toPromise();
    if (sizes == undefined){
      return [];
    }
    return sizes;

  }

}
