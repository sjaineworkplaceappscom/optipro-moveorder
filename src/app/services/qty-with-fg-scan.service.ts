import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QtyWithFGScanService {
  arrConfigData:any;
  scanDataInputs:any= {};
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

    //Check whether the Finished Good is valid serial/bat no.
    public checkIfFGSerBatisValid(CompanyDBID:string,FGSerBatValue:string,WONo:string,FGItemCode:string,OpNo:string,ItemManagedBy:string):Observable<any>{
      //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID ,FGSerBat:FGSerBatValue,WorkOrderNo:WONo,ItemCode:FGItemCode,FromOperation:OpNo,ItemManagedBy:ItemManagedBy,Username:window.localStorage.getItem('loggedInUser'),GUID:window.localStorage.getItem("GUID")}]) };
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/checkIfFGSerBatisValid",jObject,this.httpOptions);
    }

    //Get all data
    public getBatchSerialInfo(CompanyDBID:string,WONo:string,FGItemCode:string,OpNo:number):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID,WorkOrderNo:WONo,ItemCode:FGItemCode,FromOperation:OpNo }]) };
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/GetBatchSerialInfo",jObject,this.httpOptions);
    }

    //Save Data
    public saveBatchSerInfo(CompanyDBID:string,SeqNo:number,FGBatchSer:string,QtyProd:number,IsRejected:boolean,IsNC:boolean,WorkOrderNo:string,ItemCode:string,OperationNo:string,loggedInUser:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID,WorkOrderNo: WorkOrderNo,SequenceNo: SeqNo,FGBatchSerial:FGBatchSer,Rejected: IsRejected,User: loggedInUser,NC:IsNC,Item:ItemCode,Operation:OperationNo,Quantity:QtyProd }]) };
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/SaveBatchSerialInfo",jObject,this.httpOptions);
    }

    //Delete Data
    public deleteBatchSerInfo(CompanyDBID:string,seqNo:number, WorkOrderNo:string,ItemCode:string,FGBatchSer:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    //let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID,Sequence:seqNo}]) };
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID,Sequence:seqNo,WorkOrderNo: WorkOrderNo, FGBatchSerial:FGBatchSer,Item:ItemCode }]) };
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/DeleteBatchSerialInfo",jObject,this.httpOptions);
    } 

    //Update Data
    public updateBatchSerInfoRow(CompanyDBID:string,FGBatchSer:string,QtyProd:number,IsRejected:boolean,IsNC:boolean,WorkOrderNo:string,OperationNo:string,ItemCode:string,loggedInUser:string,iSeqNo:number):Observable<any>{
      if(IsNC == undefined || IsNC == null){
          IsNC = false;
      }
      //JSON Obeject Prepared to be send as a param to API
      let jObject:any={ MoveOrder: JSON.stringify([{CompanyDBID: CompanyDBID,WorkOrderNo: WorkOrderNo,FGBatchSerial:FGBatchSer,Rejected: IsRejected,User: loggedInUser,NC:IsNC,Item:ItemCode,Operation:OperationNo,Quantity:QtyProd,SeqNo:iSeqNo}]) };
      //Return the response form the API  
      return this.httpclient.post(this.arrConfigData.service_url+"/MoveOrder/UpdateBatchSerialInfo",jObject,this.httpOptions);
    } 
  
    //Get Decoded String
    getDecodedString(CompanyDBID:string,FGScannedString:string):Observable<any>{
    let dataSCAN = [];
      this.scanDataInputs.CompanyDBID = CompanyDBID;
    this.scanDataInputs.Vsvendorid = "";
    this.scanDataInputs.FGItem="";
    this.scanDataInputs.strScan = FGScannedString;

    dataSCAN.push(this.scanDataInputs);
    

    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ Gs1Token: JSON.stringify(dataSCAN)};
    //Return the response form the API  
    return this.httpclient.post(this.arrConfigData.service_url+"/GS1/GS1Setup",jObject,this.httpOptions);
    }
}
