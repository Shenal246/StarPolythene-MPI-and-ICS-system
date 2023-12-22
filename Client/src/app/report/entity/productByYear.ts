export class ProductByYear{
  constructor(id: number,code: string, percentage: string,quantity:number) {
    this.id = id;
    this.code = code;
    this.quantity= quantity
    this.percentage = percentage;
  }

  public id! : number;
  public code! : string;
  public percentage! : string;
  public quantity! : number;

}
