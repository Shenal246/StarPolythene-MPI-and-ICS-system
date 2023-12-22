import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectionList} from "@angular/material/list";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {RegexService} from "../../../service/regexservice";
import { Supplierstatus } from 'src/app/entity/supplierstatus';
import { Supplier } from 'src/app/entity/supplier';
import { Supply } from 'src/app/entity/supply';
import { Material } from 'src/app/entity/material';
import { MaterialService } from 'src/app/service/materialservice';
import { SupplierService } from 'src/app/service/supplierservice';
import { SupplierstatusService } from 'src/app/service/supplierstatusservice';
import { Supplyservice } from 'src/app/service/supplyservice';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit{

  public form!: FormGroup;
  public ssearch!: FormGroup;
  public csearch!: FormGroup;

  supplierstatuses: Array<Supplierstatus> = [];
  suppliers: Array<Supplier> = [];
  supplies: Array<Supply> = [];

  materialss: Array<Material> =[];

  // @Input()roles: Array<Role> = [];
  @Input()materials: Array<Material> = [];
  // oldroles:Array<Role>=[];
  oldmaterials:Array<Material>=[];

  @Input()selectedmaterials: Array<Material> =[];

  supplier!: Supplier;
  oldsupplier!: Supplier;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;

  columns: string[] = ['name', 'tpnumber', 'contactperson','contactpersontp', 'email','supplierstatus','material'];
  headers: string[] = ['Name', 'Phone Number','Contactperson', 'Contactperson PnoneNo:', 'Email', 'SupplierStatus','Materials'];
  binders: string[] = ['name','tpnumber', 'contactperson','contactpersontp', 'email', 'supplierstatus.name','getmaterial()'];

  cscolumns: string[] = ['csname', 'cstpnumber', 'cscontactperson','cscontactpersontp', 'csemail','cssupplierstatus','csmaterial'];
  csprompts: string[] = ['Search by Name','Search by PhoneNo' ,'Search by Contactperson','Search by Contactperson TpNo', 'Search by Email',
    'Search by SupplierStatus','Search by material'];

  imageurl: string = '';

  data !:MatTableDataSource<Supplier>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;

  uiassist: UiAssist;

  regexes:any;

  supadd:boolean = false;
  supupd:boolean = false;
  supdel:boolean = false;

  constructor(
    private fb:FormBuilder,
    private sss:SupplierstatusService,
    private ms:MaterialService,
    private ss:SupplierService,
    private sys:Supplyservice,
    private dp:DatePipe,
    private dg:MatDialog,
    private reg:RegexService
  ) {

    this.uiassist = new UiAssist(this);
    // @ts-ignore
    this.supplier = new Supplier();

    this.csearch = this.fb.group({

      "csname": new FormControl(),
      "cstpnumber": new FormControl(),
      "cscontactperson": new FormControl(),
      "cscontactpersontp": new FormControl(),
      "csemail": new FormControl(),
      "cssupplierstatus": new FormControl(),
      "csmaterial": new FormControl(),

    });

    this.form = this.fb.group({

      "name": new FormControl('',[Validators.required]),
      "tpnumber": new FormControl('',[Validators.required]),
      "contactperson": new FormControl('',[Validators.required]),
      "contactpersontp": new FormControl('',[Validators.required]),
      "address": new FormControl('',[Validators.required]),
      "email": new FormControl('',[Validators.required]),
      "regdate": new FormControl('',[Validators.required]),
      "supplierstatus": new FormControl('',[Validators.required]),
      "supplies": new FormControl('',[Validators.required]),

    });

    this.ssearch = this.fb.group({

      "ssname": new FormControl(),
      "sstpnumber": new FormControl(),
      "sssupplierstatus": new FormControl(),
      "ssmaterial": new FormControl(),

    });

  }


  ngOnInit(): void{
    this.initialize();
  }


  initialize(){

    this.createView();

    this.ms.getList().then((materials:Material[])=>{
      this.materials = materials;
      this.materialss = materials;
      this.oldmaterials = Array.from(this.materials);
    });

    this.sss.getAllList().then((suplierstaus:Supplierstatus[])=>{
      this.supplierstatuses = suplierstaus;
    });

    this.reg.get("supplier").then((regs:[])=>{
      this.regexes = regs;
      this.createForm();
    });
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query:string):void{

    this.ss.getAll(query)
      .then((supliers: Supplier[]) => {
        this.suppliers = supliers;
        // alert(JSON.stringify(this.suppliers));
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.suppliers);
        this.data.paginator = this.paginator;
      });

  }

  getmaterial(element:Supplier) {
    let materials = "";
    element.supplies.forEach((e)=>{materials = materials+e.material.name+","+"\n"; });
    return materials;

  }

  createForm() {
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['tpnumber'].setValidators([Validators.required,Validators.pattern(this.regexes['tpnumber']['regex'])]);
    this.form.controls['contactperson'].setValidators([Validators.required]);
    this.form.controls['contactpersontp'].setValidators([Validators.required,Validators.pattern(this.regexes['contactpersontp']['regex'])]);
    this.form.controls['address'].setValidators([Validators.required]);
    this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['regdate'].setValidators([Validators.required]);
    this.form.controls['supplierstatus'].setValidators([Validators.required]);
    this.form.controls['supplies'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldsupplier != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supplier[controlName]) {
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

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.supadd=add;
    this.supupd=upd;
    this.supdel=del;
  }

  rightSelected(): void {

    this.supplier.supplies= this.availablelist.selectedOptions.selected.map(option => {
      const supply = new Supply(option.value);
      this.materials = this.materials.filter(material => material !== option.value); //Remove Selected
      this.supplies.push(supply); // Add selected to Right Side
      return supply;
    });

    this.form.controls["supplies"].clearValidators();
    this.form.controls["supplies"].updateValueAndValidity(); // Update status

  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extSupplies= option.value;
      this.supplies= this.supplies.filter(material => material !== extSupplies); // Remove the Selected one From Right Side
      this.materials.push(extSupplies.material);
      console.log(JSON.stringify(this.materials))
    }

    // this.form.controls["supplies"].clearValidators();
    // this.form.controls["supplies"].updateValueAndValidity(); // Update status

  }

  rightAll(): void {
    this.supplier.supplies= this.availablelist.selectAll().map(option => {
      const supply = new Supply(option.value);
      this.materials = this.materials.filter(material => material !== option.value);
      this.supplies.push(supply);
      return supply;
    });

    this.form.controls["supplies"].clearValidators();
    this.form.controls["supplies"].updateValueAndValidity();

  }

  leftAll():void{

    for(let supply of this.supplies) this.materials.push(supply.material);
    this.supplies= [];
  }

  filterTable(): void {
    const cserchdata = this.csearch.getRawValue();
    // console.log(cserchdata.csmaterial);

    this.data.filterPredicate = (supplier: Supplier, filter: string) => {
      return (cserchdata.csname == null || supplier.name.toLowerCase().includes(cserchdata.csname.toLowerCase())) &&
        (cserchdata.cstpnumber == null || supplier.tpnumber.includes(cserchdata.cstpnumber)) &&
        (cserchdata.cscontactperson == null || supplier.contactperson.toLowerCase().includes(cserchdata.cscontactperson.toLowerCase())) &&
        (cserchdata.cscontactpersontp == null || supplier.contactpersontp.includes(cserchdata.cscontactpersontp)) &&
        (cserchdata.csemail == null || supplier.email.toLowerCase().includes(cserchdata.csemail.toLowerCase())) &&
        (cserchdata.cssupplierstatus == null || supplier.supplierstatus.name.toLowerCase().includes(cserchdata.cssupplierstatus.toLowerCase())) &&
        (cserchdata.csmaterial == null || this.getmaterial(supplier).toString().toLowerCase().includes(cserchdata.csmaterial.toLowerCase())) ;

    };

    this.data.filter = 'xx';

  }

  // For server search button
  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();

    let name = sserchdata.ssname;
    let tpnumber = sserchdata.sstpnumber;
    let supplierstatusid = sserchdata.sssupplierstatus;
    let materialid = sserchdata.ssmaterial;

    let query = "";

    if (name != null && name.trim() !== "") query = query + "&name=" + name;
    if (tpnumber != null && tpnumber.trim() !== "") query = query + "&tpnumber=" + tpnumber;
    if (supplierstatusid != null ) query = query + "&supplierstatusid=" + supplierstatusid;
    if (materialid != null ) query = query + "&materialid=" + materialid;

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


  getErrors(): string {

    let errors: string = ""

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    return errors;
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      let supplier:Supplier = this.form.getRawValue();

      supplier.supplies= this.supplier.supplies;
      this.supplier = supplier;

      let supplidata: string = "";

      supplidata = supplidata + "<br>Supplier is : " + this.supplier.name;
      supplidata = supplidata + "<br>Supplier Phone No is : " + this.supplier.tpnumber;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Supplier Add",
          message: "Are you sure to Add the folowing Supplier? <br> <br>" + supplidata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.ss.add(this.supplier).then((responce: [] | undefined) => {
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
              this.supplies= [];
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Supplier Add", message: addmessage}
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


  fillForm(supplier: Supplier) {

    this.enableButtons(false,true,true);

    this.materials = Array.from(this.oldmaterials);

    this.selectedrow=supplier;

    this.supplier = JSON.parse(JSON.stringify(supplier));
    this.oldsupplier = JSON.parse(JSON.stringify(supplier));

    //@ts-ignore
    this.supplier.supplierstatus = this.supplierstatuses.find(st => st.id === this.supplier.supplierstatus.id);

    this.supplies= this.supplier.supplies;

    this.supplier.supplies.forEach((sf)=> this.materials = this.materials.filter((m)=> m.id != sf.material.id )); // Load or remove roles by comparing with supplier.materials

    this.form.patchValue(this.supplier);
    this.form.markAsPristine();


  }
  //
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
  //
  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Supplier Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.supplier = this.form.getRawValue();

            this.supplier.id = this.oldsupplier.id;

            console.log(this.supplier.id);

            this.ss.update(this.supplier).then((responce: [] | undefined) => {
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
                this.leftAll();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Supplier Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Supplier Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }
  }

  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Supplier Delete",
        message: "Are you sure to Delete following Supplier? <br> <br>  Supplier Name : " + this.supplier.name
      }
    });

    console.log("Dele: "+this.supplier.id);

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.ss.delete(this.supplier.id).then((responce: [] | undefined) => {

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
            this.leftAll();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Supplier Delete ", message: delmessage}
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
        heading: "Confirmation - Supplier Form Clear",
        message: "Are you sure to Clear the Form? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.createForm();
        this.leftAll();
        this.loadTable("");
      }
    });

  }



}
