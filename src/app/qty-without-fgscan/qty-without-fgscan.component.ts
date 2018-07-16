import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qty-without-fgscan',
  templateUrl: './qty-without-fgscan.component.html',
  styleUrls: ['./qty-without-fgscan.component.css']
})
export class QtyWithoutFGScanComponent implements OnInit {
iBalQty:number =0;
iAcceptedQty:number =0;
iRejectedQty:number =0;
iNCQty:number =0;
  constructor() { }
  
  ngOnInit() {
  }

}
