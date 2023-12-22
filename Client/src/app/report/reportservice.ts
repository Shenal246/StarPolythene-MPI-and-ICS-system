import {CountByDesignation} from "./entity/countbydesignation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Productdeman} from "./entity/productdeman";
import {Invoicebyshop} from "./entity/invoicebyshop";
import {ProductByYear} from "./entity/productByYear";
import {MaterialStockCount} from "./entity/materialStockCount";

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) {  }

  async countByDesignation(): Promise<Array<CountByDesignation>> {

    const countbydesignations = await this.http.get<Array<CountByDesignation>>('http://localhost:8080/reports/countbydesignation').toPromise();
    if(countbydesignations == undefined){
      return [];
    }
    return countbydesignations;
  }

  async productdeman(): Promise<Array<Productdeman>> {

    const prductdemans = await this.http.get<Array<Productdeman>>('http://localhost:8080/reports/productdeman').toPromise();
    if(prductdemans == undefined){
      return [];
    }
    return prductdemans;
  }

  async invoiveByShop(year:string): Promise<Array<Invoicebyshop>> {

    const invoiceshops = await this.http.get<Array<Invoicebyshop>>('http://localhost:8080/reports/invoicebyshop/'+year).toPromise();
    if(invoiceshops == undefined){
      return [];
    }
    return invoiceshops;
  }

  async productByYear(year:string): Promise<Array<ProductByYear>> {

    const products = await this.http.get<Array<ProductByYear>>('http://localhost:8080/reports/products/'+year).toPromise();
    if(products == undefined){
      return [];
    }
    return products;
  }

  async materialStockCount(): Promise<Array<MaterialStockCount>> {

    const materials = await this.http.get<Array<MaterialStockCount>>('http://localhost:8080/reports/materialcount').toPromise();
    if(materials == undefined){
      return [];
    }
    return materials;
  }

}


