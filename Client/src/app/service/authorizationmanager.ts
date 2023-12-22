import { Injectable } from '@angular/core';
import {AuthoritySevice} from "./authorityservice";

@Injectable()
export class AuthorizationManager {
  private readonly localStorageUsreName = 'username';
  private readonly localStorageButtonKey = 'buttonState';

  private readonly localStorageAdminMenu = 'AdminmenuState';
  private readonly localStoragePurchaseMenu = 'PurchasemenuState';
  private readonly localStorageProductMenu = 'ProductmenuState';
  private readonly localStorageSalesMenu = 'SalesmenuState';
  private readonly localStorageReportsMenu = 'ReportsmenuState';

  public enaadd = false;
  public enaupd = false;
  public enadel = false;

  AdminmenuItems = [
    { name: 'Employee', accessFlag: true, routerLink: 'employee' },
    { name: 'User', accessFlag: true, routerLink: 'user' },
    { name: 'Privilege', accessFlag: true, routerLink: 'privilage' },
  ];

  PurchasemenuItems = [
    { name: 'Material', accessFlag: true, routerLink: 'material' },
    { name: 'Supplier', accessFlag: true, routerLink: 'supplier' },
    { name: 'Purchase Order', accessFlag: true, routerLink: 'purorder' },
    { name: 'GRN', accessFlag: true, routerLink: 'grn' },
    { name: 'Supplier Payment', accessFlag: true, routerLink: 'payment' },
  ];

  ProductmenuItems = [
    { name: 'Product', accessFlag: true, routerLink: 'product' },
    { name: 'Production Order', accessFlag: true, routerLink: 'proorder' },
    { name: 'Material Issue', accessFlag: true, routerLink: 'matissue' },
    { name: 'Production', accessFlag: true, routerLink: 'production' },
  ];

  SalesmenuItems = [
    { name: 'Shop', accessFlag: true, routerLink: 'shop' },
    { name: 'Invoice', accessFlag: true, routerLink: 'invoice' },
  ];

  ReportsmenuItems = [
    { name: 'Production Progress', accessFlag: true, routerLink: 'report-productionprogress' },
    { name: 'Invoice By Shops', accessFlag: true, routerLink: 'report-invoicebyshops' },
    { name: 'Production By Product', accessFlag: true, routerLink: 'report-productionbyproduct' },
    { name: 'Material Stock', accessFlag: true, routerLink: 'report-materialstock' },
    { name: 'Count By Designation', accessFlag: true, routerLink: 'report-countbydesignation' },
  ];


  constructor(private am: AuthoritySevice) {}

  enableButtons(authorities: { module: string; operation: string }[]): void {
    this.enaadd = authorities.some(authority => authority.operation === 'insert');
    this.enaupd = authorities.some(authority => authority.operation === 'update');
    this.enadel = authorities.some(authority => authority.operation === 'delete');

    // Save button state in localStorage
    localStorage.setItem(this.localStorageButtonKey, JSON.stringify({ enaadd: this.enaadd, enaupd: this.enaupd, enadel: this.enadel }));
  }

  enableMenues(modules: { module: string; operation: string }[]): void {
    // Enable Admin menu items
    this.AdminmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Academic menu items
    this.PurchasemenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Students menu items
    this.ProductmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.SalesmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    this.ReportsmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Save each menu state in localStorage
    localStorage.setItem(this.localStorageAdminMenu, JSON.stringify(this.AdminmenuItems));
    localStorage.setItem(this.localStoragePurchaseMenu, JSON.stringify(this.PurchasemenuItems));
    localStorage.setItem(this.localStorageProductMenu, JSON.stringify(this.ProductmenuItems));
    localStorage.setItem(this.localStorageSalesMenu, JSON.stringify(this.SalesmenuItems));
    localStorage.setItem(this.localStorageReportsMenu, JSON.stringify(this.ReportsmenuItems));
  }


  async getAuth(username: string): Promise<void> {

    this.setUsername(username);

    try {
      const result = await this.am.getAutorities(username);
      if (result !== undefined) {
        const authorities = result.map(authority => {
          const [module, operation] = authority.split('-');
          return { module, operation };
        });
        console.log(authorities);

        this.enableButtons(authorities);
        this.enableMenues(authorities);

      } else {
        console.log('Authorities are undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }

  getUsername(): string {
    return localStorage.getItem(this.localStorageUsreName) || '';
  }

  setUsername(value: string): void {
    localStorage.setItem(this.localStorageUsreName, value);
  }

  getEnaAdd(): boolean {
    return this.enaadd;
  }

  getEnaUpd(): boolean {
    return this.enaupd;
  }

  getEnaDel(): boolean {
    return this.enadel;
  }

  initializeButtonState(): void {
    const buttonState = localStorage.getItem(this.localStorageButtonKey);
    if (buttonState) {
      const { enaadd, enaupd, enadel } = JSON.parse(buttonState);
      this.enaadd = enaadd;
      this.enaupd = enaupd;
      this.enadel = enadel;
    }
  }

  initializeMenuState(): void {
    const adminMenuState = localStorage.getItem(this.localStorageAdminMenu);
    const purchaseMenuState = localStorage.getItem(this.localStoragePurchaseMenu);
    const productMenuState = localStorage.getItem(this.localStorageProductMenu);
    const salesMenuState = localStorage.getItem(this.localStorageSalesMenu);
    const reportsMenuState = localStorage.getItem(this.localStorageReportsMenu);

    if (adminMenuState) {
      this.AdminmenuItems = JSON.parse(adminMenuState);
    }

    if (purchaseMenuState) {
      this.PurchasemenuItems = JSON.parse(purchaseMenuState);
    }

    if (productMenuState) {
      this.ProductmenuItems = JSON.parse(productMenuState);
    }

    if (salesMenuState) {
      this.SalesmenuItems = JSON.parse(salesMenuState);
    }

    if (reportsMenuState) {
      this.ReportsmenuItems = JSON.parse(reportsMenuState);
    }
  }

  clearUsername(): void {
    localStorage.removeItem(this.localStorageUsreName);
  }

  clearButtonState(): void {
    localStorage.removeItem(this.localStorageButtonKey);
  }

  clearMenuState(): void {
    localStorage.removeItem(this.localStorageAdminMenu);
    localStorage.removeItem(this.localStoragePurchaseMenu);
    localStorage.removeItem(this.localStorageProductMenu);
    localStorage.removeItem(this.localStorageSalesMenu);
    localStorage.removeItem(this.localStorageReportsMenu);
  }

  isMenuItemDisabled(menuItem: { accessFlag: boolean }): boolean {
    return !menuItem.accessFlag;
  }

}
