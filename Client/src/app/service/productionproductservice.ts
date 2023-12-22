import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Productionproductprogress} from "../entity/Productionproductprogress";

@Injectable({
  providedIn: 'root'
})
export class Productionproductservice {
  constructor(private http: HttpClient) { }

  async getAllList(query:String): Promise<Array<Productionproductprogress>>{
    const productionproductprogress = await this.http.get<Array<Productionproductprogress>>('http://localhost:8080/reports/productdeman'+query).toPromise();
    if (productionproductprogress == undefined){
      return [];
    }
    return productionproductprogress;

  }

}
