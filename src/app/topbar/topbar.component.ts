import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  private userName:string;
  private selectedCompany:string;
  private currentGuid:any;
  public arrConfigData: any;
  public showLoader:boolean = false;
  public language: any;
  constructor(private router:Router, private auth: AuthenticationService) { }

  ngOnInit() {
    this.language = JSON.parse(window.localStorage.getItem('language'));
    this.selectedCompany = window.localStorage.getItem('selectedComp');
    this.userName = window.localStorage.getItem('loggedInUser');
    this.currentGuid = window.localStorage.getItem("GUID");
  }

  signOut(){
    //To deallocate license
    //Commeted Temperary
    //this.removeCurrentUser();
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  removeCurrentUser(){
    //'http://localhost:57913/api'
    this.arrConfigData = JSON.parse(window.localStorage.getItem('arrConfigData'));
    this.auth.removeCurrentUser(this.userName,this.selectedCompany,window.localStorage.getItem("GUID"),this.arrConfigData.optiProMoveOrderAPIURL).subscribe(
      data => {
        if(data !=null || data != undefined){
          if(data == true){
            window.localStorage.setItem('loggedInUser','');

          }
        }
        else{
          this.showLoader = false;
        }
      }
    )
  }

}
