import { Material } from "./material";
import { Supplier } from "./supplier";

export class Supply {
  public id !: number;
  public material !: Material;
  public supplier !: Supplier;

  constructor(material:Material) {
    this.material=material;
  }

  // constructor(id: number, material: Material, supplier: Supplier) {
  //   this.id = id;
  //   this.material = material;
  //   this.supplier = supplier;
  // }
}
