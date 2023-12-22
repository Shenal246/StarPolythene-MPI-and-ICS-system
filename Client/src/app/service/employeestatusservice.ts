import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Employeestatus } from 'src/app/entity/employeestatus';


@Injectable({
  providedIn: 'root'
})
export class EmployeestatuseService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAllList(): Promise<Array<Employeestatus>>{
    const employeestatuses = await this.http.get<Array<Employeestatus>>('http://localhost:8080/employeestatuses/list').toPromise();
    if (employeestatuses == undefined){
      return [];
    }
    return employeestatuses;

  }

}
