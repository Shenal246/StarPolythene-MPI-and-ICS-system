import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Matissue} from "../../../entity/matissue";
import {Material} from "../../../entity/material";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Matissuematerial} from "../../../entity/matissuematerial";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {RegexService} from "../../../service/regexservice";
import {Employee} from "../../../entity/employee";
import {Proorder} from "../../../entity/proorder";
import {EmployeeService} from "../../../service/employeeservice";
import {MaterialService} from "../../../service/materialservice";
import {MatissueService} from "../../../service/matissueservice";
import {ProorderService} from "../../../service/proorderservice";


@Component({
  selector: 'app-matissue',
  templateUrl: './matissue.component.html',
  styleUrls: ['./matissue.component.css']
})
export class MatissueComponent {

  columns: string[] = ['date','employee','proorder'];
  headers: string[] = ['Date','Issured Employee', 'Production Order'];
  binders: string[] = ['date','employee.callingname', 'proorder.code'];

  cscolumns: string[] = ['csdate','csemployee','csproorder'];
  csprompts: string[] = ['Search by Date','Search by Employee', 'Search by Production order'];

  incolumns: string[] = ['name', 'qty', 'remove'];
  inheaders: string[] = ['Material', 'Quantity', 'Remove'];
  inbinders: string[] = ['material.name', 'qty', 'getBtn()'];


  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  matissue!:Matissue;
  oldmatissue!:Matissue;

  innerdata:any;
  oldinnerdata:any;

  regexes:any;

  matissues: Array<Matissue> = [];
  data!: MatTableDataSource<Matissue>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  indata!:MatTableDataSource<Matissuematerial>

  employees: Array<Employee> = [];
  materials: Array<Material> = [];
  proorders: Array<Proorder> = [];

  grandtotal = 0;

  selectedrow: any;
  storekeepers!: Employee[];

  matissuematerials:Array<Matissuematerial> = [];

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  uiassist: UiAssist;

  constructor(
    private fb:FormBuilder,
    private es:EmployeeService,
    private prs:ProorderService,
    private ms:MaterialService,
    private mis:MatissueService,
    private dg:MatDialog,
    private dp:DatePipe,
    private rs:RegexService
  ) {

    this.uiassist = new UiAssist(this);
    this.matissuematerials = new Array<Matissuematerial>();

    this.csearch = this.fb.group({
      "csdate": new FormControl(),
      "csemployee": new FormControl(),
      "csproorder": new FormControl()
    });

    this.form = this.fb.group({
      "date": new FormControl('',Validators.required),
      "employee": new FormControl('',Validators.required),
      "proorder": new FormControl('',Validators.required)
    }, {updateOn: 'change'});


    this.innerform = this.fb.group({
      "material": new FormControl('',Validators.required),
      "qty": new FormControl('',Validators.required),
    }, {updateOn: 'change'});
    //
    //
    this.ssearch = this.fb.group({
      "ssemployee": new FormControl(),
      "ssproorder": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {

    this.createView();

    this.es.getAllListDes().then((emps: Employee[]) => {
      this.employees = emps;
      this.storekeepers = this.employees.filter(employee => employee.designation.id === 3);
    });

    this.ms.getList().then((mats: Material[]) => {
      this.materials = mats;
    });

    this.prs.getAllList().then((prs: Proorder[]) => {
      this.proorders = prs;
    });

    // this.rs.get('matissues').then((rgx:any[])=>{
    //   this.regexes = rgx;
    //   this.createForm();
    // }) ;
    this.createForm();

  }


  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  loadTable(query: string) {

    this.mis.getAll(query)
      .then((invs: Matissue[]) => {
        this.matissues = invs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.matissues);
        this.data.paginator = this.paginator;
      });

  }

  createForm() {

    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['proorder'].setValidators([Validators.required]);

    this.innerform.controls['material'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldmatissue != undefined && control.valid) {
            // @ts-ignore
            if (value === this.matissue[controlName]) {
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

  getBtn(element:Matissue){
    return `<button mat-raised-button>Modify</button>`;
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (matissue: Matissue, filter: string) => {
      return (cserchdata.csdate == null || matissue.date.includes(cserchdata.csdate)) &&
        (cserchdata.csemployee == null || matissue.employee.callingname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.csproorder == null || matissue.proorder.code.toLowerCase().includes(cserchdata.csproorder.toLowerCase())) ;
    };

    this.data.filter = 'xx';

  }


  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let employeeid = sserchdata.ssemployee;
    let proorderid = sserchdata.ssproorder;

    let query = "";

    if (employeeid != null) query = query + "&employeeid=" + employeeid;
    if (proorderid != null) query = query + "&proorderid=" + proorderid;

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

      let matissuematerial = new  Matissuematerial(this.id,this.innerdata.qty,this.innerdata.material);

      let tem: Matissuematerial[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.matissuematerials = [];
      tem.forEach((t)=> this.matissuematerials.push(t));

      this.matissuematerials.push(matissuematerial);
      this.indata = new MatTableDataSource(this.matissuematerials);

      this.id++;

      this.innerform.reset();

    }

  }


  deleteRaw(x:any) {

    let datasources = this.indata.data

    const index = datasources.findIndex(material => material.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.matissuematerials = this.indata.data;

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
        data: {heading: "Errors - Material Issue Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.matissue = this.form.getRawValue();
      this.matissue.matissuematerials = this.matissuematerials;

      // @ts-ignore
      this.matissuematerials.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.matissue.date = this.dp.transform(this.matissue.date,"yyyy-MM-dd");
      // @ts-ignore
      this.matissue.proorder.date = this.dp.transform(this.matissue.proorder.date,"yyyy-MM-dd");

      let invdata: string = "";

      invdata = invdata + "<br>Employee is : " + this.matissue.employee.callingname
      invdata = invdata + "<br>Production Order code is : " + this.matissue.proorder.code;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Material Issue Add",
          message: "Are you sure to Add the following Material Issue? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.mis.add(this.matissue).then((responce: [] | undefined) => {

            if (responce != undefined) { // @ts-ignore
              // console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
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
              data: {heading: "Status -Matissue Add", message: addmessage}
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

  // add() {
  //   let errors = this.getErrors();
  //
  //   if (errors != "") {
  //     // ... Code to display validation errors (if any) to the user ...
  //   } else {
  //     // ... Code to prepare the 'matissue' object and other actions before the server call ...
  //
  //     const confirm = this.dg.open(ConfirmComponent, {
  //       width: '500px',
  //       data: {
  //         heading: "Confirmation - Material Issue Add",
  //         message: "Are you sure to Add the following Material Issue? <br> <br>" + invdata
  //       }
  //     });
  //
  //     let addstatus: boolean = false;
  //     let addmessage: string = "Server Not Found";
  //
  //     confirm.afterClosed().subscribe(async result => {
  //       if (result) {
  //         // Call the server to add 'matissue'
  //         this.mis.add(this.matissue).subscribe(
  //           (response: any) => {
  //             console.log("Response: ", response);
  //
  //             // Check if the response contains errors
  //             addstatus = response.errors === "";
  //             addmessage = addstatus ? "Successfully Saved" : response.errors;
  //           },
  //           (error: any) => {
  //             console.error("Error: ", error);
  //             addstatus = false;
  //             addmessage = "An error occurred while adding the Material Issue.";
  //           },
  //           () => {
  //             // Code to execute after the server call (whether it succeeds or fails)
  //
  //             if (addstatus) {
  //               // Code to execute when the addition is successful
  //               this.form.reset();
  //               this.innerform.reset();
  //               this.indata.data = [];
  //               Object.values(this.form.controls).forEach(control => {
  //                 control.markAsTouched();
  //               });
  //               this.loadTable("");
  //             }
  //
  //             const stsmsg = this.dg.open(MessageComponent, {
  //               width: '500px',
  //               data: { heading: "Status - Matissue Add", message: addmessage }
  //             });
  //
  //             stsmsg.afterClosed().subscribe(async result => {
  //               if (!result) {
  //                 return;
  //               }
  //             });
  //           }
  //         );
  //       }
  //     });
  //   }
  // }


  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }


  fillForm(matissue: Matissue) {

    this.enableButtons(false,true,true);

    this.selectedrow = matissue;

    this.matissue = JSON.parse(JSON.stringify(matissue));
    this.oldmatissue = JSON.parse(JSON.stringify(matissue));

    // @ts-ignore
    this.matissue.employee = this.employees.find(g => g.id === this.matissue.employee.id);
    // @ts-ignore
    this.matissue.proorder = this.proorders.find(d => d.id === this.matissue.proorder.id);

    this.indata = new MatTableDataSource(this.matissue.matissuematerials);

    this.form.patchValue(this.matissue);
    this.form.markAsPristine();

  }


  getUpdates(): string {
    let updates: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
        console.log("ji")
      }
    }
    const materialNames = this.indata.data.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.material.name + ", "; }, "");

    if (materialNames) {
      updates = updates + "<br>Materials: " + materialNames.slice(0, -1) + " Changed"; // Remove the trailing ", " from the materialNames
    }

    return updates;
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Material Issue Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Material Issue Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.matissue = this.form.getRawValue();
            this.matissue.id = this.oldmatissue.id;
            this.matissue.matissuematerials = this.matissuematerials;

            // @ts-ignore
            this.matissuematerials.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.matissue.date = this.dp.transform(this.matissue.date,"yyyy-MM-dd");

            //console.log(JSON.stringify(this.matissue));

            this.mis.update(this.matissue).then((responce: [] | undefined) => {

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
                data: {heading: "Status -Material Issue Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Material Issue Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }



  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Matissue Delete",
        message: "Are you sure to Delete following Material Issue for this production order? <br> <br>"+ "Production Order Code:" + this.matissue.proorder.code
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.mis.delete(this.matissue.id).then((responce: [] | undefined) => {

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
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Matissue Delete ", message: delmessage}
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
        heading: "Confirmation - Material Issue Clear",
        message: "Are you sure to Clear the Form? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.loadForm();

      }
    });

  }

}
