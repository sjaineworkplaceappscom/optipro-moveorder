import { Component, OnInit, ViewChild } from '@angular/core';
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
  loginId: string = 'shashank';
  password: string = 'sha@123';
  selectedComp: string;
  modelSource: any;
  data: any;
  companies: any[];
  disableLoginBtn: boolean = true;
  psURL: string = '';
  loginLbl: string = "Login";
  constructor(private auth: AuthenticationService, private router: Router, private httpClientSer: HttpClient) { }
  private baseClassObj = new BaseClass();
  public arrConfigData: any[];

  randomstring = '';
  capchaText: string;
  invalidCapcha: boolean = false;
  hasCompaneyData: any = false;

  listItems: Array<string> = ["Select Company"];
  selectedValue: string;
  
  @ViewChild('myCanvas') myCanvas;

  ngOnInit() {

    this.getRandomStringForCaptcha();
    this.customCaptcha(this.randomstring);

    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-login");
    element.classList.add("opti_account-module");

    //This will get all config 
    this.httpClientSer.get('./assets/configuration.json').subscribe(
      data => {
        this.arrConfigData = data as string[];
        localStorage.setItem('arrConfigData', JSON.stringify(this.arrConfigData[0]));
        //This will get the psURL
        this.auth.getPSURL(this.baseClassObj.adminDBName, this.arrConfigData[0].optiProMoveOrderAPIURL).subscribe(
          data => {
            if (data != null) {
              this.psURL = data;
              //For code analysis
              this.psURL = "http://localhost:57966/api";
            }
          }
        )
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );


  }

  //On Password blur the authentication will be checked
  onPasswordBlur() {
    this.auth.login(this.loginId, this.password, this.psURL).subscribe(
      data => {
        this.modelSource = data;
        if (this.modelSource.Table.length > 0) {
          if (this.modelSource.Table[0].OPTM_ACTIVE == 1) {
            //If everything is ok then we will navigate the user to main home page
            //this.router.navigateByUrl('/moveorder');

            this.auth.getCompany(this.loginId, this.psURL).subscribe(
              data => {

                this.modelSource = data

                if (this.modelSource!=undefined && this.modelSource!=null &&this.modelSource.Table.length > 0) {
                  //Show the Company Combo box
                  this.listItems = data.Table;
                  this.selectedValue = this.listItems[0]; 
                  this.disableLoginBtn=false;                 
                  this.hasCompaneyData = true;
                  console.log(this.selectedValue);
                }
                else {
                  this.disableLoginBtn=true;
                  this.hasCompaneyData = false;
                  alert("You are Not an Active User");
                }
              }
            )
          }
          else {
            this.hasCompaneyData = false;
            this.disableLoginBtn=true;
            alert("Invalid User Name or Password");
          }
        }
        else {
          this.hasCompaneyData = false;
          this.disableLoginBtn=true;
          alert("Invalid User Name or Password");
        }
      }
    )
  }

  onLoginClick() {
    if(this.disableLoginBtn == false){
      this.router.navigateByUrl('/moveorder');
    }
    else{
      alert("Select company first");
    }
  }

  //On Comapany selection the selected comp will be set into session
  onCompanyChange(event: any) {
    sessionStorage.setItem('selectedComp', event.OPTM_COMPID)
    sessionStorage.setItem('loggedInUser', this.loginId)
  }


  customCaptcha(string) {
    let c = this.myCanvas.nativeElement;
    let ctx = c.getContext("2d");
    ctx.font = "15px Arial";
    ctx.clearRect(0, 0, 252, 144);
    ctx.fillStyle = "black";
    ctx.fillText(string, 15, 21);
  }

  getRandomStringForCaptcha() {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let string_length = 4;
    for (var i = 0; i < string_length; i++) {
      let rnum = Math.floor(Math.random() * chars.length);
      this.randomstring += chars.substring(rnum, rnum + 1);
    }
  }

  changeCaptcha() {
    this.randomstring = '';
    this.getRandomStringForCaptcha();
    this.customCaptcha(this.randomstring);
  }
}
