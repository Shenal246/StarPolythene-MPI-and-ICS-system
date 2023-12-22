
import {Employee} from "./employee";
import {Proorder} from "./proorder";
import {Productionproduct} from "./productionproduct";

export class Production {
  public id !: number;
  public date !: string;
  public employee !: Employee;
  public proorder !: Proorder;
  public productionproducts !: Array<Productionproduct>;


  constructor(id:number, date:string, employee:Employee, proorder:Proorder, productionproducts:Array<Productionproduct>) {
    this.id=id;
    this.date=date;
    this.employee=employee;
    this.proorder=proorder;
    this.productionproducts=productionproducts;
  }

}
