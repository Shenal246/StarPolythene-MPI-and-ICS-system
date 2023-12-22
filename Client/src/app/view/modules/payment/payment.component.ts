import { DatePipe } from '@angular/common';
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/entity/employee';
import { Payment } from 'src/app/entity/payment';
import { Paymentstatus } from 'src/app/entity/paymentstatus';
import { Paymenttype } from 'src/app/entity/paymenttype';
import { EmployeeService } from 'src/app/service/employeeservice';
import { PaymentService } from 'src/app/service/paymentservice';
import { Paymentstatuseservice } from 'src/app/service/paymentstatusservice';
import { Paymenttypeservice } from 'src/app/service/paymenttypeservice';
import { RegexService } from 'src/app/service/regexservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  cols = '12';
  columns: string[] = ['date', 'amount', 'chequeno', 'dorealized', 'paymentstatus','employee'];
  headers: string[] = ['Date', 'Amount(Rs)', 'Cheque No', 'Date of Realized', 'Payment Status', 'Payment done by'];
  binders: string[] = ['date', 'amount', 'chequeno', 'dorealized', 'paymentstatus.name', 'employee.callingname'];

  cscolumns: string[] = ['csdate', 'csamount', 'cschequeno', 'csdorealized', 'cspaymentstatus', 'csemployee'];
  csprompts: string[] = ['Search by Date', 'Search by Amount', 'Search by Cheque No', 'Search by Date of Realized',
    'Search by Payment Status', 'Search By Employee'];
  payments: Array<Payment> = [];

  imageurl: string = '';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  payment!: Payment;
  oldpayment!: Payment|undefined;
  selectedrow: any;

  // selectedTime: string;

  data!: MatTableDataSource<Payment>;

  @ViewChild(MatPaginator) Paginator!: MatPaginator;
  imageempurl: string= 'assets/defaultpol.jpg'

  praadd:boolean = false;
  praupd:boolean = false;
  pradel:boolean = false;


  paymentstatuses: Array<Paymentstatus> = [];
  paymenttypes: Array<Paymenttype> = [];
  employees: Array<Employee> = [];
  regexes: any;

  uiassist:UiAssist;

  constructor(private ps: PaymentService, private fb: FormBuilder, private dg: MatDialog, private pss: Paymentstatuseservice, private pts: Paymenttypeservice, private es: EmployeeService, private rs: RegexService, private dp: DatePipe) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csdate": new FormControl(),
      "csamount": new FormControl(),
      "cschequeno": new FormControl(),
      "csdorealized": new FormControl(),
      "cspaymentstatus": new FormControl(),
      "csemployee": new FormControl()
    });


    this.ssearch = this.fb.group({
      "ssdate": new FormControl(),
      "sschequeno": new FormControl(),
      "ssdorealized": new FormControl(),
      "sspaymentstatus": new FormControl()
    });

    this.form = this.fb.group({
      "date": new FormControl('',[Validators.required]),
      "amount": new FormControl('',[Validators.required]),
      "chequeno": new FormControl('',[Validators.required]),
      "time": new FormControl('',[Validators.required]),
      "dorealized": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "paymenttype": new FormControl('',[Validators.required]),
      "paymentstatus": new FormControl('',[Validators.required]),
      "employee": new FormControl('',[Validators.required]),

    });
  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.createView();

    this.pss.getAllList().then((prsts: Paymentstatus[]) => { this.paymentstatuses = prsts; console.log("Pss-"+this.paymentstatuses); });
    this.pts.getAllList().then((pts: Paymenttype[]) => { this.paymenttypes = pts; console.log("Pts-"+this.paymenttypes); });
    this.es.getAllListDes().then((thicks: Employee[]) => { this.employees = thicks; console.log("Em-"+this.employees); });
    this.rs.get('payment').then((regs: []) => { this.regexes = regs; this.createForm();});
    this.createSearch();

  }

  createView(){
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createSearch(){

  }

  enableButtons(add:boolean, upd:boolean, del: boolean){
    this.praadd = add;
    this.praupd = upd;
    this.pradel = del;
  }

  createForm(){
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['amount'].setValidators([Validators.required,Validators.pattern(this.regexes['amount']['regex'])]);
    this.form.controls['chequeno'].setValidators([Validators.required,Validators.pattern(this.regexes['chequeno']['regex'])]);
    this.form.controls['time'].setValidators([Validators.required]);
    this.form.controls['dorealized'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['paymenttype'].setValidators([Validators.required]);
    this.form.controls['paymentstatus'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

    //Object.values(this.form.controls).forEach(control => {control.markAsTouched();});

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="date" || controlName=="dorealized")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
        if (this.oldpayment != undefined && control.valid) {
          // @ts-ignore
          if (value === this.payment[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    //this.enableButtons(true,false,false);
    this.loadForm();
  }

  // Load the form for the original one
  loadForm(){
    this.oldpayment = undefined;
    this.form.reset();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched(); });
    this.enableButtons(true,false,false);
    this.selectedrow =null;
  }

  //Load data to the table
  loadTable(query: string){
    this.ps.getAll(query)
      .then((props: Payment[]) => {
        this.payments = props;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.payments);
        this.data.paginator = this.Paginator;
      });
  }

  // Client side search
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (payment: Payment, filter: string) => {
      return (csearchdata.csdate == null || payment.date.includes(csearchdata.csdate)) &&
        (csearchdata.csamount == null || payment.amount.toString().includes(csearchdata.csamount)) &&
        (csearchdata.cschequeno == null || payment.chequeno.includes(csearchdata.cschequeno)) &&
        (csearchdata.csdorealized == null || payment.dorealized.includes(csearchdata.csdorealized)) &&
        (csearchdata.cspaymentstatus == null || payment.paymentstatus.name.toLowerCase().includes(csearchdata.cspaymentstatus.toLowerCase())) &&
        (csearchdata.csemployee == null || payment.employee.callingname.toLowerCase().includes(csearchdata.csemployee.toLowerCase())) ;

    };

    this.data.filter = 'xx';
  }

  // Server Side search
  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let date = ssearchdata.ssdate;
    let chequeno = ssearchdata.sschequeno;
    let dorealized = ssearchdata.ssdorealized;
    let paymentstatusid = ssearchdata.sspaymentstatus;

    if (date != null) {
      date = this.dp.transform(new Date(date),'yyyy-MM-dd');
    }
    if (dorealized != null) {
      dorealized = this.dp.transform(new Date(dorealized),'yyyy-MM-dd');
    }

    let query = "";

    if (date != null && date.trim() != "") query = query + "&date=" + date;
    if (chequeno != null && chequeno.trim() != "") query = query + "&chequeno=" + chequeno;
    if (dorealized != null && dorealized.trim() != "") query = query + "&dorealized=" + dorealized;
    if (paymentstatusid != null) query = query + "&paymentstatusid=" + paymentstatusid

    if (query != "") query = query.replace(/^./,"?")
    this.loadTable(query);
  }

  btnSearchClearMe(): void{

    const confirm = this.dg.open(ConfirmComponent,{
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure you want to clear the search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result){
        this.ssearch.reset();
        this.loadTable("");
      }
    });
  }

  // Add Payment details
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Payment Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.payment = this.form.getRawValue();

      //time
      // @ts-ignore
      const timefiledvalue = document.getElementById("selectedTime").value;

      const timeComponent = timefiledvalue.split(":");
      const hour = timeComponent[0];
      const minitues = timeComponent[1];
      const seconds = "00";

      this.payment.time = `${hour}:${minitues}:${seconds}`;

      console.log(this.payment);
      let paymentdata: string = "";

      paymentdata = paymentdata + "<br>Date is : "+ this.payment.date;
      paymentdata = paymentdata + "<br>Cheque No is : "+ this.payment.chequeno;
      paymentdata = paymentdata + "<br>Amount is : "+ this.payment.amount;
      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Payment Add",
          message: "Are you sure to Add the folowing Payment? <br> <br>"+ paymentdata}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("PaymentService.add(emp)");
          this.ps.add(this.payment).then((responce: []|undefined) => {
            console.log("Res-"+responce);
            console.log("Un-"+responce==undefined);
            if(responce!=undefined){ // @ts-ignore
              console.log("Add-"+responce['id']+"-"+responce['url']+"-"+(responce['errors']==""));
              // @ts-ignore
              addstatus = responce['errors']=="";
              console.log("Add Sta-"+addstatus);
              if(!addstatus) { // @ts-ignore
                addmessage=responce['errors'];
              }
            }
            else{
              console.log("undefined");
              addstatus=false;
              addmessage="Content Not Found"
            }
          }).finally( () =>{
            if(addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              this.loadTable("");
            }
            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Payment Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => { if (!result) { return;} }) ;} );
        }
      });
    }
  }



  getErrors(){
    let errors: string = '';
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      if (control.errors){
        if (this.regexes[controlName]!=undefined){
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        }else{
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    return errors;
  }

  fillForm(payment: Payment){
    this.enableButtons(false,true,true);

    this.selectedrow = payment;

    this.payment = JSON.parse(JSON.stringify(payment));
    this.oldpayment = JSON.parse(JSON.stringify(payment));


    // @ts-ignore
    this.payment.paymentstatus = this.paymentstatuses.find(p => p.id === this.payment.paymentstatus.id);
    // @ts-ignore
    this.payment.paymenttype = this.paymenttypes.find(p => p.id === this.payment.paymenttype.id);
    // @ts-ignore
    this.payment.employee = this.employees.find(p => p.id === this.payment.employee.id);

    this.form.patchValue(this.payment);
    this.form.markAsPristine();
  }

  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Payment Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    } else {
      let updates: string = this.getUpdates();
      if (updates != "") {
        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";
        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Payment Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.payment = this.form.getRawValue();

            // @ts-ignore
            this.payment.id = this.oldpayment.id;
            this.ps.update(this.payment).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                // @ts-ignore
                updstatus = responce['errors'] == "";

                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.loadForm();
                this.loadTable("");
              }
              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Payment Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Payment Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }



  getUpdates(): string{
    let updates: string = "";
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }

  delete() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Payment Delete",
        message: "Are you sure to Delete folowing Payment record? <br> <br>" +
          "Payment Date :   "+this.payment.date + " <br> Cheque No. :  " + this.payment.chequeno + "<br> Paied Amount : " + this.payment.amount
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        this.ps.delete(this.payment.id).then((responce: [] | undefined) => {
          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.loadForm();
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Payment Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

  clear() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clear Form",
        message: "Are you sure to Clear the form? <br> <br> You will lost your updates"
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.loadForm();
        // this.oldpayment = undefined;
        // this.form.reset();
        // this.clearImage();
        // Object.values(this.form.controls).forEach(control => {
        //   control.markAsTouched(); });
        // this.enableButtons(true,false,false);
        // this.selectedrow =null;
      }
    });
  }




}

