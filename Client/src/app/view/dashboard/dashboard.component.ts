import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";
import {Proorder} from "../../entity/proorder";
import {UiAssist} from "../../util/ui/ui.assist";
import {ProorderService} from "../../service/proorderservice";
import {Dashboardservice} from "../../dashboard/dashboardservice";
import {Productdashboard} from "../../dashboard/entity/productdashboard";
import {Salesdashboard} from "../../dashboard/entity/salesdashboard";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  columns: string[] = ['code','date','expdate', 'manager', 'supervisor'];
  headers: string[] = ['Code','Date', 'Expire Date', 'Manager', 'Supervisor'];
  binders: string[] = ['code','date', 'expdate', 'employee.callingname', 'supervisor.callingname'];

  datax!: MatTableDataSource<Proorder>;

  productdashboard!: Productdashboard ;
  producttotal: number = 0;

  salesdashboard!: Salesdashboard ;

  salestotal: number = 0;

  uiassist:UiAssist;

  proorder!:Proorder;

  proorders: Array<Proorder> = [];

  imageurl: string = '';

  constructor(private http: HttpClient,
              private pros:ProorderService,
              private ds:Dashboardservice){

    this.uiassist = new UiAssist(this);
  }

  ngOnInit(): void {
    this.initialize();
    }

  initialize() {
    // this.loadTable("");
    this.pros.getAll("").then((proo: Proorder[]) => {
      this.proorders = proo.filter(proorder => proorder.proorderstatus.id === 1);
    })
      .finally(() => {
              this.datax = new MatTableDataSource(this.proorders);
            });

    this.ds.productdashboard().then((proddash: Productdashboard) => {
      this.productdashboard = proddash;
      this.producttotal = this.productdashboard.total;
    });

    this.ds.salesdashboard().then((salesdash: Salesdashboard) => {
      this.salesdashboard = salesdash;
      this.salestotal = this.salesdashboard.total;
    });

  }


  title = 'angular16';
  //Sidebar toggle show hide function
  status = false;


  addToggle()
  {
    this.status = !this.status;
  }
  data:any;
}
