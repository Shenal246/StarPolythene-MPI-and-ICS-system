export class MaterialStockCount{
  constructor(code: string, percentage: string,quantity:number,unitprice:number) {
    this.code = code;
    this.quantity= quantity;
    this.unitprice= unitprice;
    this.percentage = percentage;
  }

  public code! : string;
  public percentage! : string;
  public quantity! : number;
  public unitprice! : number;

}
