import {Shop} from "./shop";
import {Invoicestatus} from "./invoicestatus";
import {Product} from "./product";
import {Invoiceproduct} from "./invoiceproduct";

export class Invoice {

  public id !: number;
  public name !: string;
  public date !: string;
  public time !: string;
  public grandtotal !: number;
  public invoiceproducts!:Array<Invoiceproduct>;
  public shop!:Shop;
  public invoicestatus!:Invoicestatus;

  constructor(id:number,name:string,date:string,time:string,grandtotal:number,
              invoiceproducts:Array<Invoiceproduct>,shop:Shop,invoicestatus:Invoicestatus) {
    this.id=id;
    this.name=name;
    this.date = date;
    this.time = time;
    this.grandtotal = grandtotal;
    this.invoiceproducts = invoiceproducts;
    this.shop = shop;
    this.invoicestatus = invoicestatus;
  }

}
