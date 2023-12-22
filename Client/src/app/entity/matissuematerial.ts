import {Material} from "./material";

export class Matissuematerial {
  public id !: number;
  public qty !: number;
  public material !: Material;

  constructor(id: number, qty: number,material:Material) {
    this.id=id;
    this.qty=qty;
    this.material=material;
  }
}
