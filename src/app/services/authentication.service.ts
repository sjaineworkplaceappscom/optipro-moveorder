import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpRequest } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpclient:HttpClient) { }

  login(loginId:string,loginPassword:string):Observable<any>{
    let model:any={
      "LoginId":loginId,
      "LogreqinPassword":loginPassword
    }
debugger;
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':'application/json'
  })
};
   
    
     //let options = new RequestOptions({ headers: header });
   return this.httpclient.post("http://localhost:57962/api/login/AdminLogin",model,httpOptions);
  //  return this.httpclient.get("http://localhost:57962/api/login/AdminLogin");
  }

  GetCompany(loginId:string){
let oLogin:any ={
  "LoginId":loginId,
  "Product":"SFDC"
}
let header:HttpHeaders=new HttpHeaders();
    header.set("accept","application/json");
    header.set("content-type","application/json");

    return this.httpclient.get("http://localhost:57962/api/login/GetCompaniesAndLanguages")



}




  


};




