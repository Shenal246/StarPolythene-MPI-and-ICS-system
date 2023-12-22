import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {HomeComponent} from "./view/home/home.component";

import {UserComponent} from "./view/modules/user/user.component";
import { ProductComponent } from './view/modules/product/product.component';
import { CountByDesignationComponent } from './report/view/countbydesignation/countbydesignation.component';
import { ArrearsByProgramComponent } from './report/view/arrearsbyprogram/arrearsbyprogram.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { ProductionByProductComponent } from './report/view/productionbyproduct/productionbyproduct.component';
import { ProductionprogressComponent } from './report/view/productionprogress/productionprogress.component';
import { MaterialComponent } from './view/modules/material/material.component';
import { SupplierComponent } from './view/modules/supplier/supplier.component';
import { ShopComponent } from './view/modules/shop/shop.component';
import { PaymentComponent } from './view/modules/payment/payment.component';
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {PurorderComponent} from "./view/modules/purorder/purorder.component";
import {MatissueComponent} from "./view/modules/matissue/matissue.component";
import {ProductionComponent} from "./view/modules/production/production.component";
import {ProorderComponent} from "./view/modules/proorder/proorder.component";
import {GrnComponent} from "./view/modules/grn/grn.component";
import {InvoiceComponent} from "./view/modules/invoice/invoice.component";
import {ProductdemanComponent} from "./report/view/productdeman/productdeman.component";
import {InvoicebyshopsComponent} from "./report/view/invoicebyshops/invoicebyshops.component";
import {
  MaterialStockCountComponent} from "./report/view/materialstockcount/materialstockcount.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "product", component: ProductComponent},
      {path: "user", component: UserComponent},
      {path: "report-countbydesignation", component: CountByDesignationComponent},
      {path: "report-arrearsebyprogram", component: ArrearsByProgramComponent},
      {path: "report-productionbyproduct", component: ProductionByProductComponent},
      {path: "report-productionprogress", component: ProductionprogressComponent},
      {path: "report-productdemand", component: ProductdemanComponent},
      {path: "report-invoicebyshops", component: InvoicebyshopsComponent},
      {path: "report-materialstock", component: MaterialStockCountComponent},
      {path: "dashboard", component: DashboardComponent},
      {path: "material", component: MaterialComponent},
      {path: "supplier", component: SupplierComponent},
      {path: "shop", component: ShopComponent},
      {path: "payment", component: PaymentComponent},
      {path: "privilage", component: PrivilageComponent},
      {path: "purorder", component: PurorderComponent},
      {path: "matissue", component: MatissueComponent},
      {path: "production", component: ProductionComponent},
      {path: "proorder", component: ProorderComponent},
      {path: "grn", component: GrnComponent},
      {path: "invoice", component: InvoiceComponent},
    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

