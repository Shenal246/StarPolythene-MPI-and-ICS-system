import { DatePipe } from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Color } from 'src/app/entity/color';
import { Material } from 'src/app/entity/material';
import { Product } from 'src/app/entity/product';
import { Productmaterial } from 'src/app/entity/productmaterial';
import { Productstatus } from 'src/app/entity/productstatus';
import { Producttype } from 'src/app/entity/producttype';
import { Size } from 'src/app/entity/size';
import { Thickness } from 'src/app/entity/thickness';
import { ColorService } from 'src/app/service/colorservice';
import { MaterialService } from 'src/app/service/materialservice';
import { ProductService } from 'src/app/service/productservice';
import { Productstatuseservice } from 'src/app/service/productstatusservice';
import { Producttypeservice } from 'src/app/service/producttypeservice';
import { RegexService } from 'src/app/service/regexservice';
import { SizeService } from 'src/app/service/sizeservice';
import { Thicknesseservice } from 'src/app/service/thicknessservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  cols = '12';
  columns: string[] = ['code', 'color', 'qty', 'unitprice', 'size', 'thickness'];
  headers: string[] = ['Code', 'Color', 'Quntity(Kg)', 'Price(Rs)', 'Size(inches)', 'Thickness(mm)'];
  binders: string[] = ['code', 'color.name', 'qty', 'unitprice', 'size.name', 'thickness.name'];

  cscolumns: string[] = ['cscode', 'cscolor', 'csqty', 'csunitprice', 'cssize', 'csthickness'];
  csprompts: string[] = ['Search by Code', 'Search by Color', 'Search by Quantity', 'Search by Unitprice',
    'Search by Size', 'Search by Thickness'];

  // Inner Table
  innercolumns: string[] = ['material', 'quantity', 'linecost', 'remove'];
  innerheaders: string[] = ['Material', 'Quntity(Kg)', 'LineCost(Rs)','Remove'];
  innerbinders: string[] = ['material.name', 'quantity', 'linecost','getBtn()'];
  products: Array<Product> = [];

  imageurl: string = '';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  product!: Product;
  oldproduct!: Product|undefined;
  selectedrow: any;

  data!: MatTableDataSource<Product>;
  indata!: MatTableDataSource<Productmaterial>;
  innerdata!: any

  oldinnerdata:any;

  @ViewChild(MatPaginator) Paginator!: MatPaginator;
  imageempurl: string= 'assets/defaultpol.jpg'

  praadd:boolean = false;
  praupd:boolean = false;
  pradel:boolean = false;

  colors: Array<Color> = [];
  sizes: Array<Size> = [];
  productstatuses: Array<Productstatus> = [];
  producttypes: Array<Producttype> = [];
  thicknesses: Array<Thickness> = [];
  materials: Array<Material> = [];

  productmaterials: Array<Productmaterial> = [];
  regexes: any;

  unitprice = 0;

  uiassist:UiAssist;

  constructor(private ps: ProductService,
              private fb: FormBuilder,
              private cs: ColorService,
              private ss: SizeService,
              private dg: MatDialog,
              private pss: Productstatuseservice,
              private pt: Producttypeservice,
              private ts: Thicknesseservice,
              private ms: MaterialService,
              private rs: RegexService,
              private dp: DatePipe) {

    this.uiassist = new UiAssist(this);
    this.productmaterials = new Array<Productmaterial>();

    this.csearch = this.fb.group({
      "cscode": new FormControl(),
      "cscolor": new FormControl(),
      "csqty": new FormControl(),
      "csunitprice": new FormControl(),
      "cssize": new FormControl(),
      "csthickness": new FormControl()
    });


    this.ssearch = this.fb.group({
      "sscode": new FormControl(),
      "sscolor": new FormControl(),
      "ssunitprice": new FormControl(),
      "sssize": new FormControl(),
      "ssthickness": new FormControl()
    });

    this.form = this.fb.group({
      "code": new FormControl('',[Validators.required,Validators.pattern("^[A-Z]{2}\\d{3}$")]),
      "name": new FormControl('',[Validators.required]),
      "qty": new FormControl('',[Validators.required]),
      "dointroduced": new FormControl('',[Validators.required]),
      "unitprice": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "photo": new FormControl(''),
      "producttype": new FormControl('',[Validators.required]),
      "productstatus": new FormControl('',[Validators.required]),
      "color": new FormControl('', ),
      "size": new FormControl('',[Validators.required]),
      "thickness": new FormControl('',[Validators.required]),

    });

    this.innerform = this.fb.group({
      "material": new FormControl('',[Validators.required]),
      "quantity": new FormControl('',[Validators.required]),

    }, {updateOn: 'change'});
  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.createView();
    this.cs.getAllList().then((cos: Color[]) => { this.colors = cos;  });
    this.ss.getAllList().then((sizs: Size[]) => { this.sizes = sizs;  });
    this.pss.getAllList().then((prsts: Productstatus[]) => { this.productstatuses = prsts; });
    this.pt.getAllList().then((pts: Producttype[]) => { this.producttypes = pts; });
    this.ts.getAllList().then((thicks: Thickness[]) => { this.thicknesses = thicks; });
    this.ms.getListlist().then((mats: Material[]) => { this.materials = mats; });
    this.rs.get('product').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
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
    this.form.controls['code'].setValidators([Validators.required,Validators.pattern(this.regexes['code']['regex'])]);
    this.form.controls['name'].setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['qty'].setValidators([Validators.required]);
    this.form.controls['dointroduced'].setValidators([Validators.required]);
    this.form.controls['unitprice'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['photo'] ;
    this.form.controls['producttype'].setValidators([Validators.required]);
    this.form.controls['productstatus'].setValidators([Validators.required]);
    this.form.controls['color'].setValidators([Validators.required]);
    this.form.controls['size'].setValidators([Validators.required]);
    this.form.controls['thickness'].setValidators([Validators.required]);

    this.innerform.controls['material'].setValidators([Validators.required]);
    this.innerform.controls['quantity'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {control.markAsTouched();});
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dointroduced")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
        if (this.oldproduct != undefined && control.valid) {
          // @ts-ignore
          if (value === this.product[controlName]){ control.markAsPristine(); }
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
    // loadForm eka athule ewa karanawa ne

    //this.enableButtons(true,false,false);
    this.loadForm();
  }

  loadForm(){
    this.oldproduct = undefined;
    this.form.reset();
    this.innerform.reset();
    this.clearImage();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched(); });
    this.enableButtons(true,false,false);
    this.selectedrow =null;
  }

  id = 0;
  btnaddMC(){

    this.innerdata = this.innerform.getRawValue();

    if( this.innerdata != null){

      let linecost = this.innerdata.quantity * this.innerdata.material.unitprice;

      let peroductmaterial = new  Productmaterial(this.id,this.innerdata.quantity,linecost,this.innerdata.material,);

      let tem: Productmaterial[] = [];
      if(this.indata != null) this.indata.data.forEach((i:any) => tem.push(i));

      this.productmaterials = [];
      tem.forEach((t)=> this.productmaterials.push(t));

      this.productmaterials.push(peroductmaterial);
      this.indata = new MatTableDataSource(this.productmaterials);

      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }


  calculateGrandTotal(){
    // console.log(this.unitprice)
    this.unitprice = 0;

    this.indata.data.forEach((e:any)=>{
      this.unitprice = this.unitprice+e.linecost;
    })
    this.unitprice += ((this.unitprice * 10) / 100);
    this.form.controls['unitprice'].setValue(this.unitprice);
  }

  deleteRaw(x:any) {

    let datasources = this.indata.data

    const index = datasources.findIndex((m:any)=> m.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.productmaterials = this.indata.data;

    this.calculateGrandTotal();
  }


  getBtn(element:Product){
    return `<button mat-raised-button>Modify</button>`;
  }

  // Main Table
  loadTable(query: string){
    this.ps.getAll(query)
      .then((props: Product[]) => {
        this.products = props;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.products);
        this.data.paginator = this.Paginator;
      });
  }

  // getModi(element: Product){
  //   return element.number + '(' + element.callingname + ')';
  // }

  filterTable(): void {


    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (product: Product, filter: string) => {

      return (csearchdata.cscode == null || product.code.toLowerCase().includes(csearchdata.cscode)) &&
        (csearchdata.cscolor == null || product.color.name.toLowerCase().includes(csearchdata.cscolor)) &&
        (csearchdata.csqty == null || product.qty.toString().includes(csearchdata.csqty)) &&
        (csearchdata.csunitprice == null || product.unitprice.toString().includes(csearchdata.csunitprice)) &&
        (csearchdata.cssize == null || product.size.name.toLowerCase().includes(csearchdata.cssize)) &&
        (csearchdata.csthickness == null || product.thickness.name.toLowerCase().includes(csearchdata.csthickness));


    };

    this.data.filter = 'xx';
  }

  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let code = ssearchdata.sscode;
    let colorid = ssearchdata.sscolor;
    let unitprice = ssearchdata.ssunitprice;
    let sizeid = ssearchdata.sssize;
    let thicknessid = ssearchdata.ssthickness;

    let query = "";

    if (code != null && code.trim() != "") query = query + "&code=" + code;
    if (unitprice != null && unitprice.trim() != "") query = query + "&unitprice=" + unitprice;
    if (colorid != null) query = query + "&colorid=" + colorid;
    if (sizeid != null) query = query + "&sizeid=" + sizeid;
    if (thicknessid != null) query = query + "&thicknessid=" + thicknessid;

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

  clearImage(): void{
    this.imageempurl = 'assets/defaultpol.jpg';
    this.form.controls['photo'].setErrors({'required': true });
  }

  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Product Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.product = this.form.getRawValue();
      // innerForm
      this.product.productmaterials = this.productmaterials;

      // @ts-ignore
      this.productmaterials.forEach((i)=> delete i.id);

      //console.log("Photo-Before"+this.product.photo);
      if (btoa(this.imageempurl) != null)
      this.product.photo=btoa(this.imageempurl);
      //console.log("Photo-After"+this.product.photo);

      let proddata: string = "";

      proddata = proddata + "<br>Code is : "+ this.product.code;
      proddata = proddata + "<br>Quantity is : "+ this.product.qty;
      proddata = proddata + "<br>Color is : "+ this.product.color.name;
      proddata = proddata + "<br>Grand Total is : " + this.product.unitprice;
      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Product Add",
          message: "Are you sure to Add the folowing Product? <br> <br>"+ proddata}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("ProductService.add(emp)");
          this.ps.add(this.product).then((responce: []|undefined) => {
            // console.log("Res-"+responce);
            // console.log("Un-"+responce==undefined);
            if(responce!=undefined){ // @ts-ignore
              // console.log("Add-"+responce['id']+"-"+responce['url']+"-"+(responce['errors']==""));
              // @ts-ignore
              addstatus = responce['errors']=="";
              // console.log("Add Sta-"+addstatus);
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
              this.innerform.reset();
              this.indata.data = [];
              this.clearImage();
              this.loadTable("");
            }
            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Product Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => { if (!result) { return;} }) ;} );
        }
      });
    }
  }


  // up to this point
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

  fillForm(product: Product){
    this.enableButtons(false,true,true);

    this.selectedrow = product;

    this.product = JSON.parse(JSON.stringify(product));
    this.oldproduct = JSON.parse(JSON.stringify(product));

    if (this.product.photo != null){
      this.imageempurl = atob(this.product.photo);
      this.form.controls['photo'].clearValidators();
    }else {
      this.clearImage();
    }
    this.product.photo = "";
    // @ts-ignore
    this.product.color = this.colors.find(g => g.id === this.product.color.id);
    // @ts-ignore
    this.product.size = this.sizes.find(d => d.id === this.product.size.id);
    // @ts-ignore
    this.product.productstatus = this.productstatuses.find(s => s.id === this.product.productstatus.id);
    // @ts-ignore
    this.product.producttype = this.producttypes.find(s => s.id === this.product.producttype.id);
    // @ts-ignore
    this.product.thickness = this.thicknesses.find(s => s.id === this.product.thickness.id);

    this.indata = new MatTableDataSource(this.product.productmaterials);

    this.form.patchValue(this.product);
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
        data: {heading: "Errors - Product Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Product Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.product = this.form.getRawValue();
            this.product.productmaterials = this.productmaterials;

            if (this.form.controls['photo'].dirty) this.product.photo = btoa(this.imageempurl);
            else { // @ts-ignore
              this.product.photo = this.oldproduct.photo;
            }
            // @ts-ignore
            this.product.id = this.oldproduct.id;

            this.ps.update(this.product).then((responce: [] | undefined) => {
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
                this.indata.data = [];
                this.loadForm();
                this.loadTable("");
              }
              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Product Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Product Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }

  delete() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Product Delete",
        message: "Are you sure to Delete folowing Product? <br> <br>" +
          this.product.code + " - " + this.product.color.name + "( " + this.product.size.name + " )"
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        this.ps.delete(this.product.id).then((responce: [] | undefined) => {
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
            data: {heading: "Status - Product Delete ", message: delmessage}
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
        this.indata.data = [];
        this.loadForm();
        // this.oldproduct = undefined;
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

