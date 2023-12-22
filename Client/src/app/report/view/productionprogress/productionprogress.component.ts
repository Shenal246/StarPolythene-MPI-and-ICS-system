import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Productionproductservice} from "../../../service/productionproductservice";
import {Productionproductprogress} from "../../../entity/Productionproductprogress";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";

declare var google: any;

@Component({
  selector: 'app-designation',
  templateUrl: './productionprogress.component.html',
  styleUrls: ['./productionprogress.component.css'],
  })

export class ProductionprogressComponent implements OnInit {

  data!: MatTableDataSource<Productionproductprogress>;

  columns: string[] = ['prductName','qtyStartYear', 'qtyEndYear','difference'];
  headers: string[] = ['productName','2021 Production', '2022 Production','Difference'];
  binders: string[] = ['prductName','qtyStartYear', 'qtyEndYear','difference'];

  productionproduct : Array<Productionproductprogress> = [];


  public form!: FormGroup;

  @ViewChildren('printableContent') printableContents!: QueryList<ElementRef>;


  @ViewChild('columnchart', { static: false }) columnchart: any;

  constructor(
     private pp : Productionproductservice,
     private fb: FormBuilder,
     private dp: DatePipe,

  ) {
    this.form = this.fb.group({
      "startdate": new FormControl(),
      "enddate": new FormControl()

    });
  }

  ngOnInit(): void {

    this.loadTable("");
    this.loadCharts();
  }


  loadTable(query:string): void {
    this.pp.getAllList(query)
      .then((pps: Productionproductprogress[]) => {
        this.productionproduct = pps.map((pp: Productionproductprogress) => ({
          ...pp,
          difference: pp.qtyStartYear - pp.qtyEndYear,
          startYear: pp.qtyStartYear,
          endYear: pp.qtyEndYear
        }));

        this.data = new MatTableDataSource(this.productionproduct)
        // Call the function to transform data for the chart
        const chartData = this.transformDataForChart(this.productionproduct);
        // Draw the Google Column Chart
        this.drawColumnChart(chartData);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  btnSearch(): void{
    const searchdata = this.form.getRawValue();

    let startdate = searchdata.startdate;
    let enddate = searchdata.enddate;

    if (startdate != null) {
      startdate = this.dp.transform(new Date(startdate),'yyyy');
    }
    if (enddate != null) {
      enddate = this.dp.transform(new Date(enddate),'yyyy');
    }

    console.log(startdate)
    console.log(enddate)

    let query = "";

    if (startdate != null && startdate.trim() != "") query = query + "&startyear=" + startdate;
    if (enddate != null && enddate.trim() != "") query = query + "&endyear=" + enddate;

    if (query != "") query = query.replace(/^./,"?")
    this.loadTable(query);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
  }

  transformDataForChart(productionproducts: Productionproductprogress[]): any[][] {
    const chartData: any[][] = [['Product Name', '2022 Production', '2023 Production']];

    productionproducts.forEach((pp: Productionproductprogress) => {
      const qtyStartYear = Number(pp.qtyStartYear); // Convert to number if not already a number
      const qtyEndYear = Number(pp.qtyEndYear); // Convert to number if not already a number
      chartData.push([pp.prductName, qtyStartYear, qtyEndYear]);
    });

    return chartData;
  }

  drawColumnChart(chartData: any[][]): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => {
      const barData = google.visualization.arrayToDataTable(chartData);

      const barOptions = {
        title: 'Production Progress (Bar Chart)',
        subtitle: 'Production comparison with the previous year',
        bars: 'horizontal',
        height: 400,
        width: 600,
      };

      const columnChart = new google.visualization.ColumnChart(this.columnchart.nativeElement);
      columnChart.draw(barData, barOptions);
    });
  }

  clearChart(): void {
    const chartContainer = this.columnchart.nativeElement;
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

  //
  // printPage() {
  //   if (this.printableContents && this.printableContents.length > 0) {
  //     const printContent = this.printableContents.first.nativeElement.innerHTML;
  //     const originalContent = document.body.innerHTML;
  //
  //     // Temporarily replace the body content with the printable content
  //     document.body.innerHTML = printContent;
  //
  //     // Trigger the browser's built-in print functionality
  //     window.print();
  //
  //     // Restore the original body content
  //     document.body.innerHTML = originalContent;
  //   }
  // }

}
