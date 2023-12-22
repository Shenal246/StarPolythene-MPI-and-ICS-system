import {Product} from "./product";

export class Proorderproduct{

  public id! : number;
  public product : Product;
  public qty!: number;
  constructor(id: number, product: Product, qty: number) {
    this.id = id;
    this.product = product;
    this.qty = qty;
  }

}
