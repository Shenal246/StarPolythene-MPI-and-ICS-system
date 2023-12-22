import { DatePipe } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Production } from 'src/app/entity/production'
import { ProductionService } from 'src/app/service/productionservice';
import { RegexService } from 'src/app/service/regexservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';
import {Productionproduct} from "../../../entity/productionproduct";
import {Employee} from "../../../entity/employee";
import {Proorder} from "../../../entity/proorder";
import {Product} from "../../../entity/product";
import {EmployeeService} from "../../../service/employeeservice";
import {ProductService} from "../../../service/productservice";
import {ProorderService} from "../../../service/proorderservice";

@Component({
  selector: 'app-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent {
  cols = '12';
  columns: string[] = ['date', 'employee', 'proorder'];
  headers: string[] = ['Date', 'Employee', 'Production Order'];
  binders: string[] = ['date', 'employee.callingname', 'proorder.code'];

  cscolumns: string[] = ['csdate', 'csemployee', 'csproorder'];
  csprompts: string[] = ['Search by Date', 'Search by Employee', 'Search by Production Order'];

  // Inner Table
  innercolumns: string[] = ['product', 'qty', 'remove'];
  innerheaders: string[] = ['Product', 'Quntity(Kg)','Remove'];
  innerbinders: string[] = ['product.code', 'qty','getBtn()'];
  productions: Array<Production> = [];

  imageurl: string = '';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  production!: Production;
  oldproduction!: Production|undefined;
  selectedrow: any;

  data!: MatTableDataSource<Production>;
  indata!: MatTableDataSource<Productionproduct>;
  innerdata!: any

  managers!: Employee[];

  oldinnerdata:any;

  @ViewChild(MatPaginator) Paginator!: MatPaginator;
  imageempurl: string= 'assets/defaultpol.jpg'

  praadd:boolean = false;
  praupd:boolean = false;
  pradel:boolean = false;

  employees: Array<Employee> = [];
  proorders: Array<Proorder> = [];
  products: Array<Product> = [];

  productionproducts: Array<Productionproduct> = [];
  regexes: any;

  unitprice = 0;

  uiassist:UiAssist;

  constructor(
              private fb: FormBuilder,
              private es: EmployeeService,
              private prs: ProorderService,
              private dg: MatDialog,
              private ps: ProductService,
              private pts: ProductionService,
              private rs: RegexService,
              private dp: DatePipe) {

    this.uiassist = new UiAssist(this);
    this.productionproducts = new Array<Productionproduct>();

    this.csearch = this.fb.group({
      "csdate": new FormControl(),
      "csemployee": new FormControl(),
      "csproorder": new FormControl()
    });


    this.ssearch = this.fb.group({
      "ssdate": new FormControl(),
      "ssemployee": new FormControl(),
      "ssproorder": new FormControl()
    });

    this.form = this.fb.group({
      "date": new FormControl('',[Validators.required]),
      "employee": new FormControl('',[Validators.required]),
      "proorder": new FormControl('',[Validators.required]),
    });

    this.innerform = this.fb.group({
      "product": new FormControl('',[Validators.required]),
      "qty": new FormControl('',[Validators.required]),

    }, {updateOn: 'change'});
  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.createView();
    this.ps.getAllList().then((prods: Product[]) => { this.products = prods; console.log("Mat-"+this.products); });
    this.es.getAllListDes().then((emps: Employee[]) => {
      this.employees = emps;
      this.managers = this.employees.filter(employee => employee.designation.id === 1);
    });
    this.prs.getAllList().then((pros: Proorder[]) => { this.proorders = pros; console.log("Mat-"+this.proorders); });
    // this.rs.get('production').then((regs: []) => {
    //   this.regexes = regs;
    //
    // });
    this.createForm();
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

  // Main Table
  loadTable(query: string){
    this.pts.getAll(query)
      .then((props: Production[]) => {
        this.productions = props;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.productions);
        this.data.paginator = this.Paginator;
      });
  }

  // Client Search
  filterTable(): void {
    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (production: Production, filter: string) => {

      return (csearchdata.csdate == null || production.date.toString().includes(csearchdata.csdate)) &&
        (csearchdata.csemployee == null || production.employee.callingname.toLowerCase().includes(csearchdata.csemployee.toLowerCase())) &&
        (csearchdata.csproorder == null || production.proorder.code.toLowerCase().includes(csearchdata.csproorder.toLowerCase())) ;


    };

    this.data.filter = 'xx';
  }

  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let date = ssearchdata.ssdate;
    let employeeid = ssearchdata.ssemployee;
    let proorderid = ssearchdata.ssproorder;

    if (date != null) {
      date = this.dp.transform(new Date(date),'yyyy-MM-dd');
    }

    let query = "";

    if (date != null && date.trim() != "") query = query + "&date=" + date;
    if (employeeid != null) query = query + "&employeeid=" + employeeid;
    if (proorderid != null) query = query + "&proorderid=" + proorderid;

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

  createForm(){
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['proorder'].setValidators([Validators.required]);

    this.innerform.controls['product'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {control.markAsTouched();});
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dointroduced")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
        if (this.oldproduction != undefined && control.valid) {
          // @ts-ignore
          if (value === this.production[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }

    // For Inner form
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
    this.loadForm();
  }

  loadForm(){
    this.oldproduction = undefined;
    this.form.reset();
    this.innerform.reset();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched(); });
    this.enableButtons(true,false,false);
    this.selectedrow =null;
  }

  id = 0;
  btnaddMC(){

    this.innerdata = this.innerform.getRawValue();

    if( this.innerdata != null){

      // let linecost = this.innerdata.quantity * this.innerdata.product.unitprice;

      let peroductproduct = new  Productionproduct(this.id,this.innerdata.qty,this.innerdata.product);

      let tem: Productionproduct[] = [];
      if(this.indata != null) this.indata.data.forEach((i:any) => tem.push(i));

      this.productionproducts = [];
      tem.forEach((t)=> this.productionproducts.push(t));

      this.productionproducts.push(peroductproduct);
      this.indata = new MatTableDataSource(this.productionproducts);

      this.id++;

      // this.calculateGrandTotal();
      this.innerform.reset();

    }

  }


  calculateGrandTotal(){
    // // console.log(this.unitprice)
    // this.unitprice = 0;
    //
    // this.indata.data.forEach((e:any)=>{
    //   this.unitprice = this.unitprice+e.linecost;
    // })
    // this.unitprice += ((this.unitprice * 10) / 100);
    // this.form.controls['unitprice'].setValue(this.unitprice);
  }

  deleteRaw(x:any) {

    let datasources = this.indata.data

    const index = datasources.findIndex((m:any)=> m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.productionproducts = this.indata.data;

    // this.calculateGrandTotal();
  }


  getBtn(element:Production){
    return `<button mat-raised-button>Modify</button>`;
  }


  // getModi(element: Production){
  //   return element.number + '(' + element.callingname + ')';
  // }

  add(){
    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Production Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.production = this.form.getRawValue();
      this.production.productionproducts = this.productionproducts;

      // @ts-ignore
      this.productionproducts.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.production.date = this.dp.transform(this.production.date,"yyyy-MM-dd");
      // @ts-ignore
      this.production.proorder.date = this.dp.transform(this.production.proorder.date,"yyyy-MM-dd");

      let invdata: string = "";

      invdata = invdata + "<br>Employee is : " + this.production.employee.callingname
      invdata = invdata + "<br>Production Order code is : " + this.production.proorder.code;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Production Add",
          message: "Are you sure to Add the following Product Issue? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          console.log(JSON.stringify(this.production));
          this.pts.add(this.production).then((responce: [] | undefined) => {
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
              data: {heading: "Status -Production Add", message: addmessage}
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

  fillForm(production: Production){
    this.enableButtons(false,true,true);

    this.selectedrow = production;

    this.production = JSON.parse(JSON.stringify(production));
    this.oldproduction = JSON.parse(JSON.stringify(production));

    // @ts-ignore
    this.production.employee = this.employees.find(g => g.id === this.production.employee.id);
    // @ts-ignore
    this.production.proorder = this.proorders.find(d => d.id === this.production.proorder.id);

    this.indata = new MatTableDataSource(this.production.productionproducts);

    this.form.patchValue(this.production);
    this.form.markAsPristine();
  }

  getUpdates(): string{
    let updates: string = "";
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }

    const productNames = this.indata.data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.product.name + ", "; }, "");

    if (productNames) {
      updates = updates + "<br>Products: " + productNames.slice(0, -1) + " Changed"; // Remove the trailing ", " from the productNames
    }

    return updates;
  }

  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Production Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Production Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.production = this.form.getRawValue();
            // @ts-ignore
            this.production.id = this.oldproduction.id;
            this.production.productionproducts = this.productionproducts;

            // @ts-ignore
            this.productionproducts.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.production.date = this.dp.transform(this.production.date,"yyyy-MM-dd");


            this.pts.update(this.production).then((responce: [] | undefined) => {
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
                this.indata.data=[];
                this.loadTable("");
              }
              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Production Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Production Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }

  delete() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Production Delete",
        message: "Are you sure to Delete folowing Production? <br> <br>" +
          this.production.date + "<br>" + this.production.employee.callingname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        this.pts.delete(this.production.id).then((responce: [] | undefined) => {
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
            data: {heading: "Status - Production Delete ", message: delmessage}
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

      }
    });
  }




}

