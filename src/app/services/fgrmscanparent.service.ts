import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FgrmscanparentService {
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

  //Delete Data for parent FG and child RM
  public deleteParentFGandRM(CompanyDBID:string,seqNo:number,WONo:string,ParentFGBatchSerNo:string, ItemCode:string,FGBatchSer:string ):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID,Sequence:seqNo,WorkOrderNo:WONo,ParentBatchSerial: ParentFGBatchSerNo
    , Item:ItemCode, FGBatchSerial:FGBatchSer}]) };
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/DeleteFGandRM",jObject,this.httpOptions);
    } 
}
