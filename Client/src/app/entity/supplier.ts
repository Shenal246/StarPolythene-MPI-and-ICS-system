import { Supplierstatus } from "./supplierstatus";
import { Supply } from "./supply";

export class Supplier {
  public id !: number;
  public name !: string;
  public tpnumber !: string;
  public contactperson !: string;
  public contactpersontp !: string;
  public address !: string;
  public email !: string;
  public regdate !: string;
  public supplierstatus !: Supplierstatus;
  public supplies !: Array<Supply>;

  constructor() {
  }

  // constructor(id:number, name:string, tpnumber:string, contactperson:string, contactpersontp:string, address:string, email:string, regdate:string, supplierstatus:Supplierstatus) {
  //   this.id=id;
  //   this.name=name;
  //   this.tpnumber=tpnumber;
  //   this.contactperson=contactperson;
  //   this.contactpersontp=contactpersontp;
  //   this.address=address;
  //   this.email=email;
  //   this.regdate=regdate;
  //   this.supplierstatus=supplierstatus;
  // }

}
