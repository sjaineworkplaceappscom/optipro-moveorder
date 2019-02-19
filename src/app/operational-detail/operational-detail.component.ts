import { Component, OnInit, Input } from '@angular/core';
import { CommanserviceService } from 'src/app/services/commanservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operational-detail',
  templateUrl: './operational-detail.component.html',
  styleUrls: ['./operational-detail.component.scss']
})
export class OperationalDetailComponent implements OnInit {
  @Input() woOperDetail: any;
  oOperDetails:any;
  constructor(private comman: CommanserviceService,private router: Router) { }

  public language: any;

  ngOnInit() {

    this.language = JSON.parse(window.localStorage.getItem('language'));
   
    if(window.localStorage.getItem('loggedInUser') == null || window.localStorage.getItem('loggedInUser') == undefined){
      this.router.navigateByUrl('/login');
    }
      this.oOperDetails = this.woOperDetail[0];
  
   
  }

  checkIfLoginIsValid(){
    if(window.localStorage.getItem('loggedInUser') == null || window.localStorage.getItem('loggedInUser') == undefined){
      this.router.navigateByUrl('/login');
    }
  }
  
}
