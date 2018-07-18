import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoveorderService {
  arrConfigData:any;
  constructor(private httpclient:HttpClient) { 
    this.arrConfigData=JSON.parse(localStorage.getItem('arrConfigData'));
  }
  //defining properties for the call 
  httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':'application/json'
      })
    };

  //GetAllWO function to hit login API
  getAllWorkOrders(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID }]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetAllWorkOrders",jObject,this.httpOptions);
  }

  //GetAll Oper function to hit login API
  getOperationByWorkOrder(CompanyDBID:string,docenrty:number,workOrderNo:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID , DocEnrty :docenrty, WorkOrderNo: workOrderNo}]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetOperationByWorkOrder",jObject,this.httpOptions);
  }

  //Get Operation Detail By DocEnty
  getOperDetailByDocEntry(CompanyDBID:string,docenrty:number,operNo):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID , DocEnrty :docenrty, OperNo :operNo}]) };
    debugger;
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetOperDetailByDocEntry",jObject,this.httpOptions);
  }

  
}
