import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  public userName:string;
  public selectedCompany:string;
  constructor(private router:Router) { }

  ngOnInit() {
    this.selectedCompany = sessionStorage.getItem('selectedComp');
    this.userName = sessionStorage.getItem('loggedInUser');
  }

  signOut(){
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

}
