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
  getAllWorkOrders(CompanyDBID:string,Warehouse:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID, Warehouse: Warehouse }]) };
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
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetOperDetailByDocEntry",jObject,this.httpOptions);
  }

  
  //Get Server Date
  getServerDate(CompanyDBID:string):Observable<any>{
     //JSON Obeject Prepared to be send as a param to API
     let jObject:any={ MoveOrder: JSON.stringify([{ 
      CompanyDBID: CompanyDBID
    }])};
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetServerDate",jObject,this.httpOptions);
  }

  //Submit Move Order
  submitMoveOrder(CompanyDBID:string,FromOperationNo,ToOperationNo:number,WorkOrderNo:string,ItemCode:string,loggedInUser:string,AcceptedQty,RejectedQty,NCQty,OrderedQty,ProducedQty,FrmToDateTime:any):Observable<any>{
  //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ 
      CompanyDBID: CompanyDBID, 
      FromOperation: FromOperationNo, 
      ToOperation:ToOperationNo,
      WorkOrder:WorkOrderNo,
      ItemCode:ItemCode,
      UserID:loggedInUser,
      QtyAccepted:AcceptedQty,
      QtyRejected:RejectedQty,
      QtyProduced:ProducedQty,
      QtyNC:NCQty,
      QtyOrder:OrderedQty,
      StartDateTime:FrmToDateTime[0],
      EndDateTime:FrmToDateTime[1]
    }]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/SubmitMoveOrder",jObject,this.httpOptions);
  }

  //Get Setting from DB
  getSettingOnSAP(CompanyDBID:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ 
     CompanyDBID: CompanyDBID
   }])};
 //Return the response form the API  
 return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetSettingOnSAP",jObject,this.httpOptions);
 }

 
 //Get count of FG linked in db by its whse and wono
 GetBatchSerialLinking(CompanyDBID:string,woNo:string,warehouseName:string,operNo:Number):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ 
     CompanyDBID: CompanyDBID,
     warehouseName:warehouseName,
     workOrderNo:woNo,
     operNo:operNo
   }])};
 //Return the response form the API  
 return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetBatchSerialLinking",jObject,this.httpOptions);
 }

 
}
