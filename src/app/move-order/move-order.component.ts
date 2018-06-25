import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-move-order',
  templateUrl: './move-order.component.html',
  styleUrls: ['./move-order.component.css']
})
export class MoveOrderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  onWOPress(){
    alert("heloooo");
  }


}
