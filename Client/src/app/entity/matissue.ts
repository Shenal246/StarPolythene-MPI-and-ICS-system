
import {Employee} from "./employee";
import {Matissuematerial} from "./matissuematerial";
import {Proorder} from "./proorder";

export class Matissue {
  public id !: number;
  public date !: string;
  public employee !: Employee;
  public proorder !: Proorder;
  public matissuematerials !: Array<Matissuematerial>;


  constructor(id:number, date:string, employee:Employee,proorder:Proorder, matissuematerials:Array<Matissuematerial>) {
    this.id=id;
    this.date=date;
    this.employee=employee;
    this.proorder=proorder;
    this.matissuematerials=matissuematerials;
  }

}
