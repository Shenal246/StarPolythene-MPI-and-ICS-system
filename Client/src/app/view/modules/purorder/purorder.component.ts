import { DatePipe } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RegexService } from 'src/app/service/regexservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';
import {Purorder} from "../../../entity/purorder";
import {Purordermaterial} from "../../../entity/purordermaterial";
import {Purorderstatusservice} from "../../../service/purorderstatusservice";
import {MaterialService} from "../../../service/materialservice";
import {PurorderService} from "../../../service/purorderservice";
import {SupplierService} from "../../../service/supplierservice";
import {EmployeeService} from "../../../service/employeeservice";
import {Purorderstatus} from "../../../entity/purorderstatus";
import {Material} from "../../../entity/material";
import {Supplier} from "../../../entity/supplier";
import {Employee} from "../../../entity/employee";
import {UserService} from "../../../service/userservice";
import {AuthorizationManager} from "../../../service/authorizationmanager";


@Component({
  selector: 'app-purorder',
  templateUrl: './purorder.component.html',
  styleUrls: ['./purorder.component.css']
})
export class PurorderComponent {

  columns: string[] = ['date', 'expectedcost','purorderstatus','supplier','employee'];
  headers: string[] = ['Date','Expected Cost', 'Purorder Status', 'Supplier', 'Employee'];
  binders: string[] = ['date', 'expectedcost','purorderstatus.name','supplier.name','employee.callingname'];

  cscolumns: string[] = ['csdate', 'csexpectedcost','cspurorderstatus','cssupplier','csemployee'];
  csprompts: string[] = ['Search by Date','Search by Expected Cost', 'Search by Status', 'Search by Supplier',
    'Search by Employee'];

  incolumns: string[] = ['name', 'qty', 'unitprice', 'explinetotal', 'remove'];
  inheaders: string[] = ['Material Name', 'Quantity', 'Unit Price', 'Expected Linetotal', 'Remove'];
  inbinders: string[] = ['material.name', 'qty', 'material.unitprice', 'explinetotal', 'getBtn()'];


  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  purorder!:Purorder;
  oldpurorder!:Purorder;

  innerdata:any;
  oldinnerdata:any;

  regexes:any;

  purorders: Array<Purorder> = [];
  data!: MatTableDataSource<Purorder>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  indata!:MatTableDataSource<Purordermaterial>

  suppliers: Array<Supplier> = [];
  employees: Array<Employee> = [];
  purorderstatuses: Array<Purorderstatus> = [];
  materials: Array<Material> = [];

  expectedcost = 0;

  managers!: Employee[];

  useremployee!: Employee;

  useremployeename!: string;

  selectedrow: any;

  purordermaterials:Array<Purordermaterial> = [];

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  uiassist: UiAssist;

  constructor(
    private fb:FormBuilder,
    private poss:Purorderstatusservice,
    private mts:MaterialService,
    private sus:SupplierService,
    private emps:EmployeeService,
    private pos:PurorderService,
    private dg:MatDialog,
    private dp:DatePipe
    // private us:UserService,
    // public authService: AuthorizationManager,
    // private rs:RegexService
  ) {

    this.uiassist = new UiAssist(this);
    this.purordermaterials = new Array<Purordermaterial>();

    this.csearch = this.fb.group({
      "csdate": new FormControl(),
      "csexpectedcost": new FormControl(),
      "cspurorderstatus": new FormControl(),
      "cssupplier": new FormControl(),
      "csemployee": new FormControl()
    });

    this.form = this.fb.group({
      "date": new FormControl('',Validators.required),
      "code": new FormControl('',Validators.required),
      "expectedcost": new FormControl('',Validators.required),
      "purorderstatus": new FormControl('',Validators.required),
      "supplier": new FormControl('',Validators.required),
      "employee": new FormControl('',Validators.required)
    }, {updateOn: 'change'});


    this.innerform = this.fb.group({
      "material": new FormControl('',Validators.required),
      "qty": new FormControl('',Validators.required),
    }, {updateOn: 'change'});


    this.ssearch = this.fb.group({
      "sssupplier": new FormControl(),
      "ssemployee": new FormControl(),
      "sspurorderstatus": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {

    this.createView();

    this.poss.getAllList().then((inst: Purorderstatus[]) => {
      this.purorderstatuses = inst;
    });

    this.mts.getListlist().then((mats: Material[]) => {
      this.materials = mats;
    });

    this.emps.getAllListDes().then((em: Employee[]) => {
      this.employees = em;
      this.managers = this.employees.filter(employee => employee.designation.id === 1);
    });

    this.sus.getAll("").then((su: Supplier[]) => {
      this.suppliers = su;
    });

    // this.rs.get('purorder').then((rgx:any[])=>{
    //   this.regexes = rgx;
    //   this.createForm();
    // }) ;

    // // @ts-ignore
    // this.us.getEmployee(this.authService.getUsername()).then((emp: Employee) => {
    //   this.useremployee = emp;
    //   this.useremployeename = this.useremployee.callingname;
    //   // console.log(this.useremployee);
    // });

    this.createForm();

  }


  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['code'].setValidators([Validators.required]);
    this.form.controls['expectedcost'].setValidators([Validators.required]);
    this.form.controls['purorderstatus'].setValidators([Validators.required]);
    this.form.controls['supplier'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);

    this.innerform.controls['material'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    this.form.controls['date'].setValue(this.dp.transform(Date.now(),'yyyy-MM-dd'));
    this.form.controls['date'].disable();
    // this.form.controls['employee'].setValue(this.useremployee?.callingname);


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldpurorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.purorder[controlName]) {
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


  loadTable(query: string) {

    this.pos.getAll(query)
      .then((invs: Purorder[]) => {
        this.purorders = invs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        // console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.purorders);
        this.data.paginator = this.paginator;
      });

  }

  getBtn(element:Purorder){
    return `<button mat-raised-button>Modify</button>`;
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (purorder: Purorder, filter: string) => {
      return(cserchdata.csdate == null || purorder.date.includes(cserchdata.csdate)) &&
        (cserchdata.csexpectedcost == null || purorder.expectedcost.toString().includes(cserchdata.csexpectedcost.toString())) &&
        (cserchdata.cspurorderstatus == null || purorder.purorderstatus.name.toLowerCase().includes(cserchdata.cspurorderstatus)) &&
        (cserchdata.cssupplier == null || purorder.supplier.name.toLowerCase().includes(cserchdata.cssupplier)) &&
        (cserchdata.csemployee == null || purorder.employee.callingname.toLowerCase().includes(cserchdata.csemployee)) ;
    };

    this.data.filter = 'xx';

  }


  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let supplierid = sserchdata.sssupplier;
    let employeeid = sserchdata.ssemployee;
    let statusid = sserchdata.sspurorderstatus;

    let query = "";

    if (supplierid != null) query = query + "&supplierid=" + supplierid;
    if (employeeid != null) query = query + "&employeeid=" + employeeid;
    if (statusid != null) query = query + "&statusid=" + statusid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }

  id = 0;

  btnaddMc() {

    this.innerdata = this.innerform.getRawValue();

    if( this.innerdata != null){

      let explinetotal = this.innerdata.qty * this.innerdata.material.unitprice;

      let purordermaterial = new  Purordermaterial(this.id,this.innerdata.qty,explinetotal,this.innerdata.material);

      let tem: Purordermaterial[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.purordermaterials = [];
      tem.forEach((t)=> this.purordermaterials.push(t));

      this.purordermaterials.push(purordermaterial);
      this.indata = new MatTableDataSource(this.purordermaterials);

      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  calculateGrandTotal(){

    this.expectedcost = 0;

    this.indata.data.forEach((e)=>{
      this.expectedcost = this.expectedcost+e.explinetotal
    })

    this.form.controls['expectedcost'].setValue(this.expectedcost);
  }

  deleteRaw(x:any) {

    // this.indata.data = this.indata.data.reduce((element) => element.id !== x.id);

    let datasources = this.indata.data

    const index = datasources.findIndex(material => material.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.purordermaterials = this.indata.data;

    this.calculateGrandTotal();
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Purorder Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.purorder = this.form.getRawValue();
      this.purorder.purordermaterials = this.purordermaterials;

      // @ts-ignore
      this.purordermaterials.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.purorder.date = this.dp.transform(this.purorder.date,"yyyy-MM-dd");

      let invdata: string = "";

      invdata = invdata + "<br>Supplier is : " + this.purorder.supplier.name;
      invdata = invdata + "<br>Employee is : " + this.purorder.employee.callingname;
      invdata = invdata + "<br>Expected Cost is : " + this.purorder.expectedcost;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Purorder Add",
          message: "Are you sure to Add the following Purorder? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.pos.add(this.purorder).then((responce: [] | undefined) => {

            if (responce != undefined) { // @ts-ignore
              // @ts-ignore
              addstatus = responce['errors'] == "";
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
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
              data: {heading: "Status -Purorder Add", message: addmessage}
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
  //
  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }
  //
  //
  fillForm(purorder: Purorder) {

    this.enableButtons(false,true,true);

    this.selectedrow=purorder;

    this.purorder = JSON.parse(JSON.stringify(purorder));
    this.oldpurorder = JSON.parse(JSON.stringify(purorder));

    //@ts-ignore
    this.purorder.supplier = this.suppliers.find(s => s.id === this.purorder.supplier.id);
    // @ts-ignore
    this.purorder.employee = this.employees.find(s => s.id === this.purorder.employee.id);
    // @ts-ignore
    this.purorder.purorderstatus = this.purorderstatuses.find(s => s.id === this.purorder.purorderstatus.id);

    this.indata = new MatTableDataSource(this.purorder.purordermaterials);

    this.form.patchValue(this.purorder);
    this.form.markAsPristine();
    this.calculateGrandTotal();

  }


  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }

    // const materialNames = this.indata.data.reduce((accumulator, currentValue) => {
    //   return accumulator + currentValue.material.name + ", "; }, "");
    //
    // if (materialNames) {
    //   updates = updates + "<br>Materials: " + materialNames.slice(0, -1) + " Changed"; // Remove the trailing ", " from the materialNames
    // }

    return updates;

  }


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Purchase Order Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Purorder Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.purorder = this.form.getRawValue();
            this.purorder.id = this.oldpurorder.id;
            this.purorder.purordermaterials = this.purordermaterials;

            // // @ts-ignore
            // delete this.purorder.quantity;
            //
            // // @ts-ignore
            // delete this.purorder.material;



            // @ts-ignore
            this.purordermaterials.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.purorder.date = this.dp.transform(this.purorder.date,"yyy-mm-dd");

            console.log("Purorders : " + JSON.stringify(this.purorder));
            this.pos.update(this.purorder).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Purorder Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Purchase Order Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }
  //
  //
  //
  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purchase Order Delete",
        message: "Are you sure to Delete following Purchase Order made on : <br> <br>" + this.purorder.date
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.pos.delete(this.purorder.id).then((responce: [] | undefined) => {

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
            this.indata.data = [];
            this.loadTable("");
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Purchase Order Delete ", message: delmessage}
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

  loadForm(){
    this.form.reset();
    this.innerform.reset();
    this.indata.data=[];

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched(); });
    this.enableButtons(true,false,false);
    this.selectedrow =null;
  }

  clear():void{

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purchase Order Clear",
        message: "Are you sure to Clear the Form? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.loadForm();
        this.createForm();
      }
    });

  }

}
