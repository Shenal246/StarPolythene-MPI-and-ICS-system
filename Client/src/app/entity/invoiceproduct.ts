
import {Product} from "./product";

export class Invoiceproduct {

  public id!:number;
  public  product:Product;
  public qty !: number;
  public linetotal !: number;

  constructor(id:number,product:Product,qty:number,linetotal:number) {
    this.id = id;
    this.product = product;
    this.qty = qty;
    this.linetotal = linetotal;
  }

}


