import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoveorderService {
  arrConfigData:any;
  username:any;
  GUID:any;
  constructor(private httpclient:HttpClient) { 
    this.arrConfigData=JSON.parse(window.localStorage.getItem('arrConfigData'));
    this.username = window.localStorage.getItem('loggedInUser');
    this.GUID = window.localStorage.getItem("GUID");
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
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID, Warehouse: Warehouse, Username:window.localStorage.getItem('loggedInUser'),GUID:window.localStorage.getItem("GUID"),isUserIsSubcontracter: window.localStorage.getItem("isUserIsSubcontracter"),
    isCustEnabled:window.localStorage.getItem("isCustEnabled"),
  }]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetAllWorkOrders",jObject,this.httpOptions);
  }

  //GetAll Oper function to hit login API
  getOperationByWorkOrder(CompanyDBID:string,docenrty:number,workOrderNo:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID , DocEnrty :docenrty, WorkOrderNo: workOrderNo,Username:window.localStorage.getItem('loggedInUser'),isUserIsSubcontracter: window.localStorage.getItem("isUserIsSubcontracter"),
    isCustEnabled:window.localStorage.getItem("isCustEnabled")}]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/GetOperationByWorkOrder",jObject,this.httpOptions);
  }

  //Get Operation Detail By DocEnty
  getOperDetailByDocEntry(CompanyDBID:string,docenrty:number,operNo):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ CompanyDBID: CompanyDBID , DocEnrty :docenrty, OperNo :operNo,isUserIsSubcontracter: window.localStorage.getItem("isUserIsSubcontracter"),
    isCustEnabled:window.localStorage.getItem("isCustEnabled")}]) };
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
  submitMoveOrder(CompanyDBID:string,DocEntry:any,FromOperationNo,ToOperationNo:number,WorkOrderNo:string,ItemCode:string,loggedInUser:string,AcceptedQty,RejectedQty,NCQty,OrderedQty,ProducedQty,FrmToDateTime:any,preOperNo:any,getSettingOnSAP:any,IsMoveOrderTimeMandatory:any,iBalQty:number,isForcefullSubmission):Observable<any>{
    
   let sFromDateTime = new Date(FrmToDateTime[0]).toLocaleString("en-US");
   let sEndDateTime = new Date(FrmToDateTime[1]).toLocaleString("en-US");

    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ 
      CompanyDBID: CompanyDBID, 
      FromOperation: FromOperationNo, 
      ToOperation:ToOperationNo,
      WorkOrderNo:WorkOrderNo,
      ItemCode:ItemCode,
      UserID:loggedInUser,
      QtyAccepted:AcceptedQty,
      QtyRejected:RejectedQty,
      QtyProduced:ProducedQty,
      QtyNC:NCQty,
      QtyOrder:OrderedQty,
      StartDateTime:sFromDateTime,
      EndDateTime:sEndDateTime,
      genealogySetting:getSettingOnSAP,
      PreOperNo:preOperNo,
      IsMoveOrderTimeMandatory:IsMoveOrderTimeMandatory,
      isForcefullSubmission: isForcefullSubmission,
      isUserIsSubcontracter: window.localStorage.getItem("isUserIsSubcontracter"),
      DocEntry: DocEntry,
      iBalQty:iBalQty,
      isCustEnabled:window.localStorage.getItem("isCustEnabled"),
    }]) };
  //Return the response form the API  
  return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/SubmitMoveOrder",jObject,this.httpOptions);
  }

  //Get Setting from DB
  getSettingOnSAP(CompanyDBID:string,loggedInUser:string):Observable<any>{
    //JSON Obeject Prepared to be send as a param to API
    let jObject:any={ MoveOrder: JSON.stringify([{ 
     CompanyDBID: CompanyDBID,
     UserID:loggedInUser
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

 
 //Get count of FG linked in db by its whse and wono
 checkIfOperRequiresMaterial(CompanyDBID:string,woNo:string,operNo:Number):Observable<any>{
  //JSON Obeject Prepared to be send as a param to API
  let jObject:any={ MoveOrder: JSON.stringify([{ 
   CompanyDBID: CompanyDBID,
   workOrderNo:woNo,
   operNo:operNo
 }])};
//Return the response form the API  
return this.httpclient.post(this.arrConfigData.optiProMoveOrderAPIURL+"/MoveOrder/checkIfOperRequiresMaterial",jObject,this.httpOptions);
}

 
}
