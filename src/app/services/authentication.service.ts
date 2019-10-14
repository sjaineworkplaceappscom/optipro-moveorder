import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseClass } from "src/app/classes/BaseClass";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseClassObj = new BaseClass();
  constructor(private httpclient:HttpClient) { }
  
  //defining properties for the call 
  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':'application/json'
      })
    };

    updateHeader(){
      this.httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept':'application/json',
        'Authorization': localStorage.getItem('accessToken')
        })
      };
    }


  //Login function to hit login API
  login(loginId:string,loginPassword:string,optiProMoveOrderAPIURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ Login: JSON.stringify([{ User: loginId, Password: loginPassword, IsAdmin: false }]) };
  //Return the response form the API  
  return this.httpclient.post(optiProMoveOrderAPIURL+"/MoveOrder/ValidateUserLogin",jObject,this.httpOptions);
  }

  //This function will get Company acc. to User
  getCompany(loginId:string,optiProMoveOrderAPIURL:string):Observable<any>{

    // let httpOptions = {
    //   headers: new HttpHeaders({
    //   'Content-Type':  'application/json',
    //   'Accept':'application/json',
    //   'Authorization': localStorage.getItem('accessToken')
    //   })
   // };
    let jObject:any={ Username: JSON.stringify([{ Username: loginId ,Product: this.baseClassObj.productCode}]) };
    //return this.httpclient.post(psURL+"/api/login/GetCompaniesAndLanguages",jObject,httpOptions)
    return this.httpclient.post(optiProMoveOrderAPIURL + "/MoveOrder/GetCompaniesAndLanguages", jObject, this.httpOptions);
  }

  //Get psURL
  getPSURL(CompanyDBID:string,optiProMoveOrderAPIURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
    //Return the response form the API  
    return this.httpclient.post(optiProMoveOrderAPIURL + "/MoveOrder/GetPSURL", jObject, this.httpOptions);
  }

  //Get Warehouses
  getWarehouse(loginId:string,CompanyDBID:string,optiProMoveOrderAPIURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    // let httpOptions = {
    //   headers: new HttpHeaders({
    //   'Content-Type':  'application/json',
    //   'Accept':'application/json',
    //   'Authorization': localStorage.getItem('accessToken')
    //   })
   // };
    let jObject: any = { CompanyName: JSON.stringify([{ Username: loginId, CompanyDBId: CompanyDBID }]) };    
    //return this.httpclient.post(psURL + "/api/login/GetWHS", jObject, httpOptions)
    return this.httpclient.post(optiProMoveOrderAPIURL + "/MoveOrder/GetWHS", jObject, this.httpOptions);
  }

  //Get License Data
  // getLicenseData(loginId:string,optiProMoveOrderAPIURL:string,CompanyDBID:any):Observable<any>{
  //   //JSON Obeject Prepared to be send as a param to API
  //   let jObject: any = { MoveOrder: JSON.stringify([{ Username: loginId , DataBase: CompanyDBID}]) };
  //   //Return the response form the API  
  //   return this.httpclient.post(optiProMoveOrderAPIURL + "/MoveOrder/getLicenseData", jObject, this.httpOptions)
  // }

   //Get License Data
   removeCurrentUser(loginId:string,CompanyDBID:any,currentGUID:any,optiProMoveOrderAPIURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { MoveOrder: JSON.stringify([{ CompanyId: CompanyDBID, GUID: currentGUID, Login: loginId }]) };
    //Return the response form the API  
    return this.httpclient.post(optiProMoveOrderAPIURL + "/MoveOrder/RemoveLoggedInUser", jObject, this.httpOptions)
  }
};




