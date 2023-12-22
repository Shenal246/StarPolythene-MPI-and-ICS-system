import { Material } from "./material";

export class Productmaterial {
  public id !: number;
  public quantity !: number;
  public linecost !: number;
  public material !: Material;


  constructor(id:number, quantity:number, linecost:number, material:Material) {
    this.id=id;
    this.quantity=quantity;
    this.linecost=linecost;
    this.material=material;
  }

}
