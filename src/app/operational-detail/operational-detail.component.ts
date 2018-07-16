import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-operational-detail',
  templateUrl: './operational-detail.component.html',
  styleUrls: ['./operational-detail.component.css']
})
export class OperationalDetailComponent implements OnInit {
  @Input() woOperDetail: any;
  oOperDetails:any;
  constructor() { }

  ngOnInit() {
    
    console.log(this.woOperDetail);
    this.oOperDetails = this.woOperDetail[0];
  }

}
