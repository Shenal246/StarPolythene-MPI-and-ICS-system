import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {RegexService} from "../../../service/regexservice";
import {Invoice} from "../../../entity/invoice";
import {Invoiceproduct} from "../../../entity/invoiceproduct";
import {Shop} from "../../../entity/shop";
import {Invoicestatus} from "../../../entity/invoicestatus";
import {Product} from "../../../entity/product";
import {InvoicestatusService} from "../../../service/invoicestatusservice";
import {ShopService} from "../../../service/shopservice";
import {ProductService} from "../../../service/productservice";
import {InvoiceService} from "../../../service/invoiceservice";
import {Productqty} from "../../../entity/productqty";


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {

  columns: string[] = ['name','shop','date', 'time', 'grandtotal','invoicestatus'];
  headers: string[] = ['Code','Shop', 'Date', 'Time', 'Grand Total','Invoice Status'];
  binders: string[] = ['name','shop.name', 'date', 'time', 'grandtotal','invoicestatus.name'];

  cscolumns: string[] = ['cscode', 'csshop','csdate', 'cstime', 'csgrandtotal','csinvoicestatus'];
  csprompts: string[] = ['Search by Code','Search by Shop', 'Search by Date', 'Search by Time',
    'Search by Grand Total','Search by Status'];

  incolumns: string[] = ['code', 'qty', 'unitprice', 'linetotal', 'remove'];
  inheaders: string[] = ['Code', 'Quantity', 'Unit Price', 'Line Total', 'Remove'];
  inbinders: string[] = ['product.code', 'qty', 'product.unitprice', 'linetotal', 'getBtn()'];


  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  invoice!:Invoice;
  oldinvoice!:Invoice;

  innerdata:any;
  oldinnerdata:any;

  regexes:any;

  invoices: Array<Invoice> = [];
  data!: MatTableDataSource<Invoice>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  indata!:MatTableDataSource<Invoiceproduct>

  shops: Array<Shop> = [];
  invoicestatuses: Array<Invoicestatus> = [];
  products: Array<Product> = [];

  productsqty: Array<Productqty> = [];

  grandtotal = 0;

  selectedrow: any;

  invoiceproducts:Array<Invoiceproduct> = [];

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  uiassist: UiAssist;

  constructor(
    private fb:FormBuilder,
    private ist:InvoicestatusService,
    private cs:ShopService,
    private it:ProductService,
    private is:InvoiceService,
    private dg:MatDialog,
    private dp:DatePipe,
    private rs:RegexService
  ) {

    this.uiassist = new UiAssist(this);
    this.invoiceproducts = new Array<Invoiceproduct>();

    this.csearch = this.fb.group({
      "csdate": new FormControl(),
      "cscode": new FormControl(),
      "cstime": new FormControl(),
      "csgrandtotal": new FormControl(),
      "csshop": new FormControl(),
      "csinvoicestatus": new FormControl()
    });

    this.form = this.fb.group({
      "shop": new FormControl('',Validators.required),
      "name": new FormControl('',Validators.required),
      "grandtotal": new FormControl('',Validators.required),
      "date": new FormControl('',Validators.required),
      "time": new FormControl('',Validators.required),
      "invoicestatus": new FormControl('',Validators.required)
    }, {updateOn: 'change'});


    this.innerform = this.fb.group({
      "product": new FormControl('',Validators.required),
      "qty": new FormControl('',Validators.required),
    }, {updateOn: 'change'});


    this.ssearch = this.fb.group({
      "ssproduct": new FormControl(),
      "ssshop": new FormControl(),
      "ssinvoicestatus": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {

    this.createView();

    this.ist.getAllList().then((inst: Invoicestatus[]) => {
      this.invoicestatuses = inst;
    });

    this.cs.getAllList().then((cus: Shop[]) => {
      this.shops = cus;
    });

    this.it.getAll("").then((itms: Product[]) => {
      this.products = itms;
    });

    this.it.getAllListQty().then((prodqty: Productqty[]) => {
      this.productsqty = prodqty;
    });

    this.rs.get('invoice').then((rgx:any[])=>{
      this.regexes = rgx;
      this.createForm();
    }) ;

    console.log("Products Qty :"+ JSON.stringify(this.productsqty));

  }


  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  loadTable(query: string) {

    this.is.getAll(query)
      .then((invs: Invoice[]) => {
        this.invoices = invs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.invoices);
        this.data.paginator = this.paginator;
      });

  }

  getBtn(element:Invoice){
    return `<button mat-raised-button>Modify</button>`;
  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (invoice: Invoice, filter: string) => {
      return(cserchdata.cscode == null || invoice.name.toLowerCase().includes(cserchdata.cscode.toLowerCase())) &&
        (cserchdata.csdate == null || invoice.date.includes(cserchdata.csdate)) &&
        (cserchdata.cstime == null || invoice.time.includes(cserchdata.cstime)) &&
        (cserchdata.csshop == null || invoice.shop.name.toLowerCase().includes(cserchdata.csshop.toLowerCase())) &&
        (cserchdata.csinvoicestatus == null || invoice.invoicestatus.name.toLowerCase().includes(cserchdata.csinvoicestatus.toLowerCase())) &&
        (cserchdata.csgrandtotal == null || invoice.grandtotal.toString().includes(cserchdata.csgrandtotal));
    };

    this.data.filter = 'xx';

  }


  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let shopid = sserchdata.ssshop;
    let statusid = sserchdata.ssinvoicestatus;

    let query = "";

    if (shopid != null) query = query + "&shopid=" + shopid;
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

      let linetotal = this.innerdata.qty * this.innerdata.product.unitprice;

      let invoiceproduct = new  Invoiceproduct(this.id,this.innerdata.product,this.innerdata.qty,linetotal);

      let tem: Invoiceproduct[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.invoiceproducts = [];
      tem.forEach((t)=> this.invoiceproducts.push(t));

      this.invoiceproducts.push(invoiceproduct);
      this.indata = new MatTableDataSource(this.invoiceproducts);

      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  calculateGrandTotal(){

    this.grandtotal = 0;

    this.indata.data.forEach((e)=>{
      this.grandtotal = this.grandtotal+e.linetotal
    })

    this.form.controls['grandtotal'].setValue(this.grandtotal);
  }

  deleteRaw(x:any) {

    // this.indata.data = this.indata.data.reduce((element) => element.id !== x.id);

    let datasources = this.indata.data

    const index = datasources.findIndex(product => product.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.invoiceproducts = this.indata.data;

    this.calculateGrandTotal();
  }


  createForm() {

    this.form.controls['shop'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['time'].setValidators([Validators.required]);
    this.form.controls['invoicestatus'].setValidators([Validators.required]);

    this.innerform.controls['product'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldinvoice != undefined && control.valid) {
            // @ts-ignore
            if (value === this.invoice[controlName]) {
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
        data: {heading: "Errors - Invoice Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.invoice = this.form.getRawValue();
      this.invoice.invoiceproducts = this.invoiceproducts;

      // @ts-ignore
      this.invoiceproducts.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.invoice.date = this.dp.transform(this.invoice.date,"yyy-mm-dd");
      this.invoice.time = this.invoice.time+":00";

      let invdata: string = "";

      invdata = invdata + "<br>Shop is : " + this.invoice.shop.name
      invdata = invdata + "<br>Grand Total is : " + this.invoice.grandtotal;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Invoice Add",
          message: "Are you sure to Add the following Invoice? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");
          this.is.add(this.invoice).then((responce: [] | undefined) => {
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

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }


  fillForm(invoice: Invoice) {

    this.enableButtons(false,true,true);

    this.selectedrow=invoice;

    this.invoice = JSON.parse(JSON.stringify(invoice));
    this.oldinvoice = JSON.parse(JSON.stringify(invoice));

    //@ts-ignore
    this.invoice.shop = this.shops.find(c => c.id === this.invoice.shop.id);

    //@ts-ignore
    this.invoice.invoicestatus = this.invoicestatuses.find(s => s.id === this.invoice.invoicestatus.id);

    this.indata = new MatTableDataSource(this.invoice.invoiceproducts);

    this.form.patchValue(this.invoice);
    this.form.markAsPristine();

  }


  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }

    const productNames = this.indata.data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.product.code + ", "; }, "");

    if (productNames) {
      updates = updates + "<br>Products: " + productNames.slice(0, -1) + " Changed"; // Remove the trailing ", " from the materialNames
    }
    return updates;

  }


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Invoice Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Invoice Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.invoice = this.form.getRawValue();
            this.invoice.id = this.oldinvoice.id;

            this.invoice.invoiceproducts = this.invoiceproducts;

            // @ts-ignore
            this.invoiceproducts.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.invoice.date = this.dp.transform(this.invoice.date,"yyy-mm-dd");

            this.is.update(this.invoice).then((responce: [] | undefined) => {

              if (responce != undefined) { // @ts-ignore

                // @ts-ignore
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
                data: {heading: "Status -Invoice Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Invoice Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }



  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Invoice Delete",
        message: "Are you sure to Delete following User? <br> <br>" + this.invoice.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.is.delete(this.invoice.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Invoice Delete ", message: delmessage}
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
        heading: "Confirmation - Invoice data Clear",
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
