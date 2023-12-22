import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Shop } from '../entity/shop';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Shop>>{
    const shops = await this.http.get<Array<Shop>>('http://localhost:8080/shops'+query).toPromise();//+query
    if (shops == undefined){
      return [];
    }
    return shops;
  }

  async getAllList(): Promise<Array<Shop>> {

    const shops = await this.http.get<Array<Shop>>('http://localhost:8080/shops/list').toPromise();
    if(shops == undefined){
      return [];
    }
    return shops;
  }

  async add(shop: Shop): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/shops', shop).toPromise();
  }

  async update(shop: Shop): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/shops', shop).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/shops/' + id).toPromise();
  }


}
