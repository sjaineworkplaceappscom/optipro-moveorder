import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FgrmscanchildinputformService {
  arrConfigData:any;
  constructor(private httpclient:HttpClient) { 
    this.arrConfigData=JSON.parse(window.localStorage.getItem('arrConfigData'));
  }

  //defining properties for the call 
  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':'application/json',
    'Authorization': localStorage.getItem('accessToken')
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

  //Check the Item Code and get its details
  CheckIfChildCompExists(CompanyDBID:string,FGItemCode: string,ChildCompId:string,WONO:string,OperNo:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID ,FGItemCode: FGItemCode,ChildComponentId: ChildCompId, WorkOrderNo: WONO, OperationNo: OperNo,Username:window.localStorage.getItem('loggedInUser'),GUID:window.localStorage.getItem("GUID")}]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/CheckIfChildCompBatchSerExists",jObject,this.httpOptions);
  }

  //This will fetch sysnumber
  CheckIfValidBatchSerialComponentEntered(CompanyDBID:string,WareHouse:string,Bin:string,ChildBtchSerNo:string,ItemCode:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID ,WareHouse: WareHouse,Bin:Bin,ChildBtchSerNo:ChildBtchSerNo,ItemCode:ItemCode,Username:window.localStorage.getItem('loggedInUser'),GUID:window.localStorage.getItem("GUID")}]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/CheckIfValidBatchSerialComponentEntered",jObject,this.httpOptions);
  }
}
