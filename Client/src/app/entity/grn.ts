import {Employee} from "./employee";
import {Purorder} from "./purorder";
import {Grnstatus} from "./grnstatus";
import {Grnmaterial} from "./grnmaterial";

export class Grn {
  public id !: number;
  public employee !: Employee;
  public purorder !: Purorder;
  public  grandtotal!:number;
  public grnmaterials!:Array<Grnmaterial>;
  public date!:string;
  public time!:string;
  public grnstatus!:Grnstatus;
  public description!:string;

  constructor(id: number, name: string,employee:Employee,purorder:Purorder,grandtotal:number,
              grnmaterials:Array<Grnmaterial>, date:string, time:string,grnstatus:Grnstatus,description:string) {
    this.id = id;
    this.employee = employee;
    this.purorder = purorder;
    this.grandtotal = grandtotal;
    this.grnmaterials = grnmaterials;
    this.date = date;
    this.time = time;
    this.grnstatus = grnstatus;
    this.description = description;
  }
}
