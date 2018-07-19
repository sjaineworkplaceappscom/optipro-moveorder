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
  public loginId: string;//= 'shashank';
  public password: string;//= 'sha@123';

  public modelSource: any;
  public disableLoginBtn: boolean = true;
  public psURL: string = '';

  private baseClassObj = new BaseClass();
  public arrConfigData: any[];

  public listItems: Array<string> = ["Select Company"];
  public selectedValue: string;

  public hasCompaneyData: any = false;

  public userName: string = "";
  public companyName: string = "";


  constructor(
    private auth: AuthenticationService, private router: Router,
    private httpClientSer: HttpClient) { }

  ngOnInit() {


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

              //For code analysis remove in live enviorments.
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

    // Check users authontication 
    this.auth.login(this.loginId, this.password, this.psURL).subscribe(
      data => {

        this.modelSource = data;

        if (this.modelSource.Table.length > 0 && this.modelSource.Table[0].OPTM_ACTIVE == 1) {          
            //If everything is ok then we will navigate the user to main home page
            //this.router.navigateByUrl('/moveorder');
            this.auth.getCompany(this.loginId, this.psURL).subscribe(
              data => {

                this.modelSource = data

                if (this.modelSource != undefined 
                    && this.modelSource != null 
                    && this.modelSource.Table.length > 0) 
                    {
                      //Show the Company Combo box
                      this.listItems = data.Table;
                      this.selectedValue = this.listItems[0];
                      this.disableLoginBtn = false;
                      this.hasCompaneyData = true;
                    }
                else {
                  this.disableLoginBtn = true;
                  this.hasCompaneyData = false;
                  alert("You are Not an Active User");
                }
              }
            )
          }
          else {
            this.hasCompaneyData = false;
            this.disableLoginBtn = true;
            alert("Invalid User Name or Password");
          }        
       
      }
    )
  }

  // On Login button clicked
  onLoginClick() {
    if (this.disableLoginBtn == false) {      
      sessionStorage.setItem('selectedComp', this.companyName);
      sessionStorage.setItem('loggedInUser', this.userName);
      this.router.navigateByUrl('/moveorder');
    }
    else {
      alert("Select company first");
    }
  }

  //On Comapany selection the selected comp will be set into session
  onCompanyChange(event: any) {
    this.userName = this.loginId;
    this.companyName = event.OPTM_COMPID;
  }

}
