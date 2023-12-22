import {Component, ViewChild} from '@angular/core';
import {Grn} from "../../../entity/grn";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Grnservice} from "../../../service/grnservice";
import {Grnstatusservice} from "../../../service/grnstatusservice";
import {Grnstatus} from "../../../entity/grnstatus";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {EmployeeService} from "../../../service/employeeservice";
import {Employee} from "../../../entity/employee";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Purorder} from "../../../entity/purorder";
import {PurorderService} from "../../../service/purorderservice";
import {MaterialService} from "../../../service/materialservice";
import {Material} from "../../../entity/material";
import {Grnmaterial} from "../../../entity/grnmaterial";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Purordermaterial} from "../../../entity/purordermaterial";

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.css']
})
export class GrnComponent {

  columns: string[] = ['employee', 'purorder', 'grandtotal', 'date', 'time', 'grnstatus','description'];
  headers: string[] = ['Store Keeper', 'Purordered Date', 'Grand Total', 'Received Date', 'Received Time', 'GRN Status','Description'];
  binders: string[] = ['employee.callingname', 'purorder.date', 'grandtotal', 'date', 'time', 'grnstatus.name','description'];

  cscolumns: string[] = ['csemployee', 'cspurorder', 'csgrandtotal', 'csdate', 'cstime', 'csgrnstatus','csdescription'];
  csprompts: string[] = ['Search by Store Keeper', 'Search by Pur:Order', 'Search by Grand Total', 'Search by Date',
    'Search by Time', 'Search by Status','Search by Description'];

  incolumns: string[] = ['material', 'unitcost', 'qty', 'linecost', 'remove'];
  inheaders: string[] = ['Material', 'Unit Cost', 'Quantity', 'Line cost', 'Remove',];
  inbinders: string[] = ['material.name', 'unitcost', 'qty', 'linecost', 'getBtn()'];

  grn!:Grn;
  oldgrn!:Grn | undefined;

  innerdata:any;
  oldinnerdata:any;
  supervisorss!: Employee[];

  grns: Array<Grn> = [];
  grnstatuses: Array<Grnstatus> = [];
  employees:Array<Employee> = [];

  purordermats:Array<Purordermaterial> = [];

  purchaseorders:Array<Purorder>=[];
  materials:Array<Material> = [];

  grnmaterials:Array<Grnmaterial> = [];

  data!: MatTableDataSource<Grn>;
  imageurl: string = 'assets/default.jpg';
  @ViewChild(MatPaginator) Paginator!: MatPaginator;

  indata!:MatTableDataSource<Grnmaterial>

  grandtotal = 0;

  csearch!:FormGroup;
  ssearch!:FormGroup;
  form!:FormGroup;
  innerform!:FormGroup;

  uiassist:UiAssist;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  selectedrow: any;

  constructor(
    private fb:FormBuilder,
    private dp:DatePipe,
    private dg:MatDialog,
    private gs:Grnservice,
    private gst:Grnstatusservice,
    private es:EmployeeService,
    private ps:PurorderService,
    private ms:MaterialService
  ) {
    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csemployee": new FormControl(),
      "cspurorder": new FormControl(),
      "csgrandtotal": new FormControl(),
      "csdate": new FormControl(),
      "cstime": new FormControl(),
      "csgrnstatus": new FormControl(),
      "csdescription": new FormControl()
    });


    this.ssearch = this.fb.group({
      "ssemployee": new FormControl(),
      "sspurordereddate": new FormControl(),
      "ssstatus": new FormControl()
    }, {updateOn: 'change'});

    this.form = this.fb.group({
      "employee" : new  FormControl(),
      "supplier" : new  FormControl(),
      "purorder" : new  FormControl(),
      "date": new FormControl(),
      "time": new FormControl(),
      "description": new FormControl(),
      "grandtotal": new FormControl(),
      "grnstatus": new FormControl(),
    });

    this.innerform = this.fb.group({
      "unitcost": new FormControl(),
      "material": new FormControl(),
      "qty": new FormControl()
    }, {updateOn: 'change'});

  }

  ngOnInit(){
    this.initialize();

    // Subscribe to the value changes of the 'purorder' control
    // @ts-ignore
    this.form.get('purorder').valueChanges.subscribe((selectedPurorder: any) => {
      this.updateSupplier(selectedPurorder?.id);
    });
  }

  initialize(){
    this.createView();
    this.gst.getAllList().then((grsts:Grnstatus[])=> this.grnstatuses = grsts);
    this.es.getAllListDes().then((emps:Employee[])=> {
      this.employees = emps;
      this.supervisorss = this.employees.filter(employee => employee.designation.id === 3);
    });
    this.ps.getAll('').then((pord:Purorder[])=>this.purchaseorders = pord);
    this.ms.getListlist().then((mts:Material[])=>this.materials = mts);
    this.createForm();
  }

  // Disable and future dates
  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };

  createForm() {

    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['supplier'].disable();
    this.form.controls['purorder'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['time'].setValidators([Validators.required]);
    this.form.controls['description'];
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['grnstatus'].setValidators([Validators.required]);

    this.innerform.controls['unitcost'].setValidators([Validators.required]);
    this.innerform.controls['material'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    this.form.controls['time'].setValue(this.dp.transform(Date.now(),'hh:mm'));
    this.form.controls['time'].disable();

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldgrn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.grn[controlName]) {
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

  createView(){
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string){
    this.gs.getAll(query)
      .then((grns: Grn[]) => {
        this.grns = grns;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.grns);
        this.data.paginator = this.Paginator;
      });
  }


  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (grn: Grn, filter: string) => {

      return (csearchdata.csemployee == null || grn.employee.callingname.toLowerCase().includes(csearchdata.csemployee)) &&
        (csearchdata.cspurorder == null || grn.purorder.date.toLowerCase().includes(csearchdata.cspurorder)) &&
        (csearchdata.csgrandtotal == null || grn.grandtotal.toString().includes(csearchdata.csgrandtotal)) &&
        (csearchdata.csdate == null || grn.date.toLowerCase().includes(csearchdata.csdate)) &&
        (csearchdata.cstime == null || grn.time.toLowerCase().includes(csearchdata.cstime)) &&
        (csearchdata.csgrnstatus == null || grn.grnstatus.name.toLowerCase().includes(csearchdata.csgrnstatus)) &&
        (csearchdata.csdescription == null || grn.description.toLowerCase().includes(csearchdata.csdescription));
    };

    this.data.filter = 'xx';
  }


  btnSearchMc() {

    const ssearchdata = this.ssearch.getRawValue();

    let sotorekeeperid = ssearchdata.ssemployee;
    let date = this.dp.transform(ssearchdata.sspurordereddate,'yyyy:MM:dd');
    let statusid = ssearchdata.ssstatus;

    let query = "";

    if (sotorekeeperid != null) query = query + "&sotorekeeperid=" + sotorekeeperid;
    if (date != null && date.trim() != "") query = query + "&date=" + date;
    if (statusid != null) query = query + "&statusid=" + statusid;

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


  getBtn(element:Grn){
    return `<button mat-raised-button>Modify</button>`;
  }

  updateSupplier(purid: number) {
    if (purid) {
      // Call your service method to get the purchase order details
      this.ps.getAllListforS(purid).then((purorder: Purorder | undefined) => {
        if (purorder) {
          // Set the supplier field value based on the retrieved purchase order details
          this.form.controls['supplier'].setValue(purorder.supplier.name);
        } else {
          // Clear the supplier field if purchase order is not found
          this.form.controls['supplier'].setValue('');
        }
      });
    } else {
      // Clear the supplier field if no purchase order code is selected
      this.form.controls['supplier'].setValue('');
    }


    if (purid) {
      // Call your service method to get the purchase order details
      // this.ps.getAll('').then((pord:Purorder[])=>this.purchaseorders = pord);

      this.ps.getAllMat(purid).then((purorder: Purorder | undefined) => {
        if (purorder) {
          // Set the supplier field value based on the retrieved purchase order details
          this.purordermats = (purorder.purordermaterials);

        } else {
          // Clear the supplier field if purchase order is not found
          this.purordermats = [];
        }
      });
    } else {
      // Clear the supplier field if no purchase order code is selected
      this.purordermats = [];
    }
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }


  id = 0;

  btnaddMc() {

    this.innerdata = this.innerform.getRawValue()

    if( this.innerdata != null){

      let linecost = this.innerdata.qty * this.innerdata.unitcost;

      let grnmaterial = new  Grnmaterial(this.id,this.innerdata.material,this.innerdata.unitcost,this.innerdata.qty,linecost);

      let tem: Grnmaterial[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.grnmaterials = [];
      tem.forEach((t)=> this.grnmaterials.push(t));

      this.grnmaterials.push(grnmaterial);
      this.indata = new MatTableDataSource(this.grnmaterials);

      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  calculateGrandTotal(){

    this.grandtotal = 0;

    this.indata.data.forEach((m)=>{
      this.grandtotal = this.grandtotal+m.linecost
    })

    this.form.controls['grandtotal'].setValue(this.grandtotal);
  }

  deleteRaw(x:any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(m => m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.grnmaterials = this.indata.data;

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

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - GRN Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.grn = this.form.getRawValue();
      this.grn.grnmaterials = this.grnmaterials;

      // @ts-ignore
      this.grnmaterials.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.grn.date = this.dp.transform(this.grn.date,"yyy-mm-dd");
      this.grn.time = this.grn.time+":00";

      let invdata: string = "";

      invdata = invdata + "<br>Supplier is : " + this.grn.purorder.supplier.name
      invdata = invdata + "<br>Grand Total is : " + this.grn.grandtotal;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - GRN Add",
          message: "Are you sure to Add the following GRN? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");
          this.gs.add(this.grn).then((responce: [] | undefined) => {
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
              this.indata.data = [];
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -GRN Add", message: addmessage}
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


  fillForm(grn: Grn){

    this.enableButtons(false,true,true);

    this.selectedrow = grn;

    this.grn = JSON.parse(JSON.stringify(grn));
    this.oldgrn = JSON.parse(JSON.stringify(grn));

    // @ts-ignore
    this.grn.grnstatus = this.grnstatuses.find(g => g.id === this.grn.grnstatus.id);
    // @ts-ignore
    this.grn.employee = this.employees.find(e => e.id === this.grn.employee.id);
    // @ts-ignore
    this.grn.purorder = this.purchaseorders.find(p => p.id === this.grn.purorder.id);

    // @ts-ignore
    this.grn.purorder = this.purchaseorders.find(p => p.supplier === this.grn.purorder.supplier);

    this.indata = new MatTableDataSource(this.grn.grnmaterials);

    // if (this.grn.purorder.supplier === this.form.controls['supplier'].value) {
    //   this.form.controls['supplier'].markAsDirty();
    // }

    this.form.patchValue(this.grn);
    this.form.markAsPristine();
    this.calculateGrandTotal();
    this.form.controls['supplier'].markAsPristine();

  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        // console.log('1111111');
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
        data: {heading: "Errors - GRN Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - GRN Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.grn = this.form.getRawValue();
            this.grn.grnmaterials = this.grnmaterials;
            // @ts-ignore
            this.grn.id =this.oldgrn.id;

            // @ts-ignore
            this.grnmaterials.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.grn.date = this.dp.transform(this.grn.date,"yyyy-MM-dd");


            this.gs.update(this.grn).then((responce: [] | undefined) => {

              if (responce != undefined) { // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
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
                data: {heading: "Status -GRN Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - GRN Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }
  }


  delete() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - GRN Delete",
        message: "Are you sure to Delete folowing GRN? <br> <br>" +
          this.grn.purorder.supplier.name + " - " + this.grn.purorder.date
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        this.gs.delete(this.grn.id).then((responce: [] | undefined) => {
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
            this.form.reset();
            this.indata.data = [];
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - GRN Delete ", message: delmessage}
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
        this.oldgrn = undefined;
        this.form.reset();
        this.innerform.reset();
        this.indata.data = [];
        this.createForm();
      }
    });
  }

}


