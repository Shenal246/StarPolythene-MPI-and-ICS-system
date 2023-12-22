import { Material } from "./material";

export class Purordermaterial {
  public id !: number;
  public qty !: number;
  public explinetotal !: number;
  public material !: Material;


  constructor(id:number, qty:number, explinetotal:number, material:Material) {
    this.id=id;
    this.qty=qty;
    this.explinetotal=explinetotal;
    this.material=material;
  }

}
