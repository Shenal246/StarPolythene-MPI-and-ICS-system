import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productdashboard} from "./entity/productdashboard";
import {Salesdashboard} from "./entity/salesdashboard";

@Injectable({
  providedIn: 'root'
})

export class Dashboardservice {

  constructor(private http: HttpClient) {  }

  async productdashboard(): Promise<Productdashboard> {

    const producttotal = await this.http.get<Productdashboard>('http://localhost:8080/dashboard/productdashboard').toPromise();
    if (producttotal == undefined) {
      // @ts-ignore
      return;
    } else {
      return producttotal;
    }
  }

  async salesdashboard(): Promise<Salesdashboard> {

    const salestotal = await this.http.get<Salesdashboard>('http://localhost:8080/dashboard/salesdashboard').toPromise();
    if (salestotal == undefined) {
      // @ts-ignore
      return;
    } else {
      return salestotal;
    }
  }

}


