
export class Productqty {
  public id !: number;
  public code !: string;
  public qty !: number;


  constructor(id:number, code:string, qty:number) {
    this.id=id;
    this.code=code;
    this.qty=qty;
  }

}
