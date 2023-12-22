import {Product} from "./product";

export class Productionproductprogress{

  public id! : number;
  public qtyStartYear! : number;
  public qtyEndYear! : number;
  public code! : string;
  public increase! : number;
  public product!: Product;
  public prductName! : string;

  constructor(id: number, qtyStartYear: number, qtyEndYear: number, code: string, increase: number, product: Product, prductName: string) {
    this.id = id;
    this.qtyStartYear = qtyStartYear;
    this.qtyEndYear = qtyEndYear;
    this.code = code;
    this.increase = increase;
    this.product = product;
    this.prductName = prductName;
  }

}
