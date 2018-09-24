import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { BaseClass } from "src/app/classes/BaseClass";
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  //styles:['']
})
export class LoginComponent implements OnInit {
  public loginId: string;//= 'shashank';
  public password: string;//= 'sha@123';

  public modelSource: any;
  public disableLoginBtn: boolean = true;
  public psURL: string = '';

  private baseClassObj = new BaseClass();
  public arrConfigData: any[];
  public defaultCompnyComboValue:any=[{OPTM_COMPID: "Select Company"}];
  public listItems: Array<string> = this.defaultCompnyComboValue;

  public defaultWhseComboValue:any=[{OPTM_WHSE: "Select Warehouse"}];
  public whseListItems: Array<string> = this.defaultWhseComboValue;

  public selectedValue: any;
  public selectedWhseValue: any;
  
  public hasCompaneyData: any = false;
  public hasWhseData: any = false;
  

  public userName: string = "";
  public companyName: string = "";
  public warehouseName: string = "";
  public invalidCredentials: boolean = false;
  public InvalidActiveUser: boolean = false;
  public passwordBlank: boolean = false;
  public showLoader:boolean = false;

  public GUID:any;

  public loginBackground = this.baseClassObj.get_current_url()+ "/assets/images/signup/nouse/shutter/body-bg-new-1.jpg";
  

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private httpClientSer: HttpClient,
    private toastr: ToastrService) { }

  ngOnInit() {

   if(window.localStorage.getItem('loggedInUser') != null || window.localStorage.getItem('loggedInUser') != undefined){
    this.router.navigateByUrl('/moveorder');
   }
    this.listItems = this.defaultCompnyComboValue;
    this.selectedValue = this.listItems[0];

    this.whseListItems = this.defaultWhseComboValue;
    this.selectedWhseValue = this.whseListItems[0];

    
    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-login");
    element.classList.add("opti_account-module");

    //This will get all config
    this.httpClientSer.get(this.baseClassObj.get_current_url() +'/assets/configuration.json').subscribe(
      data => {
        this.arrConfigData = data as string[];
        window.localStorage.setItem('arrConfigData', JSON.stringify(this.arrConfigData[0]));

        //This will get the psURL
        this.auth.getPSURL(this.baseClassObj.adminDBName, this.arrConfigData[0].optiProMoveOrderAPIURL).subscribe(
          data => {
            if (data != null) {
              this.psURL = data;

                //For code analysis remove in live enviorments.
               //this.psURL = "http://localhost:9500/";
              //this.psURL = "http://172.16.6.140/OptiAdmin";
            }
          },
          error => {
            this.toastr.error('','There was some error',this.baseClassObj.messageConfig);
            console.log("getpsURL -->"+error);
            this.showLoader = false;
          }
        )
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }
  onKeyUp(){
    if (this.loginId == "" || this.password == "") {
      this.invalidCredentials=false;
      this.listItems = this.defaultCompnyComboValue;
      this.selectedValue = this.listItems[0];
      return;
    }
  }
  //On Password blur the authentication will be checked
  onPasswordBlur() {
    this.showLoader = true;
    if (this.loginId == "" || this.password == "") {
      this.invalidCredentials=false;
      this.passwordBlank = true;
      this.hasCompaneyData = false;
      this.hasWhseData = false;
      this.listItems = this.defaultCompnyComboValue;
      this.selectedValue = this.listItems[0]; 
      //this.companyName = this.listItems[0];
      this.selectedWhseValue = this.whseListItems[0];
      this.showLoader = false;
      return;
    }
    else{
    if(this.password != undefined || this.password != null){
    // Check users authontication 
    this.auth.login(this.loginId, this.password, this.psURL).subscribe(
      data => {
        this.modelSource = data;

        if (this.modelSource != null && this.modelSource.Table.length > 0 && this.modelSource.Table[0].OPTM_ACTIVE == 1) {
          this.showLoader = false;
          //If everything is ok then we will navigate the user to main home page
            //this.router.navigateByUrl('/moveorder');
            this.getCompanies();
        }
        else {
          if(this.password !=null || this.password != undefined){
            this.hasCompaneyData = false;
            this.hasWhseData = false;
            this.disableLoginBtn = true;
            this.invalidCredentials = true;
            this.passwordBlank = false;
            this.InvalidActiveUser=false;
            this.listItems = this.defaultCompnyComboValue;
            this.selectedValue = this.listItems[0];  
            //this.companyName = this.listItems[0];
            this.whseListItems = this.defaultWhseComboValue;
            this.selectedWhseValue = this.whseListItems[0];
          }
        }
        this.showLoader = false;
      },
      error =>
      {
        this.toastr.error('','There was some error',this.baseClassObj.messageConfig);
        console.log("getpsURL -->"+error);
        this.showLoader = false;
      }
    )
    }
    else{
      this.showLoader = false;
    }
   
  }
  }

  // On Login button clicked
  onLoginClick() {
    this.showLoader = true;
    if (this.disableLoginBtn == false) {
      //For License Checking
     //Commented by ashish temperary
      // this.GetLicenseData();
     window.localStorage.setItem('selectedComp', this.selectedValue.OPTM_COMPID);
     window.localStorage.setItem('loggedInUser', this.loginId);
     window.localStorage.setItem('selectedWhse',this.warehouseName);
     window.localStorage.setItem('GUID',this.GUID);
     this.router.navigateByUrl('/moveorder');
     
    }
    else {
      alert("Select company first");
    }
    this.showLoader = false;
  }

  //On Comapany selection the selected comp will be set into session
  onCompanyChange(event: any) {
    this.userName = this.loginId;
    this.companyName = event.OPTM_COMPID;

    if(this.companyName !=null || this.companyName !=undefined){
        this.getWarehouse(this.companyName);
    }

  }

  onWarehouseChange(event: any){
    this.warehouseName = event.OPTM_WHSE;
  }

  //Core Functions
  getCompanies(){
    this.showLoader = true;
    this.auth.getCompany(this.loginId, this.psURL).subscribe(
      data => {

        this.modelSource = data

        if (this.modelSource != undefined
          && this.modelSource != null
          && this.modelSource.Table.length > 0) {
          //Show the Company Combo box
          this.listItems = data.Table;
          console.log("data", this.listItems);
          this.selectedValue = this.listItems[0];
          //this.companyName = this.listItems[0];
          this.disableLoginBtn = false;
          this.hasCompaneyData = true;
          this.invalidCredentials = false;
          this.InvalidActiveUser = false;
          
          //When the first item sets in the drop down then will get its warehouse
          this.getWarehouse(this.selectedValue.OPTM_COMPID);
          this.showLoader = false;
        }
        else {
          this.disableLoginBtn = true;
          this.hasCompaneyData = false;
          this.listItems = this.defaultCompnyComboValue;
          this.selectedValue = this.listItems[0];
          this.InvalidActiveUser = true;
          this.showLoader = false;
        }
      }
    )
  }

  //This Funciton will get all the whse of this company
  getWarehouse(companyName:string){
    this.showLoader = true;
    this.auth.getWarehouse(this.loginId,companyName,this.psURL).subscribe(
      data => {
        if(data !=null || data != undefined){
          this.whseListItems = data.Table
          this.hasWhseData = true;
          this.selectedWhseValue = this.whseListItems[0];
          this.warehouseName = this.selectedWhseValue.OPTM_WHSE
          this.showLoader = false;
        }
        else{
          this.showLoader = false;
        }
      }
    )

  }
  
  GetLicenseData(){
    this.auth.getLicenseData(this.loginId,this.arrConfigData[0].optiProMoveOrderAPIURL,this.companyName).subscribe(
      data => {
        if(data !=null || data != undefined){
          if(data.LICData.length > 0){
            if(data.LICData[0].ErrMessage == "" || data.LICData[0].ErrMessage == null){
              window.localStorage.removeItem("GUID");
              window.localStorage.removeItem("loggedInUser");
              //if all set to go then we will set credentials in session
              this.GUID = data.LICData[0].GUID ;
              window.localStorage.setItem('selectedComp', this.selectedValue.OPTM_COMPID);
              window.localStorage.setItem('loggedInUser', this.loginId);
              window.localStorage.setItem('selectedWhse',this.warehouseName);
              window.localStorage.setItem('GUID',this.GUID);
              this.router.navigateByUrl('/moveorder');
              this.showLoader = false;
            }else{
                //If error in login then show to user the message
                alert(data.LICData[0].ErrMessage);
                this.showLoader = false;
            }
            
          }
          else{
            this.showLoader = false;
          }
          
        }
        else{
          this.showLoader = false;
        }
      }
    )

  }

}
