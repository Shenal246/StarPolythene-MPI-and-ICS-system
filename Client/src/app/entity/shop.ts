import { Shopstatus } from "./shopstatus";

export class Shop {
  public id !: number;
  public name !: string;
  public address !: string;
  public tpnumber !: string;
  public email !: string;
  public contactperson !: string;
  public contactpno !: string;
  public dointroduced !: string;
  public creditlimit !: number;
  public shopstatus !: Shopstatus;

  constructor(id:number, name:string, address:string, tpnumber:string, email:string, contactperson:string, contactpno:string, dointroduced:string, creditlimit:number, shopstatus:Shopstatus) {
    this.id=id;
    this.name=name;
    this.address=address;
    this.tpnumber=tpnumber;
    this.email=email;
    this.contactperson=contactperson;
    this.contactpno=contactpno;
    this.dointroduced=dointroduced;
    this.creditlimit=creditlimit;
    this.shopstatus=shopstatus;
  }

}
