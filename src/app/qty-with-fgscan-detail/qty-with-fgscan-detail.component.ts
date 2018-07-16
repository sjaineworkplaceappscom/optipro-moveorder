import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';

@Component({
  selector: 'app-qty-with-fgscan-detail',
  templateUrl: './qty-with-fgscan-detail.component.html',
  styleUrls: ['./qty-with-fgscan-detail.component.scss']
})
export class QtyWithFGScanDetailComponent implements OnInit {
  @Input() basicDetailsFrmFGWithScan: any;
  @Input() rowDataFrmFGWithScan: any;
  @Input() FGWithScanGridFrmMaster: any;
  psBatchSer:string = '';
  iQty:number = 0;
  bIsRejected:any;
  CompanyDBId:string= '';
  bIsNC:any;
  bIsEdit:boolean = false;
  loggedInUser:string='';
  iSeqNo:number;
  isQtyDisabled:boolean = false;
  bIsInEditMode = true;
  psItemManagedBy:string = '';
  bEnableSaveBtn:boolean = false;
  constructor(private qtyWithFGScanDtl: QtyWithFGScanService) { }

  message: string = ""

  @Output() messageEvent = new EventEmitter<string>();

  
  //Events
  ngOnInit() {
    this.loggedInUser = sessionStorage.getItem('loggedInUser');
    //console.log(this.basicDetailsFrmFGWithScan)
    //console.log(this.rowDataFrmFGWithScan);
    this.CompanyDBId = sessionStorage.getItem('selectedComp');

    //taking item managed by
    if(this.basicDetailsFrmFGWithScan !=null){
      if(this.basicDetailsFrmFGWithScan.length > 0){
        this.psItemManagedBy = this.basicDetailsFrmFGWithScan[0].ManagedBy;
      }
    }

    //Disable/enalbe controls
    this.disableEnableControls();

    if(this.rowDataFrmFGWithScan !=null){
      if(this.rowDataFrmFGWithScan.length > 0){
        this.bIsEdit = true;
        this.psBatchSer = this.rowDataFrmFGWithScan[0].FGBatchSerNo;
        this.iQty = this.rowDataFrmFGWithScan[0].Quantity;
        this.bIsRejected = this.rowDataFrmFGWithScan[0].IsRejected;
        this.bIsNC = this.rowDataFrmFGWithScan[0].IsNC;
        this.iSeqNo = this.rowDataFrmFGWithScan[0].SeqNo;
        this.psItemManagedBy = this.rowDataFrmFGWithScan[0].ItemManagedBy;
      }
    }
  }

  onAddPress(){
   if(this.psBatchSer !=null){
     if(this.bIsEdit==true){
      this.updateBatchSerInfoRow();
     }
     else{
      this.saveBatchSerInfoRow();
     }
     this.messageEvent.emit(this.message)
   }
  }

  onBatchSerBlur(){
    if(this.psBatchSer != null){
      if(this.psBatchSer.length > 0){
         if(this.chkIfFGBatSerAlreadyExists() == false){
          this.validateFGSerBat();
         }

        //If the value is filled then only enable add button
        this.bEnableSaveBtn = true;

      }
      else{
        alert("Enter valid batch/serial");
        //If the value is filled then only enable add button
        this.bEnableSaveBtn = true;
      }
    }
  }

  //Core Functions
  
  //this will save data 
  saveBatchSerInfoRow(){
    if(this.bIsRejected == true){
      this.bIsRejected = 'Y';
    }
    else{
      this.bIsRejected = 'N';
    }

    if(this.bIsNC == true){
      this.bIsNC = 'Y';
    }
    else{
      this.bIsNC = 'N';
    }
    
    this.qtyWithFGScanDtl.saveBatchSerInfo(this.CompanyDBId,this.psBatchSer,this.iQty,this.bIsRejected,this.bIsNC,this.basicDetailsFrmFGWithScan[0].WorkOrderNo,this.basicDetailsFrmFGWithScan[0].ItemCode,this.basicDetailsFrmFGWithScan[0].OperNo,this.loggedInUser).subscribe(
      data=> {
           if(data!=null){
            if(data == "True")  {
              alert("Data saved");
              this.rowDataFrmFGWithScan = [];
            }
            else{
              alert("Failed to Save Data");
              this.rowDataFrmFGWithScan = [];
            }
          }
      }
    )

  }

  //This will validate the FG Ser Batch
  validateFGSerBat(){ 

        this.CompanyDBId = sessionStorage.getItem('selectedComp');
        this.qtyWithFGScanDtl.checkIfFGSerBatisValid(this.CompanyDBId,this.psBatchSer,this.basicDetailsFrmFGWithScan[0].WorkOrderNo,this.basicDetailsFrmFGWithScan[0].ItemCode,this.basicDetailsFrmFGWithScan[0].OperNo).subscribe(
          data=> {
          if(data[0].ItemCheck =="ItemNotExists"){
            alert("FG Bat/Ser you are entering is not valid");
            this.psBatchSer = '';
            
          }
      }
    )
  }

  //This will update FG Ser Batch 
  updateBatchSerInfoRow(){
    this.CompanyDBId = sessionStorage.getItem('selectedComp');
    this.qtyWithFGScanDtl.updateBatchSerInfoRow(this.CompanyDBId,this.psBatchSer,this.iQty,this.bIsRejected,this.bIsNC,this.basicDetailsFrmFGWithScan[0].WorkOrderNo,this.basicDetailsFrmFGWithScan[0].OperNo,this.basicDetailsFrmFGWithScan[0].ItemCode,this.loggedInUser,this.iSeqNo).subscribe(
      data=> {
        if(data!=null){
          if(data == "True")  {
            alert("Data Updated sucessfully");
            this.rowDataFrmFGWithScan = [];
          }
          else{
            alert("Failed to update Data");
            this.rowDataFrmFGWithScan = [];
          }
         }
      }
  )

  }

  disableEnableControls(){
    // if(this.bIsEdit == true){
    //   // if(this.basicDetailsFrmFGWithScan[0].itemType == "Serial"){
    //   //   this.isQtyDisabled = true;
    //   // }
    // }
    // else{
    //       this.bIsInEditMode = false;
    // }
  }

  //this will chk if the data we are adding is duplicate
  chkIfFGBatSerAlreadyExists(){
    
    console.log(this.FGWithScanGridFrmMaster);

    for(let rowCount in this.FGWithScanGridFrmMaster){
      if(this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer)
      {
          alert("Finished Good  Already Added");
          this.psBatchSer = "";
          return true;
      }
    }
    return false;
  }
}
