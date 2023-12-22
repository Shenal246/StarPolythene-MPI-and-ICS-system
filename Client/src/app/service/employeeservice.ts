import { HttpClient } from '@angular/common/http';
import {Component, Injectable} from '@angular/core';
import { Designation } from 'src/app/entity/designation';
import { Employee } from 'src/app/entity/employee';
import { Gender } from 'src/app/entity/gender';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  cols = '12';
  constructor(private http: HttpClient) { }

  async getAll(query: string): Promise<Array<Employee>>{
    const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees'+query).toPromise();
    if (employees == undefined){
      return [];
    }
    return employees;
  }

  async getAllListNameId(): Promise<Array<Employee>> {

    const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees/list').toPromise();
    if(employees == undefined){
      return [];
    }
    return employees;
  }

  async add(employee: Employee): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/employees', employee).toPromise();
  }

  async update(employee: Employee): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/employees', employee).toPromise();
  }

  async delete(id: number): Promise<[]|undefined> {
    // @ts-ignore
    return this.http.delete('http://localhost:8080/employees/' + id).toPromise();
  }

  async getAllListDes(): Promise<Array<Employee>>{
    const employees = await this.http.get<Array<Employee>>('http://localhost:8080/employees/list/des').toPromise();
    if (employees == undefined){
      return [];
    }
    return employees;

  }


}
