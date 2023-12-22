import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {MaterialStockCount} from "../../entity/materialStockCount";
import {ReportService} from "../../reportservice";


declare var google: any;

@Component({
  selector: 'app-designation',
  templateUrl: './MaterialStockCount.component.html',
  styleUrls: ['./MaterialStockCount.component.css'],
  })


export class MaterialStockCountComponent implements OnInit {

  MaterialStockCountcomponent: MaterialStockCount[] = [];
  data!: MatTableDataSource<MaterialStockCount>;

  public form!: FormGroup;

  columns: string[] = ['code', 'quantity', 'unitprice', 'percentage'];
  headers: string[] = ['Material Code', 'Quantity', 'Unit Price', 'Percentage'];
  binders: string[] = ['code', 'quantity', 'unitprice', 'percentage'];

  @ViewChild('piechart', { static: false }) piechart: any;

  constructor(
    private materialstockcountservice: ReportService,
    private fb: FormBuilder,) {
    this.form = this.fb.group({
      "year": new FormControl()

    });
  }

  ngOnInit(): void {
    this.loadCharts();
    this.loadTable();
  }


  async loadTable(): Promise<void> {

    this.MaterialStockCountcomponent = await this.materialstockcountservice.materialStockCount();

    // Calculate the total sum of all totalgrandtotal values
    const totalSum = this.MaterialStockCountcomponent.reduce((sum, pbp) => sum + pbp.quantity, 0);

    // Calculate and set the percentage for each material
    this.MaterialStockCountcomponent.forEach((pbp: MaterialStockCount) => {
      pbp.percentage = ((pbp.quantity / totalSum) * 100).toFixed(2);
    });

    this.data = new MatTableDataSource(this.MaterialStockCountcomponent);


    this.drawCharts();

  }

  loadCharts(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'code');
    pieData.addColumn('number', 'quantity');

    this.MaterialStockCountcomponent.forEach((pbp: MaterialStockCount) => {
      pieData.addRow([pbp.code, pbp.quantity]);
    });

    const pieOptions = {
      title: 'Material Stock Count (Pie Chart)',
      height: 400,
      width: 550,
    };

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);
  }


}
