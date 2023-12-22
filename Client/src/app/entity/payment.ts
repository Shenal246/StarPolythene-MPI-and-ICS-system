
import { Employee } from "./employee";
import { Paymentstatus } from "./paymentstatus";
import { Producttype } from "./producttype";

export class Payment {
  public id !: number;
  public date !: string;
  public amount !: number;
  public chequeno !: string;
  public time !: string;
  public dorealized !: string;
  public description !: string;
  public paymenttype !: Producttype;
  public paymentstatus !: Paymentstatus;
  public employee !: Employee;

  constructor(id:number, date:string, amount:number, chequeno:string, time:string, dorealized:string, description:string, paymenttype:Producttype, paymentstatus:Paymentstatus, employee:Employee) {
    this.id=id;
    this.date=date;
    this.amount=amount;
    this.chequeno=chequeno;
    this.time=time;
    this.dorealized=dorealized;
    this.description=description;
    this.paymenttype=paymenttype;
    this.paymentstatus=paymentstatus;
    this.employee=employee;
   
    
  }

}
