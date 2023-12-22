import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {DarkModeService} from "../../service/DarkModeService";
import {Employee} from "../../entity/employee";


@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent {

  opened: boolean = true;
  loggedemployee!: Employee;

  username!: string
  image!: string

  constructor(private router: Router,public authService: AuthorizationManager,public darkModeSevice:DarkModeService) {

  }

  ngAfterInit(){
    // @ts-ignore
    this.loggedemployee = JSON.parse(sessionStorage.getItem('employee'));
    // @ts-ignore
    this.username = this.loggedemployee.callingname;

    // @ts-ignore
    if (this.loggedemployee != null){
      // @ts-ignore
      this.image = atob(this.loggedemployee.photo);
    }
  }

  logout(): void {
    this.router.navigateByUrl("login");
    this.authService.clearUsername();
    this.authService.clearButtonState();
    this.authService.clearMenuState();
    localStorage.removeItem("Authorization");
    localStorage.removeItem("employee");
  }

  AdminmenuItems = this.authService.AdminmenuItems;
  PurchasemenuItems = this.authService.PurchasemenuItems;
  ProductmenuItems = this.authService.ProductmenuItems;
  SalesmenuItems = this.authService.SalesmenuItems;
  ReportsmenuItems = this.authService.ReportsmenuItems;

  isMenuVisible(category: string): boolean {
    switch (category) {
      case 'Admin':
        return this.AdminmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Purchase':
        return this.PurchasemenuItems.some(menuItem => menuItem.accessFlag);
      case 'Product':
        return this.ProductmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Sales':
        return this.SalesmenuItems.some(menuItem => menuItem.accessFlag);
      case 'Reports':
        return this.ReportsmenuItems.some(menuItem => menuItem.accessFlag);
      default:
        return false;
    }
  }
}
