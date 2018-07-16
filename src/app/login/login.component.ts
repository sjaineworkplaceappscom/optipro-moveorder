import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { BaseClass } from "src/app/classes/BaseClass";
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginId:string = 'shashank';
  password:string = 'sha@123';
  selectedComp:string;
  modelSource:any;
  data:any;
  companies:any[];
  showCompCombo:boolean =false;
  connentLbl:string = "Connect";
  loginLbl:string = "Login";
  showLoginBtn:boolean = false;
  psURL:string= '';
  constructor(private auth:AuthenticationService,private router:Router,private httpClientSer: HttpClient) { }
  private baseClassObj = new BaseClass();
  public arrConfigData: any [];
  
  
  ngOnInit() {
    //This will get all config 
    this.httpClientSer.get('./assets/configuration.json').subscribe(
      data => {
        this.arrConfigData = data as string [];
        localStorage.setItem('arrConfigData',JSON.stringify(this.arrConfigData[0]));
        //This will get the psURL
        this.auth.getPSURL(this.baseClassObj.adminDBName,this.arrConfigData[0].optiProMoveOrderAPIURL).subscribe(
          data=> {
          if(data !=null )
          {
              this.psURL = data;
              //For code analysis
              this.psURL = "http://localhost:57966/api";
          }
          }
        )
      },
      (err: HttpErrorResponse) => {
        console.log (err.message);
      }
    );

   
  }

  onConnectClick(){
    this.auth.login(this.loginId,this.password,this.psURL).subscribe(
     data=> {
     this.modelSource = data;
     if(this.modelSource.Table.length > 0){
      if(this.modelSource.Table[0].OPTM_ACTIVE == 1){
       //If everything is ok then we will navigate the user to main home page
        //this.router.navigateByUrl('/moveorder');

        this.auth.getCompany(this.loginId,this.psURL).subscribe(
          data=> {
          this.modelSource = data
          if(this.modelSource.Table.length > 0){
            //Show the Company Combo box
            this.showCompCombo = true;
            this.connentLbl = "Connected"
            this.companies = data.Table;
            this.showLoginBtn = true;
           }
           else{
             alert("You are Not an Active User");
           }
           }
         )
      }
      else{
          alert("Invalid User Name or Password");
        }
      }
      else{
        alert("You are Not an Active User");
      }
      }
    )
  }

  onLoginClick(){
       this.router.navigateByUrl('/moveorder');
  }

  onCompanyChange(event: any){
        sessionStorage.setItem('selectedComp',event.target.value)
        sessionStorage.setItem('loggedInUser',this.loginId)
  }
}
