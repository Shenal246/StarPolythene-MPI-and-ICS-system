export class Productionprogress {

  public producttype!: string;
  public qty2021 !: number;
  public qty2022 !: number;
  //public percentage !: number;

  constructor(producttype:string, qty2021:number, qty2022:number) {

    this.producttype = producttype;
    this.qty2021 = qty2021;
    this.qty2022=qty2022;
    //this.percentage=percentage;
  }

}
