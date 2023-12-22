import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Invoicebyshop} from "../../entity/invoicebyshop";
import {ReportService} from "../../reportservice";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";


declare var google: any;

@Component({
  selector: 'app-designation',
  templateUrl: './invoicebyshops.component.html',
  styleUrls: ['./invoicebyshops.component.css'],
  })


export class InvoicebyshopsComponent implements OnInit {

  invoicebyshopcomponent: Invoicebyshop[] = [];
  data!: MatTableDataSource<Invoicebyshop>;

  public form!: FormGroup;

  years: string[] = ["2021", "2022", "2023"];

  columns: string[] = ['name', 'totalgrandtotal', 'percentage'];
  headers: string[] = ['Shop Name', 'Total Sales', 'Percentage'];
  binders: string[] = ['shop', 'totalgrandtotal', 'percentage'];

  @ViewChild('piechart', { static: false }) piechart: any;

  constructor(
    private invoicebyYearService: ReportService,
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

      this.invoicebyshopcomponent = await this.invoicebyYearService.invoiveByShop(year);

      // Calculate the total sum of all totalgrandtotal values
      const totalSum = this.invoicebyshopcomponent.reduce((sum, pbp) => sum + pbp.totalgrandtotal, 0);

      // Calculate and set the percentage for each shop
      this.invoicebyshopcomponent.forEach((pbp: Invoicebyshop) => {
        pbp.percentage =((pbp.totalgrandtotal / totalSum) * 100).toFixed(2);
      });

      this.loadTable();
      this.drawCharts();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.invoicebyshopcomponent);
  }

  loadCharts(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts() {

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'shop');
    pieData.addColumn('number', 'qty');

    this.invoicebyshopcomponent.forEach((pbp: Invoicebyshop) => {
      pieData.addRow([pbp.shop, pbp.totalgrandtotal]);
    });

    const pieOptions = {
      title: 'Total Sales (Pie Chart)',
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
    this.form.controls['year'].setValue("");
    // @ts-ignore
    this.data = new MatTableDataSource([]); // Clear table data

  }


}
