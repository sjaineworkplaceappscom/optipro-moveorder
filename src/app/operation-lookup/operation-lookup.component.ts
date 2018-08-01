import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-operation-lookup',
  templateUrl: './operation-lookup.component.html',
  styleUrls: ['./operation-lookup.component.scss']
})
export class OperationLookupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  products = [
  {
    "workorder":"PO00000001" ,
    "id":"item1",
    "start" :"17/1/2018",
    "end":"20/1/2018"
  }, 
  {
    "workorder":"PO00000002" ,
    "id":"item2",
    "start" :"17/1/2018",
    "end":"20/1/2018"
  }
  ]
  public gridData: any[] = this.products;

}
