import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ProductByYear} from "../../entity/productByYear";
import {ReportService} from "../../reportservice";


declare var google: any;

@Component({
  selector: 'app-designation',
  templateUrl: './productionbyproduct.component.html',
  styleUrls: ['./productionbyproduct.component.css'],
  })

export class ProductionByProductComponent implements OnInit {

  productByYears: ProductByYear[] = [];
  data!: MatTableDataSource<ProductByYear>;

  public form!: FormGroup;

  years: string[] = ["2021", "2022", "2023"];

  columns: string[] = ['code', 'quantity', 'percentage'];
  headers: string[] = ['Product Code', 'Quantity', 'Percentage'];
  binders: string[] = ['code', 'quantity', 'percentage'];

  @ViewChild('piechart', { static: false }) piechart: any;

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder,) {
    this.form = this.fb.group({
      "year": new FormControl()

    });
  }

  ngOnInit(): void {
    this.loadCharts();
  }

  async loadDataForYear(): Promise<void> {
    try {

      const year = this.form.get('year')?.value;

      this.productByYears = await this.reportService.productByYear(year);

      // Calculate the total sum of all totalgrandtotal values
      const totalSum = this.productByYears.reduce((sum, pbp) => sum + pbp.quantity, 0);

      // Calculate and set the percentage for each shop
      this.productByYears.forEach((pbp: ProductByYear) => {
        pbp.percentage =((pbp.quantity / totalSum) * 100).toFixed(2);
      });

      this.loadTable();
      this.drawCharts();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.productByYears);
  }

  loadCharts(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'code');
    pieData.addColumn('number', 'quantity');

    this.productByYears.forEach((pbp: ProductByYear) => {
      pieData.addRow([pbp.code, pbp.quantity]);
    });

    const pieOptions = {
      title: 'Production Product (Pie Chart)',
      height: 400,
      width: 550,
    };

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);
  }

  clearChart(): void {
    const chartContainer = this.piechart.nativeElement;
    if (chartContainer) {
      chartContainer.innerHTML = ''; // Clear the chart container's content
    }
    this.clearSearch();
  }

  clearSearch(): void {
    // @ts-ignore
    this.data = new MatTableDataSource([]); // Clear table data
    this.form.controls['year'].setValue("");

  }

}
