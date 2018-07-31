import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  constructor(private httpclient:HttpClient) { }
  
  //defining properties for the call 
  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':'application/json'
      })
    };

  //Login function to hit login API
  login(loginId:string,loginPassword:string,psURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ Login: JSON.stringify([{ User: loginId, Password: loginPassword, IsAdmin: false }]) };
  //Return the response form the API  
  return this.httpclient.post(psURL+"/login/ValidateUserLogin",jObject,this.httpOptions);
  }

  //This function will get Company acc. to User
  getCompany(loginId:string,psURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ Username: JSON.stringify([{ Username: loginId ,Product: "SFES"}]) };
    //Return the response form the API  
    return this.httpclient.post(psURL+"/login/GetCompaniesAndLanguages",jObject,this.httpOptions)
  }

  //Get psURL
  getPSURL(CompanyDBID:string,optiProMoveOrderAPIURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
    //Return the response form the API  
    return this.httpclient.post(optiProMoveOrderAPIURL + "/MoveOrder/GetPSURL", jObject, this.httpOptions);
  }

  //Get Warehouses
  getWarehouse(loginId:string,CompanyDBID:string,psURL:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject: any = { CompanyName: JSON.stringify([{ Username: loginId, CompanyDBId: CompanyDBID }]) };
    //Return the response form the API  
    return this.httpclient.post(psURL + "/login/GetWHS", jObject, this.httpOptions)
  }

};




