import {Material} from "./material";

export class Grnmaterial {

  public id !: number;
  public material !: Material;
  public unitcost !: number;
  public qty !: number;
  public linecost !: number;

  constructor(id: number, material: Material,unitcost:number,qty:number,linecost:number) {
    this.id=id;
    this.material=material;
    this.unitcost = unitcost;
    this.qty = qty;
    this.linecost = linecost;
  }
}
