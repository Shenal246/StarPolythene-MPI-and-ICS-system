
export class Productdeman{

  public id!:number;
  public qty2021!:number;
  public qty2022!:number;
  public prductid!:number;
  public prductname!:string;
  public code!:string;
  public increase!:number;

  constructor(qty2021:number,qty2022:number,prductid:number,prductname:string,code:string,increase:number) {
    this.qty2021 = qty2021;
    this.qty2022 = qty2022;
    this.prductid = prductid;
    this.prductname = prductname;
    this.code = code;
    this.increase = increase;
  }

}
