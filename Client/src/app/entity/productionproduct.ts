import { Material } from "./material";
import {Product} from "./product";

export class Productionproduct {
  public id !: number;
  public qty !: number;
  public product !: Product;


  constructor(id:number, qty:number,  product:Product) {
    this.id=id;
    this.qty=qty;
    this.product=product;
  }

}
