import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {Proorder} from "../../../entity/proorder";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Proorderproduct} from "../../../entity/proorderproduct";
import {Employee} from "../../../entity/employee";
import {Proorderstatus} from "../../../entity/proorderstatus";
import {Product} from "../../../entity/product";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {RegexService} from "../../../service/regexservice";
import {EmployeeService} from "../../../service/employeeservice";
import {Proorderstatusservice} from "../../../service/proorderstatusservice";
import {ProductService} from "../../../service/productservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {ProorderService} from "../../../service/proorderservice";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {UserService} from "../../../service/userservice";

@Component({
  selector: 'app-proorder',
  templateUrl: './proorder.component.html',
  styleUrls: ['./proorder.component.css']
})
export class ProorderComponent implements OnInit{

  columns: string[] = ['code','date','expdate', 'manager', 'supervisor','proorderstatus'];
  headers: string[] = ['Code','Date', 'Expire Date', 'Manager', 'Supervisor','Product order Status'];
  binders: string[] = ['code','date', 'expdate', 'employee.callingname', 'supervisor.callingname','proorderstatus.name'];

  incolumns: string[] = ['code', 'quantity', 'unitprice', 'remove'];
  inheaders: string[] = ['Code', 'Quantity', 'Unit Price', 'Remove'];
  inbinders: string[] = ['product.code','qty','product.unitprice','getBtn()'];

  cscolumns: string[] = ['cscode', 'csdate', 'csexpdate', 'csemployee', 'cssupervisor', 'csproorderstatus'];
  csprompts: string[] = ['Search by Code', 'Search by Date', 'Search by ExpDate', 'Search by Manager',
    'Search by Supervisor', 'Search by Status'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  proorder!:Proorder;
  oldproorder!:Proorder;

  innerdata:any;
  oldinnerdata:any;

  regexes:any;

  proorders: Array<Proorder> = [];
  data!: MatTableDataSource<Proorder>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  indata!:MatTableDataSource<Proorderproduct>

  employees: Array<Employee> = [];
  supervisors: Array<Employee> = [];
  proorderstatuses: Array<Proorderstatus> = [];
  products!: Product[];

  selectedrow: any;
  managers!: Employee[];
  supervisorss!: Employee[];

  manager!: Employee;

  proorderproducts:Array<Proorderproduct> = [];

  uiassist: UiAssist;
  useremployee!: Employee;
  useremployeename!: string;

  constructor(
    private fb:FormBuilder,
    private prost:Proorderstatusservice,
    private es:EmployeeService,
    private ps:ProductService,
    private pros:ProorderService,
    private dg:MatDialog,
    private dp:DatePipe,
    private rs:RegexService,
    private us:UserService,
    public authService: AuthorizationManager

  ) {

    this.uiassist = new UiAssist(this);
    this.proorderproducts = new Array<Proorderproduct>();

    this.csearch = this.fb.group({
      "csdate": new FormControl(),
      "cscode": new FormControl(),
      "csexpdate": new FormControl(),
      "csemployee": new FormControl(),
      "cssupervisor": new FormControl(),
      "csproorderstatus": new FormControl()
    });

    this.form = this.fb.group({
      "employee": new FormControl('',Validators.required),
      "supervisor": new FormControl('',Validators.required),
      "code": new FormControl('',[Validators.required,Validators.pattern("^[A-Z]{2}\\d{3}$")]),
      "date": new FormControl('',Validators.required),
      "expdate": new FormControl('',Validators.required),
      "proorderstatus": new FormControl('',Validators.required),
      "grandtotal": new FormControl('',Validators.required),
    }, {updateOn: 'change'});

    this.innerform = this.fb.group({
      "product": new FormControl('',Validators.required),
      "quantity": new FormControl('',Validators.required),
    }, {updateOn: 'change'});

    this.ssearch = this.fb.group({
      "ssemployee": new FormControl(),
      "sssupervisor": new FormControl(),
      "ssproorderstatus": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.prost.getAllList().then((prost: Proorderstatus[]) => {
      this.proorderstatuses = prost;
    });

    this.es.getAllListDes().then((emps: Employee[]) => {
      this.employees = emps;
      this.supervisors = emps;
      this.managers = this.employees.filter(employee => employee.designation.id === 1);
      this.supervisorss = this.supervisors.filter(employee => employee.designation.id === 2);
    });

    this.ps.getAll("").then((products: Product[]) => {
      this.products = products;
    });

    // @ts-ignore
    this.us.getEmployee(this.authService.getUsername()).then((emp: Employee) => {
      this.useremployee = emp;
      this.useremployeename = this.useremployee.callingname;
      // console.log(this.useremployee);
    });

    this.createForm();

  }

  createForm() {

    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['supervisor'].setValidators([Validators.required]);
    this.form.controls['code'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required,this.validateExpDate()]);
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['expdate'].setValidators([Validators.required,this.validateExpDate()]);
    this.form.controls['proorderstatus'].setValidators([Validators.required]);

    this.innerform.controls['product'].setValidators([Validators.required]);
    this.innerform.controls['quantity'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.innerform.controls).forEach(control => {
      control.markAsTouched();
    });

    this.form.controls['date'].setValue(this.dp.transform(Date.now(),'yyyy-MM-dd'));
    this.form.controls['date'].disable();
    // this.form.controls['employee'].disable();
    // this.form.controls['employee'].clearValidators();
    // this.form.controls['employee'].value = this.authService.getUsername();

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
          if (controlName == "expdate")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldproorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.proorder[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldinnerdata != undefined && control.valid) {
            // @ts-ignore
            if (value === this.innerdata[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    this.enableButtons(true,false,false);

  }

  validateExpDate(): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } | null => {

      // @ts-ignore
      const date1 = new Date(control.parent.get('date')?.value);
      // @ts-ignore
      const date2 = new Date(control.parent.get('expdate')?.value);

      if(date1.getTime() > date2.getTime()-(24*3600*3*1000))
        return { 'dateNotEqualToday': true };
      else
        return null;
    }

  }

  // dateValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const selectedDate = new Date(control.value);
  //     const today = new Date();
  //
  //     today.setHours(0, 0, 0, 0);
  //     selectedDate.setHours(0, 0, 0, 0);
  //
  //     if (control.parent) {
  //       const expdateControl = control.parent.get('expdate');
  //       const createControl = control.parent.get('docreated');
  //       if (expdateControl && createControl) {
  //         const expdate = new Date(expdateControl.value);
  //         const docdate = new Date(createControl.value);
  //         expdate.setHours(0, 0, 0, 0);
  //         docdate.setHours(0, 0, 0, 0);
  //
  //         if (control === createControl) {
  //           // Validate Date of Create
  //           return selectedDate.getTime() === today.getTime() ? null : { invalidDate: true };
  //         } if (control === expdateControl) {
  //           // Validate Date of Expire
  //           return docdate.getTime() <= expdate.getTime() - (24*3600*3*1000) ? null : { invalidDate: true };
  //         }
  //       }
  //     }
  //
  //     return null;
  //   };
  // }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.pros.getAll(query)
      .then((proords: Proorder[]) => {
        this.proorders = proords;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error: any) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.proorders);
        this.data.paginator = this.paginator;
      });

  }

  getBtn(element:Proorder){
    return `<button mat-raised-button>Modify</button>`;
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (proorder: Proorder, filter: string) => {
      return(cserchdata.cscode == null || proorder.code.includes(cserchdata.cscode)) &&
        (cserchdata.csdate == null || proorder.date.includes(cserchdata.csdate)) &&
        (cserchdata.csexpdate == null || proorder.expdate.includes(cserchdata.csexpdate)) &&
        (cserchdata.csemployee == null || proorder.employee.callingname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.cssupervisor == null || proorder.supervisor.callingname.toLowerCase().includes(cserchdata.cssupervisor.toLowerCase())) &&
        (cserchdata.csproorderstatus == null || proorder.proorderstatus.name.toLowerCase().includes(cserchdata.csproorderstatus.toLowerCase()));
    };

    this.data.filter = 'xx';

  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let employee = ssearchdata.ssemployee;
    let supervisor = ssearchdata.sssupervisor;
    let proorderstatusid = ssearchdata.ssproorderstatus;

    let query = "";

    if (employee != null && employee.trim() !== "") query = query + "&employee=" + employee;
    if (supervisor != null && supervisor.trim() !== "") query = query + "&supervisor=" + supervisor;
    if (proorderstatusid != null) query = query + "&statusid=" + proorderstatusid;

    if (query != "") query = query.replace(/^./,"?")
    this.loadTable(query);
  }

  btnSearchClearMc(): void{

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

    id = 0;

  btnaddMc() {

    this.innerdata = this.innerform.getRawValue();

    if( this.innerdata != null){

      let linetotal = this.innerdata.quantity * this.innerdata.product.unitprice;

      let proorderproduct = new Proorderproduct(this.id,this.innerdata.product,this.innerdata.quantity);

      let tem: Proorderproduct[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.proorderproducts = [];
      tem.forEach((t)=> this.proorderproducts.push(t));

      this.proorderproducts.push(proorderproduct);
      this.indata = new MatTableDataSource(this.proorderproducts);

      console.log(this.indata.data)
      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  deleteRaw(x:any) {

    // this.indata.data = this.indata.data.reduce((element) => element.id !== x.id);

    let datasources = this.indata.data

    const index = datasources.findIndex(item => item.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.proorderproducts = this.indata.data;

    this.calculateGrandTotal();
  }

  calculateGrandTotal(){

    let grandtotal = 0;

    this.indata.data.forEach((e)=>{
      grandtotal = grandtotal +( (e.product.unitprice) * e.qty )
    })

    this.form.controls['grandtotal'].setValue(grandtotal);
  }

  fillForm(proorder: Proorder) {

    this.enableButtons(false,true,true);

    this.selectedrow=proorder;

    this.proorder = JSON.parse(JSON.stringify(proorder));
    this.oldproorder = JSON.parse(JSON.stringify(proorder));

    this.form.controls['grandtotal'].clearValidators();

    // @ts-ignore
    this.proorder.employee = this.employees.find(c => c.id === this.proorder.employee.id);
     //@ts-ignore
    this.proorder.supervisor = this.employees.find(c => c.id === this.proorder.supervisor.id);
    //@ts-ignore
    this.proorder.proorderstatus = this.proorderstatuses.find(s => s.id === this.proorder.proorderstatus.id);

    this.indata = new MatTableDataSource(this.proorder.proorderproducts);
    // console.log(this.indata);

    this.form.patchValue(this.proorder);
    this.form.markAsPristine();
    this.calculateGrandTotal();

  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }

  add() {

    console.log(this.form.controls['expdate'].valid);
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Production Order Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.proorder = this.form.getRawValue();
      this.proorder.proorderproducts = this.proorderproducts;

      // @ts-ignore
      this.proorderproducts.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.proorder.date = this.dp.transform(this.proorder.date,"yyy-mm-dd");
      // @ts-ignore
      this.proorder.expdate = this.dp.transform(this.proorder.expdate,"yyy-mm-dd");

      let invdata: string = "";

      invdata = invdata + "<br>Manager is : " + this.proorder.employee.callingname
      // invdata = invdata + "<br>Grand Total is : " + this.proorder..grandtotal;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Product Order Add",
          message: "Are you sure to Add the following Invoice? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");
          this.pros.add(this.proorder).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              this.innerform.reset();
              this.indata.data = [];
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Invoice Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }
  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;

  }


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Product Order Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Product Order Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.proorder = this.form.getRawValue();

            // // @ts-ignore
            // delete this.proorder.quantity;

            // @ts-ignore
            // delete this.proorder.proorderproducts;

            this.proorder.proorderproducts = this.proorderproducts;
            this.proorder.id = this.oldproorder.id;

            // @ts-ignore
            this.proorderproducts.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.proorder.date = this.dp.transform(this.proorder.date,"yyyy-MM-dd"); // @ts-ignore
            this.proorder.expdate = this.dp.transform(this.proorder.expdate,"yyyy-MM-dd");

            // console.log(JSON.stringify(this.proorder));
            this.pros.update(this.proorder).then((responce: [] | undefined) => {
              //console.log("Res-" + responce);
              // console.log("Un-" + responce == undefined);
              if (responce != undefined) { // @ts-ignore
                //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
                // @ts-ignore
                updstatus = responce['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
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
                this.form.reset();
                this.innerform.reset();
                this.indata.data = [];
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Product Order Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Product Order Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }


  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Product Order Delete",
        message: "Are you sure to Delete following Prodcut Order? <br> <br>" + this.proorder.code
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.pros.delete(this.proorder.code).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.innerform.reset();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Product Order Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => {
            if (!result) {
              return;
            }
          });

        });
      }
    });
  }

  clear():void{

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Product Order Clear",
        message: "Are you sure to Clear the Form? <br> <br>" + this.proorder.code
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.indata.data = [];

      }
    });

  }

}
