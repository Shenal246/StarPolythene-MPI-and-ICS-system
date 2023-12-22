export class Invoicebyshop {
    constructor(id: number, date: string, invoiceyear: string, totalgrandtotal: number, shop: string, percentage: string) {
        this.id = id;
        this.date = date;
        this.invoiceyear = invoiceyear;
        this.totalgrandtotal = totalgrandtotal;
        this.shop = shop;
        this.percentage = percentage;
    }

  public id!:number;
  public date!:string;
  public invoiceyear!:string;
  public totalgrandtotal!:number;
  public shop!:string;
  public percentage!:string


}
