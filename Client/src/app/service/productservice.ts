import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Product } from '../entity/product';
import {Employee} from "../entity/employee";
import {Productqty} from "../entity/productqty";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Product>>{
    const products = await this.http.get<Array<Product>>('http://localhost:8080/products'+query).toPromise();//+query
    if (products == undefined){
      return [];
    }
    return products;
  }

  async getAllList(): Promise<Array<Product>>{
    const products = await this.http.get<Array<Product>>('http://localhost:8080/products/list').toPromise();//+query
    if (products == undefined){
      return [];
    }
    return products;
  }

  async getAllListQty(): Promise<Array<Productqty>>{
    const productsqty = await this.http.get<Array<Productqty>>('http://localhost:8080/products/list/qty').toPromise();
    if (productsqty == undefined){
      return [];
    }
    return productsqty;

  }


  async add(product: Product): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/products', product).toPromise();
  }

  async update(product: Product): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/products', product).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/products/' + id).toPromise();
  }


}
