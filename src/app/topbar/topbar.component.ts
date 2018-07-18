import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  public userName:string;
  public selectedCompany:string;
  constructor() { }

  ngOnInit() {
    this.selectedCompany = sessionStorage.getItem('selectedComp');
    this.userName = sessionStorage.getItem('loggedInUser');
  }

}
