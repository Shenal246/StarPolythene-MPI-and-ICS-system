
import { Purorderstatus } from "./purorderstatus";
import {Employee} from "./employee";
import {Purordermaterial} from "./purordermaterial";
import {Supplier} from "./supplier";

export class Purorder {
  public id !: number;
  public code !: string;
  public date !: string;
  public expectedcost !: number;
  public purorderstatus !: Purorderstatus;
  public employee !: Employee;
  public supplier !: Supplier;
  public purordermaterials !: Array<Purordermaterial>;


  constructor(id:number,code:string, date:string, expectedcost:number, purorderstatus:Purorderstatus, employee:Employee, supplier:Supplier, purordermaterials:Array<Purordermaterial>) {
    this.id=id;
    this.code=code;
    this.date=date;
    this.expectedcost=expectedcost;
    this.purorderstatus=purorderstatus;
    this.employee=employee;
    this.supplier=supplier;
    this.purordermaterials=purordermaterials;
  }

}
