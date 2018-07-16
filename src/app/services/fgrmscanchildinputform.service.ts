import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FgrmscanchildinputformService {
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

  //Check the Item Code and get its details
  CheckIfChildCompExists(CompanyDBID:string,FGItemCode: string,ChildCompId:string,WONO:string,OperNo:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID ,FGItemCode: FGItemCode,ChildComponentId: ChildCompId, WorkOrderNo: WONO, OperationNo: OperNo}]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/CheckIfChildCompBatchSerExists",jObject,this.httpOptions);
  }

  
}
