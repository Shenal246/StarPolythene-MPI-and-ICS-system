import { Component } from '@angular/core';
import {ProductionByProduct} from "../../entity/productionbyproduct";
import {MatTableDataSource} from "@angular/material/table";
import {Productdeman} from "../../entity/productdeman";
import {CountByDesignation} from "../../entity/countbydesignation";
import {ReportService} from "../../reportservice";

declare var google: any;

@Component({
  selector: 'app-productdeman',
  templateUrl: './productdeman.component.html',
  styleUrls: ['./productdeman.component.css']
})
export class ProductdemanComponent {

  productdemans!:Productdeman[]
  data!: MatTableDataSource<Productdeman>;

  columns: string[] = ['code','prductName','qty2021','qty2022','increase'];
  headers: string[] = ['Code','Name', 'QTY-2021','QTY-2021','Increase'];
  binders: string[] = ['code','prductName','qty2021','qty2022','increase'];


  constructor(private rs: ReportService) {
  }

  ngOnInit(): void {

    this.rs.productdeman()
      .then((des: Productdeman[]) => {
        this.productdemans = des;
      }).finally(() => {
      this.loadTable();
      //this.loadCharts();
    });

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.productdemans);
  }


}
