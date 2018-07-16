import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-work-order-detail',
  templateUrl: './work-order-detail.component.html',
  styleUrls: ['./work-order-detail.component.css']
})
export class WorkOrderDetailComponent implements OnInit {
  @Input() workOrderDetail: any;
  oWODetails:any;
  constructor() { }

  ngOnInit() {
    this.oWODetails=this.workOrderDetail[0];
    console.log(this.oWODetails);
  }
  onOKPress(){
  }
}
