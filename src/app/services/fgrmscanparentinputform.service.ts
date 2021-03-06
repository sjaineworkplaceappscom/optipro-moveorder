import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import ParentScrollPosition from '@progress/kendo-popup-common/dist/npm/parent-scroll-position';

@Injectable({
  providedIn: 'root'
})
export class FgrmscanparentinputformService {
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

  //save the data for both the grids
  SubmitDataforFGandRM(oModal:any,taskHDId:number):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    
    let jObject:any={ MoveOrder: JSON.stringify(oModal),
      GetData: JSON.stringify([{ taskHDId: taskHDId, Username:window.localStorage.getItem('loggedInUser'),GUID:window.localStorage.getItem("GUID") }]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/SubmitDataforFGandRM",jObject,this.httpOptions);
  }

  //This will get the child data if exists
  GetAllChildByParentId(CompanyDBID:string,ParentBatchSerialNo:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID ,ParentBatchSerialNo: ParentBatchSerialNo}]) };
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/GetAllChildByParentId",jObject,this.httpOptions);
  }  

  //This method will delete the data from child RM
  deleteRMDataBySeq(CompanyDBID:string,sequenceNo:number):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID ,squence: sequenceNo}]) };
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/DeleteChildComponent",jObject,this.httpOptions);
  } 

   //check the data for both the grids
   CheckDataforFGandRM(oModal:any):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify(oModal) ,
      GetData: JSON.stringify([{ Username:window.localStorage.getItem('loggedInUser'),GUID:window.localStorage.getItem("GUID")}]) };
   
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/CheckDataforFGandRM",jObject,this.httpOptions);
  }
}
