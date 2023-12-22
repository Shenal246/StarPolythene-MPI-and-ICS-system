import { DatePipe } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Designation } from 'src/app/entity/designation';
import { Employee } from 'src/app/entity/employee';
import { Employeestatus } from 'src/app/entity/employeestatus';
import { Gender } from 'src/app/entity/gender';
import { DesignationService } from 'src/app/service/designationservice';
import { EmployeeService } from 'src/app/service/employeeservice';
import { EmployeestatuseService } from 'src/app/service/employeestatusservice';
import { GenderService } from 'src/app/service/genderservice';
import { RegexService } from 'src/app/service/regexservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {MatDatepicker} from "@angular/material/datepicker";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  cols = '12';
  // Requied data for Main Table
  columns: string[] = ['number', 'callingname', 'gender', 'designation', 'fullname', 'modi'];
  headers: string[] = ['Number', 'Calling Name', 'Gender', 'Designation', 'Full Name', 'Modification'];
  binders: string[] = ['number', 'callingname', 'gender.name', 'designation.name', 'fullname', 'getModi()'];

  // Required data for client search
  cscolumns: string[] = ['csnumber', 'cscallingname', 'csgender', 'csdesignation', 'csname', 'csmodi'];
  csprompts: string[] = ['Search by Number', 'Search by Name', 'Search by Gender', 'Search by Designation',
    'Search by Full Name', 'Search by Modi'];
  employees: Array<Employee> = [];

  imageurl: string = '';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  employee!: Employee;
  oldemployee!: Employee|undefined;
  selectedrow: any;

  data!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator) Paginator!: MatPaginator;
  imageempurl: string= 'assets/default.jpg'

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  genders: Array<Gender> = [];
  designations: Array<Designation> = [];
  employeestatuses: Array<Employeestatus> = [];
  regexes: any;

  uiassist:UiAssist;

  constructor(
    private es: EmployeeService,
    private fb: FormBuilder,
    private gs: GenderService,
    private ds: DesignationService,
    private dg: MatDialog,
    private ss: EmployeestatuseService,
    private rs: RegexService,
    private dp: DatePipe,
    public authService:AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    // Form Groups for Client search form
    this.csearch = this.fb.group({
      "csnumber": new FormControl(),
      "cscallingname": new FormControl(),
      "csgender": new FormControl(),
      "csdesignation": new FormControl(),
      "csname": new FormControl(),
      "csmodi": new FormControl()
    });

    // Form Froup for server search form
    this.ssearch = this.fb.group({
      "ssnumber": new FormControl(),
      "ssfullname": new FormControl(),
      "ssgender": new FormControl(),
      "ssdesignation": new FormControl(),
      "ssnic": new FormControl()
    });

    // Form groups for Data insert form
    this.form = this.fb.group({
      "number": new FormControl('',[Validators.required,Validators.pattern("^\\d{4}$")]),
      "fullname": new FormControl('',[Validators.required]),
      "callingname": new FormControl('',[Validators.required]),
      "gender": new FormControl('',[Validators.required]),
      "nic": new FormControl('',[Validators.required]),
      "dobirth": new FormControl('',[Validators.required]),
      "photo": new FormControl('',[Validators.required]),
      "address": new FormControl('',[Validators.required]),
      "mobile": new FormControl('',[Validators.required]),
      "land": new FormControl('', ),
      "designation": new FormControl('',[Validators.required]),
      "doassignment": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "employeestatus": new FormControl('',[Validators.required]),

    });
  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.createView();
    this.gs.getAllList().then((gens: Gender[]) => { this.genders = gens; });
    this.ds.getAllList().then((dess: Designation[]) => { this.designations = dess; });
    this.ss.getAllList().then((stes: Employeestatus[]) => { this.employeestatuses = stes; });
    this.rs.get('employee').then((regs: []) => { this.regexes = regs;  this.createForm();});

  }

  // Create the initial view
  createView(){
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  // Enable buttons according to the situation
  enableButtons(add:boolean, upd:boolean, del: boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  // Create form using form controllers.
  createForm(){
    this.form.controls['number'].setValidators([Validators.required,Validators.pattern(this.regexes['number']['regex'])]);
    this.form.controls['fullname'].setValidators([Validators.required,Validators.pattern(this.regexes['fullname']['regex'])]);
    this.form.controls['callingname'].setValidators([Validators.required,Validators.pattern(this.regexes['callingname']['regex'])]);
    this.form.controls['gender'].setValidators([Validators.required]);
    this.form.controls['nic'].setValidators([Validators.required,Validators.pattern(this.regexes['nic']['regex'])]);
    this.form.controls['dobirth'].setValidators([Validators.required]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['address'].setValidators([Validators.required,Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['mobile'].setValidators([Validators.required,Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['land'].setValidators([Validators.pattern(this.regexes['land']['regex'])]);
    this.form.controls['designation'].setValidators([Validators.required]);
    this.form.controls['doassignment'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['employeestatus'].setValidators([Validators.required]);

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dobirth" || controlName=="doassignment")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
        if (this.oldemployee != undefined && control.valid) {
          // @ts-ignore
          if (value === this.employee[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.loadForm();
  }

  // Load form for initial view
  loadForm(){
    this.oldemployee = undefined;
    this.form.reset();
    this.clearImage();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched(); });
    this.enableButtons(true,false,false);
    this.selectedrow =null;
  }

  // Data load to the main table
  loadTable(query: string){
    this.es.getAll(query)
      .then((emps: Employee[]) => {
        this.employees = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.employees);
        this.data.paginator = this.Paginator;
      });
  }

  // Get data for the modified column
  getModi(element: Employee){
    return element.number + '(' + element.callingname + ')';
  }

  // Client side search
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (employee: Employee, filter: string) => {

      return (csearchdata.csnumber == null || employee.number.toLowerCase().includes(csearchdata.csnumber)) &&
        (csearchdata.cscallingname == null || employee.callingname.toLowerCase().includes(csearchdata.cscallingname)) &&
        (csearchdata.csgender == null || employee.gender.name.toLowerCase().includes(csearchdata.csgender)) &&
        (csearchdata.csdesignation == null || employee.designation.name.toLowerCase().includes(csearchdata.csdesignation)) &&
        (csearchdata.csname == null || employee.fullname.toLowerCase().includes(csearchdata.csname)) &&
        (csearchdata.csmodi == null || this.getModi(employee).toLowerCase().includes(csearchdata.csmodi));


    };
    this.data.filter = 'xx';
  }

  // Server side search
  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let number = ssearchdata.ssnumber;
    let fullname = ssearchdata.ssfullname;
    let nic = ssearchdata.ssnic;
    let genderid = ssearchdata.ssgender;
    let designationid = ssearchdata.ssdesignation;

    let query = "";

    if (number != null && number.trim() != "") query = query + "&number=" + number;
    if (fullname != null && fullname.trim() != "") query = query + "&fullname=" + fullname;
    if (nic != null && nic.trim() != "") query = query + "&nic=" + nic;
    if (genderid != null) query = query + "&genderid=" + genderid;
    if (designationid != null) query = query + "&designationid=" + designationid;

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
    this.imageempurl = 'assets/default.jpg';
    this.form.controls['photo'].setErrors({'required': true });
  }

  // Function for form add button
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Employee Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.employee = this.form.getRawValue();
      this.employee.photo=btoa(this.imageempurl);
      //console.log("Photo-After"+this.employee.photo);

      let empdata: string = "";

      empdata = empdata + "<br>Number is : "+ this.employee.number;
      empdata = empdata + "<br>Fullname is : "+ this.employee.fullname;
      empdata = empdata + "<br>Callingname is : "+ this.employee.callingname;
      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Employee Add",
          message: "Are you sure to Add the folowing Employee? <br> <br>"+ empdata}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          this.es.add(this.employee).then((responce: []|undefined) => {
            // console.log("Res-"+responce);
            if(responce!=undefined){ // @ts-ignore
              console.log("Add-"+responce['id']+"-"+responce['url']+"-"+(responce['errors']==""));
              // @ts-ignore
              addstatus = responce['errors']=="";
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
              this.clearImage();
              this.loadTable("");
            }
            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Employee Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => { if (!result) { return;} }) ;} );
        }
      });
    }
  }


  // Get errors from server side regex patterns
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

  // ?Fill data to the form to update data
  fillForm(employee: Employee){
    this.enableButtons(false,true,true);

    this.selectedrow = employee;

    this.employee = JSON.parse(JSON.stringify(employee));
    this.oldemployee = JSON.parse(JSON.stringify(employee));

    if (this.employee.photo != null){
      this.imageempurl = atob(this.employee.photo);
      this.form.controls['photo'].clearValidators();
    }else {
      this.clearImage();
    }
    this.employee.photo = "";
    // @ts-ignore
    this.employee.gender = this.genders.find(g => g.id === this.employee.gender.id);
    // @ts-ignore
    this.employee.designation = this.designations.find(d => d.id === this.employee.designation.id);
    // @ts-ignore
    this.employee.employeestatus = this.employeestatuses.find(s => s.id === this.employee.employeestatus.id);

    this.form.patchValue(this.employee);
    this.form.markAsPristine();
  }

  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Employee Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Employee Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.employee = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.employee.photo = btoa(this.imageempurl);
            else { // @ts-ignore
              this.employee.photo = this.oldemployee.photo;
            }
            // @ts-ignore
            this.employee.id = this.oldemployee.id;
            this.es.update(this.employee).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Employee Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Employee Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }


  // Track updates fields and get updated values
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
        heading: "Confirmation - Employee Delete",
        message: "Are you sure to Delete folowing Employee? <br> <br>" +
          this.employee.callingname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        this.es.delete(this.employee.id).then((responce: [] | undefined) => {
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
            data: {heading: "Status - Employee Delete ", message: delmessage}
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

