import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Material } from '../entity/material';
import {Employee} from "../entity/employee";

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Material>>{
    const materials = await this.http.get<Array<Material>>('http://localhost:8080/materials'+query).toPromise();//+query
    if (materials == undefined){
      return [];
    }
    // console.log("mat service" + JSON.stringify(materials));
    return materials;
  }


  async add(material: Material): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/materials', material).toPromise();
  }

  async update(material: Material): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/materials', material).toPromise();
  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/materials/' + id).toPromise();
  }

  async getList(): Promise<Array<Material>>{
    const materials = await this.http.get<Array<Material>>('http://localhost:8080/materials/list').toPromise();
    if (materials == undefined){
      return [];
    }
    return materials;

  }

  async getListlist(): Promise<Array<Material>>{
    const materials = await this.http.get<Array<Material>>('http://localhost:8080/materials/list/list').toPromise();
    if (materials == undefined){
      return [];
    }
    return materials;

  }


}
