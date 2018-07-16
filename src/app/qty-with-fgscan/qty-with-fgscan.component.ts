import { Observable } from 'rxjs/Observable';
import {  Component, OnInit, Input, ViewChild } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import { QtyWithFGScanDetailComponent } from '../qty-with-fgscan-detail/qty-with-fgscan-detail.component';


@Component({
  selector: 'app-qty-with-fgscan',
  templateUrl: './qty-with-fgscan.component.html',
  styleUrls: ['./qty-with-fgscan.component.css']
})
export class QtyWithFGScanComponent implements OnInit {
  @Input() basicDetailsFrmMO: any;
  @ViewChild(QtyWithFGScanDetailComponent) child;

  FGScanGridData:any = [];
  CompanyDBId:string= "";
  message:string=""
  
public view: Observable<GridDataResult>;

  constructor(private qtyWithFGScan: QtyWithFGScanService) { }

  txtFGValue:string ="";
  txtFGSerBatValue:string ="";
  txtFGQty:number=0;
  isFGValid:boolean= true;
  lblBalQty:number =0.0;
  lblAcceptedQty:number =0.0;
  lblRejectedQty:number =0.0;
  lblNCQty:number =0.0;
  rowID:number = 0;
  showDataInsertPopup:boolean = false;
  rowDataForEdit: any = [];
  showEditBtn:boolean = true;

  ngOnInit() {
   //console.log(this.basicDetailsFrmMO);
   this.CompanyDBId = this.CompanyDBId = sessionStorage.getItem('selectedComp');
   console.log(this.basicDetailsFrmMO);
   //Fill all details from DB in the grid
   this.fillFGData();
   this.refreshQtys();
  }
  

  receiveMessage($event) {
    //This will again hide the popup again
    this.showDataInsertPopup = false;   
    //This will again refresh the grid again
    this.fillFGData();
    this.rowDataForEdit = [];
  }
  //Kendo inbuilt method handlers
  removeHandler({rowIndex}){
    //this.FGScanGridData.splice(rowIndex,1);
    //console.log(this.FGScanGridData[rowIndex].OPTM_BTCHSERNO);

    this.qtyWithFGScan.deleteBatchSerInfo(this.CompanyDBId,this.FGScanGridData[rowIndex].OPTM_SEQ).subscribe(
      data=> {
        if(data!=null){
          if(data == "True")  {
            alert("Data deleted");
            this.fillFGData();
          }
          else{
            alert("Failed to delete data");
          }
         }
      }
    )
  }

  editHandler({ rowIndex }) {
    //To show the popup screen which will supdateave the data
    this.showDataInsertPopup = true;
    this.rowDataForEdit.push({ FGBatchSerNo: this.FGScanGridData[rowIndex].OPTM_BTCHSERNO,Quantity: this.FGScanGridData[rowIndex].OPTM_QUANTITY,IsRejected:this.FGScanGridData[rowIndex].OPTM_REJECT,IsNC: this.FGScanGridData[rowIndex].OPTM_NC,SeqNo: this.FGScanGridData[rowIndex].OPTM_SEQ,ItemManagedBy: this.FGScanGridData[rowIndex].ManagedBy});
  }

  //This will open a form for taking the inputs
  onInsertRowPress(){
    //To show the popup screen which will save the data
    this.showDataInsertPopup = true;
  }

  //Core Functions

  //This func. will fill data into the grid
  fillFGData(){
    this.qtyWithFGScan.getBatchSerialInfo(this.CompanyDBId,this.basicDetailsFrmMO[0].WorkOrderNo,this.basicDetailsFrmMO[0].ItemCode,this.basicDetailsFrmMO[0].OperNo).subscribe(
      data=> {
        if(data != null){
          this.FGScanGridData = data;
          for(let iCount in this.FGScanGridData){
              if(this.FGScanGridData[iCount].OPTM_REJECT == 'Y'){
                this.FGScanGridData[iCount].OPTM_REJECT = true;
              }
              else{
                this.FGScanGridData[iCount].OPTM_REJECT = false;
              }
          }
            // refresh the qtys in the lower table
            this.refreshQtys();
        }
      }
    )

    if(this.basicDetailsFrmMO[0].ManagedBy == "Serial"){
      this.showEditBtn = false;
    }
    else{
      this.showEditBtn = true;
    }

  }

  //refresh Qtys in the lower table
  refreshQtys(){
    let iRejectCount:number =0;
    let iNCCount:number = 0;
    let balQty:number = 0;
    let totalBalQty:number = 0;
    for(let recCount in this.FGScanGridData){

      totalBalQty = totalBalQty+this.FGScanGridData[recCount].OPTM_QUANTITY;
      balQty = balQty+this.FGScanGridData[recCount].OPTM_QUANTITY;
        if(this.FGScanGridData[recCount].OPTM_REJECT == true)
        {
          iRejectCount = iRejectCount + this.FGScanGridData[recCount].OPTM_QUANTITY;
          balQty = balQty - this.FGScanGridData[recCount].OPTM_QUANTITY;
        }
        if(this.FGScanGridData[recCount].OPTM_NC == true)
        {
          iNCCount = iNCCount + this.FGScanGridData[recCount].OPTM_QUANTITY;

          balQty = balQty - this.FGScanGridData[recCount].OPTM_QUANTITY;

        }
        
    }
      this.lblRejectedQty = iRejectCount;
      this.lblNCQty = iNCCount;
      this.lblBalQty = totalBalQty;
      this.lblAcceptedQty = totalBalQty - iNCCount - iRejectCount;
  }
}
