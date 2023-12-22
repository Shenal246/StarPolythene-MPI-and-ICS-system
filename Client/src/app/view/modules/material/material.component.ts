import { DatePipe } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Material } from 'src/app/entity/material';
import { Materialcategory } from 'src/app/entity/materialcategory';
import { Materialstatus } from 'src/app/entity/materialstatus';
import { Materialcategoryservice } from 'src/app/service/materialcategoryservice';
import { MaterialService } from 'src/app/service/materialservice';
import { Materialstatusservice } from 'src/app/service/materialstatusservice';
import { RegexService } from 'src/app/service/regexservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent {
  cols = '12';
  // Requied data for Main Table
  columns: string[] = ['code', 'name', 'qty', 'materialcategory', 'materialstatus'];
  headers: string[] = ['Code', 'Name', 'Quntity(Kg)', 'Material Type', 'Material Status'];
  binders: string[] = ['code', 'name', 'qty', 'materialcategory.name', 'materialstatus.name'];

// Required data for client search
  cscolumns: string[] = ['cscode', 'csname', 'csqty', 'csmaterialcategory', 'csmaterialstatus'];
  csprompts: string[] = ['Search by Code', 'Search by Name', 'Search by Quantity', 'Search by Material Type', 'Search by Material Status'];
  materials: Array<Material> = [];

  imageurl: string = '';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  material!: Material;
  oldmaterial!: Material|undefined;
  selectedrow: any;

  data!: MatTableDataSource<Material>;

  @ViewChild(MatPaginator) Paginator!: MatPaginator;
  imageempurl: string= 'assets/defaultpol.jpg'

  praadd:boolean = false;
  praupd:boolean = false;
  pradel:boolean = false;

  materialcategories: Array<Materialcategory> = [];
  materialstatuses: Array<Materialstatus> = [];
  regexes: any;

  uiassist:UiAssist;

  constructor(private ms: MaterialService,
              private fb: FormBuilder,
              private mcs: Materialcategoryservice,
              private mss: Materialstatusservice,
              private dg: MatDialog,
              private rs: RegexService,
              private dp: DatePipe) {

    this.uiassist = new UiAssist(this);

    // Form Groups for Client search form
    this.csearch = this.fb.group({
      "cscode": new FormControl(),
      "csname": new FormControl(),
      "csqty": new FormControl(),
      "csmaterialcategory": new FormControl(),
      "csmaterialstatus": new FormControl()
    });

    // Form Froup for server search form
    this.ssearch = this.fb.group({
      "sscode": new FormControl(),
      "ssname": new FormControl(),
      "ssmaterialcategory": new FormControl(),
      "ssmaterialstatus": new FormControl(),
    });

    // Form groups for Data insert form
    this.form = this.fb.group({
      "code": new FormControl('',[Validators.required,Validators.pattern("^[A-Z]{5}$")]),
      "name": new FormControl('',[Validators.required]),
      "qty": new FormControl('',[Validators.required,Validators.pattern("^\d+(\.\d+)?$")]),
      "rop": new FormControl('',[Validators.required,Validators.pattern("^\d+(\.\d+)?$")]),
      "unitprice": new FormControl('',[Validators.required,Validators.pattern("^\d+(\.\d+)?$")]),
      "description": new FormControl('',[Validators.required]),
      "dointroduced": new FormControl('',[Validators.required]),
      "photo": new FormControl(),
      "materialcategory": new FormControl('',[Validators.required]),
      "materialstatus": new FormControl('',[Validators.required]),

    });
  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
     this.createView();
    this.mcs.getAllList().then((cos: Materialcategory[]) => { this.materialcategories = cos;});
    this.mss.getAllList().then((mats: Materialstatus[]) => { this.materialstatuses = mats; });
    this.rs.get('material').then((regs: []) => { this.regexes = regs; this.createForm();});

  }

  // Disable and future dates
  filterDates = (date: Date | null): boolean => {
    const currentDate = new Date();
    return !date || date.getTime() <= currentDate.getTime();
  };

  // Create the initial view
  createView(){
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  // Enable buttons according to the situation
  enableButtons(add:boolean, upd:boolean, del: boolean){
    this.praadd = add;
    this.praupd = upd;
    this.pradel = del;
  }

  // Create form using form controllers.
  createForm(){
    this.form.controls['code'].setValidators([Validators.required,Validators.pattern(this.regexes['code']['regex'])]);
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['qty'].setValidators([Validators.required,Validators.pattern(this.regexes['qty']['regex'])]);
    this.form.controls['rop'].setValidators([Validators.required,Validators.pattern(this.regexes['rop']['regex'])]);
    this.form.controls['unitprice'].setValidators([Validators.required,Validators.pattern(this.regexes['unitprice']['regex'])]);
    this.form.controls['dointroduced'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['photo'];
    this.form.controls['materialcategory'].setValidators([Validators.required]);
    this.form.controls['materialstatus'].setValidators([Validators.required]);

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dointroduced")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
        if (this.oldmaterial != undefined && control.valid) {
          // @ts-ignore
          if (value === this.material[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.loadForm();
    this.form.controls['photo'].clearValidators();
  }

  // Load form for initial view
  loadForm(){
    this.oldmaterial = undefined;
    this.form.reset();
    this.clearImage();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched(); });
    this.enableButtons(true,false,false);
    this.selectedrow =null;
  }

  // Data load to the main table
  loadTable(query: string){
    this.ms.getAll(query)
      .then((mates: Material[]) => {
        this.materials = mates;
        this.imageurl = 'assets/fullfilled.png';
        // console.log("Data are" + JSON.stringify(this.ms.getAll(query)));

      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.materials);
        this.data.paginator = this.Paginator;
      });
  }

  // Client side search
  filterTable(): void {
    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (material: Material, filter: string) => {
      return (csearchdata.cscode == null || material.code.toLowerCase().includes(csearchdata.cscode.toLowerCase())) &&
        (csearchdata.csname == null || material.name.toLowerCase().includes(csearchdata.csname.toLowerCase())) &&
        (csearchdata.csqty == null || material.qty.toString().includes(csearchdata.csqty.toLowerCase())) &&
        (csearchdata.csmaterialcategory == null || material.materialcategory.name.toLowerCase().includes(csearchdata.csmaterialcategory.toLowerCase())) &&
        (csearchdata.csmaterialstatus == null || material.materialstatus.name.toLowerCase().includes(csearchdata.csmaterialstatus.toLowerCase()));

    };

    this.data.filter = 'xx';
  }

  // Server side search
  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let code = ssearchdata.sscode;
    let name = ssearchdata.ssname;
    let materialcategoryid = ssearchdata.ssmaterialcategory;
    let materialstatusid = ssearchdata.ssmaterialstatus
    let query = "";

    if (code != null && code.trim() != "") query = query + "&code=" + code;
    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (materialcategoryid != null) query = query + "&materialcategoryid=" + materialcategoryid;
    if (materialstatusid != null) query = query + "&materialstatusid=" + materialstatusid

    if (query != "") query = query.replace(/^./,"?")
    this.loadTable(query);
  }

  // Clear function for server search card
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

  // Load the image
  selectImage(e: any): void{
    if (e.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event: any) => {
        this.imageempurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  // Clear Image
  clearImage(): void{
    this.imageempurl = 'assets/defaultpol.jpg';
    this.form.controls['photo'].setErrors({'required': false });
  }

  // Function for form add button
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Material Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.material = this.form.getRawValue();

      if (this.material.photo != null){
        this.material.photo=btoa(this.imageempurl);
      }



      let matdata: string = "";

      matdata = matdata + "<br>Code is : "+ this.material.code;
      matdata = matdata + "<br>Name is : "+ this.material.name;
      matdata = matdata + "<br>Quantity is : "+ this.material.qty;
      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Material Add",
          message: "Are you sure to Add the folowing Material? <br> <br>"+ matdata}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          this.ms.add(this.material).then((responce: []|undefined) => {
            if(responce!=undefined){ // @ts-ignore
              // @ts-ignore
              addstatus = responce['errors']=="";
              if(!addstatus) { // @ts-ignore
                addmessage=responce['errors'];
              }
            }
            else{
              addstatus=false;
              addmessage="Content Not Found"
            }
          }).finally( () =>{
            if(addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              this.clearImage();
              this.loadTable("");
              this.loadForm();
            }
            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Material Add", message: addmessage}
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

  // Fill form when click the table row
  fillForm(material: Material){
    this.enableButtons(false,true,true);

    this.selectedrow = material;

    this.material = JSON.parse(JSON.stringify(material));
    this.oldmaterial = JSON.parse(JSON.stringify(material));

    if (this.material.photo != null){
      this.imageempurl = atob(this.material.photo);
      this.form.controls['photo'].clearValidators();
    }else {
      this.clearImage();
    }
    this.material.photo = "";
    // @ts-ignore
    this.material.materialcategory = this.materialcategories.find(mc => mc.id === this.material.materialcategory.id);
    // @ts-ignore
    this.material.materialstatus = this.materialstatuses.find(mst => mst.id === this.material.materialstatus.id);

    this.form.patchValue(this.material);
    this.form.markAsPristine();
  }

  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Material Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Material Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.material = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.material.photo = btoa(this.imageempurl);
            else { // @ts-ignore
              this.material.photo = this.oldmaterial.photo;
            }
            // @ts-ignore
            this.material.id = this.oldmaterial.id;
            this.ms.update(this.material).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Material Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Material Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Material Delete",
        message: "Are you sure to Delete folowing Material? <br> <br>" +
          this.material.code + " - " + this.material.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        this.ms.delete(this.material.id).then((responce: [] | undefined) => {
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
            data: {heading: "Status - Material Delete ", message: delmessage}
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

