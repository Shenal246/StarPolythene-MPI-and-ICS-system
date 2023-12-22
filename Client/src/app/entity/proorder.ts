import {Productstatus} from "./productstatus";
import {Employee} from "./employee";
import {Proorderproduct} from "./proorderproduct";

export class Proorder {

  public id! : number;
  public code! : string;
  public date! : string;
  public expdate! : string;
  public grandtotal! : number;
  public proorderstatus : Productstatus;
  public employee : Employee;
  public supervisor : Employee;
  public proorderproducts : Array<Proorderproduct>
  constructor(id: number, code: string, date: string, expdate: string, grandtotal: number, productstatus: Productstatus, employee: Employee, supervisor: Employee, proorderproducts: Array<Proorderproduct>) {
    this.id = id;
    this.code = code;
    this.date = date;
    this.expdate = expdate;
    this.grandtotal = grandtotal;
    this.proorderstatus = productstatus;
    this.employee = employee;
    this.supervisor = supervisor;
    this.proorderproducts = proorderproducts;
  }




}
