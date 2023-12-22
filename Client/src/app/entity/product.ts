import { Color } from "./color";
import { Productmaterial } from "./productmaterial";
import { Productstatus } from "./productstatus";
import { Producttype } from "./producttype";
import { Size } from "./size";
import { Thickness } from "./thickness";

export class Product {
  public id !: number;
  public code !: string;
  public name !: string;
  public qty !: number;
  public dointroduced !: string;
  public unitprice !: number;
  public description !: string;
  public photo !: string;
  public producttype !: Producttype;
  public productstatus !: Productstatus;
  public color !: Color;
  public size !: Size;
  public thickness !: Thickness;
  public productmaterials !: Array<Productmaterial>;


  constructor(id:number, code:string, name:string, qty:number, dointroduced:string, unitprice:number, description:string, photo:string, producttype:Producttype, productstatus:Productstatus, color:Color, size:Size, thickness:Thickness, productmaterials:Array<Productmaterial>) {
    this.id=id;
    this.code=code;
    this.name=name;
    this.qty=qty;
    this.dointroduced=dointroduced;
    this.unitprice=unitprice;
    this.description=description;
    this.photo=photo;
    this.producttype=producttype;
    this.productstatus=productstatus;
    this.color=color;
    this.size=size;
    this.thickness=thickness;
    this.productmaterials=productmaterials;
  }

}
