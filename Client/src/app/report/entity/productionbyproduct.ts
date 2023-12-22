export class ProductionByProduct {

  public producttype!: string;
  public qty !: number;
  public percentage !: number;

  constructor(producttype:string, qty:number,percentage:number) {

    this.producttype = producttype;
    this.qty=qty;
    this.percentage=percentage;
  }

}
