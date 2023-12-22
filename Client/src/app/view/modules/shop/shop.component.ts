import { DatePipe } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Shop } from 'src/app/entity/shop';
import { Shopstatus } from 'src/app/entity/shopstatus';
import { RegexService } from 'src/app/service/regexservice';
import { ShopService } from 'src/app/service/shopservice';
import { Shopstatuseservice } from 'src/app/service/shopstatusservice';
import { SizeService } from 'src/app/service/sizeservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  cols = '12';
  columns: string[] = ['name', 'tpnumber', 'email', 'contactperson', 'contactpno', 'shopstatus'];
  headers: string[] = ['Name', 'Phone Number', 'Email', 'Contact Person', 'Contact Person No', 'Shop Status'];
  binders: string[] = ['name', 'tpnumber', 'email', 'contactperson', 'contactpno', 'shopstatus.name'];

  cscolumns: string[] = ['csname', 'cstpnumber', 'csemail', 'cscontactperson', 'cscontactpno', 'csshopstatus'];
  csprompts: string[] = ['Search by Name', 'Search by Phone Number', 'Search by Email', 'Search by Contact Person No', 'Search by Contact Person No',
    'Search by Shop status'];
  shops: Array<Shop> = [];

  imageurl: string = '';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  shop!: Shop;
  oldshop!: Shop|undefined;
  selectedrow: any;

  data!: MatTableDataSource<Shop>;

  @ViewChild(MatPaginator) Paginator!: MatPaginator;
  imageempurl: string= 'assets/defaultpol.jpg'

  praadd:boolean = false;
  praupd:boolean = false;
  pradel:boolean = false;

  shopstatuses: Array<Shopstatus> = [];

  regexes: any;

  uiassist:UiAssist;

  constructor(private shs: ShopService, private fb: FormBuilder,  private shsts: Shopstatuseservice, private dg: MatDialog, private rs: RegexService, private dp: DatePipe) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csname": new FormControl(),
      "cstpnumber": new FormControl(),
      "csemail": new FormControl(),
      "cscontactperson": new FormControl(),
      "cscontactpno": new FormControl(),
      "csshopstatus": new FormControl()
    });


    this.ssearch = this.fb.group({
      "ssname": new FormControl(),
      "sstpnumber": new FormControl(),
      "sscontactperson": new FormControl(),
      "sscontactpno": new FormControl(),
      "ssshopstatus": new FormControl()
    });


    this.form = this.fb.group({
      "name": new FormControl('',[Validators.required]),
      "address": new FormControl('',[Validators.required]),
      "tpnumber": new FormControl('',[Validators.required]),
      "email": new FormControl('',[Validators.required]),
      "contactperson": new FormControl('',[Validators.required]),
      "contactpno": new FormControl('',[Validators.required]),
      "dointroduced": new FormControl('', [Validators.required]),
      "creditlimit": new FormControl('',[Validators.required]),
      "shopstatus": new FormControl('',[Validators.required]),
    });
  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.createView();

    this.shsts.getAllList().then((prsts: Shopstatus[]) => { this.shopstatuses = prsts; console.log("Ps-"+this.shopstatuses); });
    this.rs.get('shop').then((regs: []) => { this.regexes = regs; this.createForm();});
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
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['address'].setValidators([Validators.required,Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['tpnumber'].setValidators([Validators.required,Validators.pattern(this.regexes['tpnumber']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['contactperson'].setValidators([Validators.required, Validators.pattern(this.regexes['contactperson']['regex'])]);
    this.form.controls['contactpno'].setValidators([Validators.required, Validators.pattern(this.regexes['contactpno']['regex'])]);
    this.form.controls['dointroduced'].setValidators([Validators.required]);
    this.form.controls['creditlimit'].setValidators([Validators.required, Validators.pattern(this.regexes['creditlimit']['regex'])]);
    this.form.controls['shopstatus'].setValidators([Validators.required]);



    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dointroduced")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
        if (this.oldshop != undefined && control.valid) {
          // @ts-ignore
          if (value === this.shop[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.loadForm();
  }

  loadForm(){
    this.oldshop = undefined;
    this.form.reset();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched(); });
    this.enableButtons(true,false,false);
    this.selectedrow =null;
  }

  loadTable(query: string){
    this.shs.getAll(query)
      .then((props: Shop[]) => {
        this.shops = props;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.shops);
        this.data.paginator = this.Paginator;
      });
  }

  filterTable(): void {


    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (shop: Shop, filter: string) => {

      return (csearchdata.csname == null || shop.name.toLowerCase().includes(csearchdata.csname)) &&
        (csearchdata.cstpnumber == null || shop.tpnumber.toLowerCase().includes(csearchdata.cstpnumber)) &&
        (csearchdata.csemail == null || shop.email.includes(csearchdata.csemail)) &&
        (csearchdata.cscontactperson == null || shop.contactperson.toLowerCase().includes(csearchdata.cscontactperson)) &&
        (csearchdata.cscontactpno == null || shop.contactpno.toLowerCase().includes(csearchdata.cscontactpno)) &&
        (csearchdata.csshopstatus == null || shop.shopstatus.name.toLowerCase().includes(csearchdata.csshopstatus));


    };

    this.data.filter = 'xx';
  }

  //Server side search
  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let name = ssearchdata.ssname;
    let tpnumber = ssearchdata.sstpnumber;
    let contactperson = ssearchdata.sscontactperson;
    let contactpno = ssearchdata.sscontactpno;
    let shopstatusid = ssearchdata.ssshopstatus;

    let query = "";

    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (tpnumber != null && tpnumber.trim() != "") query = query + "&tpnumber=" + tpnumber;
    if (contactperson != null && contactperson.trim() != "") query = query + "&contactperson=" + contactperson;
    if (contactpno != null && contactpno.trim() != "") query = query + "&contactpno=" + contactpno;
    if (shopstatusid != null) query = query + "&shopstatusid=" + shopstatusid

    if (query != "") query = query.replace(/^./,"?")
    this.loadTable(query);
  }

  //Clear Search
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

  //Add a shop
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Shop Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.shop = this.form.getRawValue();

      let proddata: string = "";

      proddata = proddata + "<br>Name is : "+ this.shop.name;
      proddata = proddata + "<br>Address is : "+ this.shop.address;
      proddata = proddata + "<br>Phone Number is : "+ this.shop.tpnumber;
      proddata = proddata + "<br>Contact Person is : "+ this.shop.contactperson;
      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Shop Add",
          message: "Are you sure to Add the folowing Shop? <br> <br>"+ proddata}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("ShopService.add(emp)");
          this.shs.add(this.shop).then((responce: []|undefined) => {
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
              data: {heading: "Status -Shop Add", message: addmessage}
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

  // Put date in the table to the form
  fillForm(shop: Shop){
    this.enableButtons(false,true,true);

    this.selectedrow = shop;

    this.shop = JSON.parse(JSON.stringify(shop));
    this.oldshop = JSON.parse(JSON.stringify(shop));


    // @ts-ignore
    this.shop.shopstatus = this.shopstatuses.find(s => s.id === this.shop.shopstatus.id);

    this.form.patchValue(this.shop);
    this.form.markAsPristine();
  }

  //Update Form
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Shop Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Shop Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.shop = this.form.getRawValue();

            // @ts-ignore
            this.shop.id = this.oldshop.id;
            this.shs.update(this.shop).then((responce: [] | undefined) => {
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
                data: {heading: "Status -Shop Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Shop Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Shop Delete",
        message: "Are you sure to Delete folowing Shop? <br> <br>" +
          "Shop Name :   "+this.shop.name + " <br> Shop Address :  " + this.shop.address + "<br> Shop Contact No : " + this.shop.tpnumber
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        this.shs.delete(this.shop.id).then((responce: [] | undefined) => {
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
            data: {heading: "Status - Shop Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

  //Clear form
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
        // this.oldshop = undefined;
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

