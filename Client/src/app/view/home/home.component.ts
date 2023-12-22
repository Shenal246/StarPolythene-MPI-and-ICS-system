import { DatePipe } from '@angular/common';
import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  carouselInterval = 3000; // Interval in milliseconds
  carouselWrap = true; // Whether to wrap the carousel items

  userspecmessages: any[] = [
    {name: 'ashan@earth.lk', updated: new Date('5/30/23')},
    {name: 'nimal@ymail.com', updated: new Date('5/17/23')},
    {name: 'it@earth.lk', updated: new Date('5/28/23')},
    {name: 'it@earth.lk', updated: new Date('4/28/23')},
    {name: 'it@earth.lk', updated: new Date('4/28/23')},
  ];

  generalmessages: any[] = [
    {name: 'ashan@earth.lk', updated: new Date('5/30/23')},
    {name: 'nimal@ymail.com', updated: new Date('5/17/23')},
    {name: 'it@earth.lk', updated: new Date('5/28/23')},
    {name: 'it@earth.lk', updated: new Date('4/28/23')}
  ];

  // images = [
  //   { name: 'polythenefact1.png', caption: 'Polythene 1'},
  //   { name: 'polythenefact2.jpg', caption: 'Polythene 2'},
  //   { name: 'polythenefact3.png', caption: 'Polythene 3'},
  // ];
}
