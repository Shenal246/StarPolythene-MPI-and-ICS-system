import { Materialcategory } from "./materialcategory";
import { Materialstatus } from "./materialstatus";

export class Material {
  public id !: number;
  public code !: string;
  public name !: string;
  public qty !: number;
  public rop !: number;
  public unitprice !: number;
  public description !: string;
  public dointroduced !: string;
  public photo !: string;
  public materialcategory !: Materialcategory;
  public materialstatus !: Materialstatus;

  constructor() {
  }

  // constructor(id:number, code:string, name:string, qty:number, rop:number, unitprice:number, description:string, dointroduced:string, photo:string, materialcategory:Materialcategory, materialstatus:Materialstatus) {
  //   this.id=id;
  //   this.code=code;
  //   this.name=name;
  //   this.qty=qty;
  //   this.rop=rop;
  //   this.unitprice=unitprice;
  //   this.description=description;
  //   this.dointroduced=dointroduced;
  //   this.photo=photo;
  //   this.materialcategory=materialcategory;
  //   this.materialstatus=materialstatus;
  // }

}
