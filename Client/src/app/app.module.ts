import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './view/home/home.component';
import {LoginComponent} from './view/login/login.component';
import {MainwindowComponent} from './view/mainwindow/mainwindow.component';
import {EmployeeComponent} from './view/modules/employee/employee.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmComponent } from './util/dialog/confirm/confirm.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {DatePipe} from "@angular/common";
import { EmployeeService } from './service/employeeservice';
import { ProductComponent } from './view/modules/product/product.component';
import { CountByDesignationComponent } from './report/view/countbydesignation/countbydesignation.component';
import { ProductService } from './service/productservice';
import { ArrearsByProgramComponent } from './report/view/arrearsbyprogram/arrearsbyprogram.component';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import {MatChipsModule} from '@angular/material/chips';
import {ProductionByProductComponent } from './report/view/productionbyproduct/productionbyproduct.component';
import { ProductionprogressComponent } from './report/view/productionprogress/productionprogress.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MaterialComponent } from './view/modules/material/material.component';
import { MaterialService } from './service/materialservice';
import { SupplierService } from './service/supplierservice';
import { ShopComponent } from './view/modules/shop/shop.component';
import { ShopService } from './service/shopservice';
import { SupplierComponent } from './view/modules/supplier/supplier.component';
import { PaymentComponent } from './view/modules/payment/payment.component';
import { PaymentService } from './service/paymentservice';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {UserComponent} from "./view/modules/user/user.component";
import {AuthorizationManager} from "./service/authorizationmanager";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {PurorderComponent} from "./view/modules/purorder/purorder.component";
import {MatissueComponent} from "./view/modules/matissue/matissue.component";
import {ProductionComponent} from "./view/modules/production/production.component";
import {ProorderComponent} from "./view/modules/proorder/proorder.component";
import {Proorderstatusservice} from "./service/proorderstatusservice";
import {ProorderService} from "./service/proorderservice";
import {SupplierstatusService} from "./service/supplierstatusservice";
import {MatissueService} from "./service/matissueservice";
import {GrnComponent} from "./view/modules/grn/grn.component";
import {JwtInterceptor} from "./service/JwtInterceptor";
import {InvoiceComponent} from "./view/modules/invoice/invoice.component";
import {ProductdemanComponent} from "./report/view/productdeman/productdeman.component";
import {InvoicebyshopsComponent} from "./report/view/invoicebyshops/invoicebyshops.component";
import {MaterialStockCountComponent} from "./report/view/materialstockcount/materialstockcount.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainwindowComponent,
    EmployeeComponent,
    MessageComponent,
    ConfirmComponent,
    ProductComponent,
    CountByDesignationComponent,
    ArrearsByProgramComponent,
    DashboardComponent,
    ProductionByProductComponent,
    ProductionprogressComponent,
    MaterialComponent,
    SupplierComponent,
    ShopComponent,
    PaymentComponent,
    UserComponent,
    PrivilageComponent,
    PurorderComponent,
    MatissueComponent,
    ProductionComponent,
    ProorderComponent,
    GrnComponent,
    InvoiceComponent,
    ProductdemanComponent,
    InvoicebyshopsComponent,
    MaterialStockCountComponent

  ],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    HttpClientModule,
    MatPaginatorModule,
    MatChipsModule,
    NgbModule,
    CarouselModule.forRoot(),
    MatSlideToggleModule,
  ],
  providers: [EmployeeService,
    AuthorizationManager,
    ProductService,
    MaterialService,
    SupplierService,
    SupplierstatusService,
    MatissueService,
    Proorderstatusservice,
    ProorderService,
    DashboardComponent,
    InvoiceComponent,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    ShopService,PaymentService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
