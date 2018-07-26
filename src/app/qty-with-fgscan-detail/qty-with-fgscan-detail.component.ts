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
  bIsRejected:any = false;
  CompanyDBId:string= '';
  bIsNC:any = false;
  bIsEdit:boolean = false;
  loggedInUser:string='';
  iSeqNo:number;
  isQtyDisabled:boolean = false;
  bIsInEditMode = false;
  psItemManagedBy:string = '';
  bEnableSaveBtn:boolean = false;
  public bothSelectionRestrict:boolean = false;
  public bIfBatSerEmpty:boolean = false;
  public bIfQtyIsZero = false;
  
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
        this.bIsInEditMode = false;
        this.psBatchSer = this.rowDataFrmFGWithScan[0].FGBatchSerNo;
        this.iQty = this.rowDataFrmFGWithScan[0].Quantity;
        this.bIsRejected = this.rowDataFrmFGWithScan[0].IsRejected;
        this.bIsNC = this.rowDataFrmFGWithScan[0].IsNC;
        this.iSeqNo = this.rowDataFrmFGWithScan[0].SeqNo;
        this.psItemManagedBy = this.rowDataFrmFGWithScan[0].ItemManagedBy;
      }
      else{
        this.bIsInEditMode = true;
      }
    }
  }

  ShowParent(){
    document.getElementById('opti_QtyFGScanChildID').style.display='none';
    document.getElementById('opti_QtyFGScanID').style.display='block';
  }

  onAddPress(){
    //This mehtod will retrun true if all things are OK
     if(this.validateData() == true){
      if(this.bIsEdit==true){
        this.updateBatchSerInfoRow();
       }
       else{
        this.bIsInEditMode = false;
        this.saveBatchSerInfoRow();
       }
       this.messageEvent.emit(this.message)
       this.ShowParent();
     }
  }

  onBatchSerBlur(){
    if(this.psBatchSer != null){
      if(this.psBatchSer.length > 0){
        this.bIfBatSerEmpty = false;
         if(this.chkIfFGBatSerAlreadyExists() == false){
          this.validateFGSerBat();
         }

        //If the value is filled then only enable add button
        this.bEnableSaveBtn = true;

      }
      else{
        this.bIfBatSerEmpty = true;
        //If the value is filled then only enable add button
        this.bEnableSaveBtn = true;
      }
    }
  }

  onQtyBlur(){
    if(this.iQty <= 0 || this.iQty == undefined){
      this.bIfQtyIsZero = true;
    }
    else{
      this.bIfQtyIsZero = false;
    }
    
  }

  onIsRejectedCheck(){
    console.log(this.bIsRejected);
  }
  onIsNCCheck(){
    console.log(this.bIsNC);
  }

  //Core Functions
  
  //this will save data 
  saveBatchSerInfoRow(){
    let isRejected;
    let isNC;
    if(this.bIsRejected == true){
      isRejected = 'Y';
    }
    else{
      isRejected = 'N';
    }

    if(this.bIsNC == true){
      isNC = 'Y';
    }
    else{
      isNC = 'N';
    }
    
    this.qtyWithFGScanDtl.saveBatchSerInfo(this.CompanyDBId,this.psBatchSer,this.iQty,isRejected,isNC,this.basicDetailsFrmFGWithScan[0].WorkOrderNo,this.basicDetailsFrmFGWithScan[0].ItemCode,this.basicDetailsFrmFGWithScan[0].OperNo,this.loggedInUser).subscribe(
      data=> {
           if(data!=null){
            if(data == "True")  {
              alert("Data saved");
              this.rowDataFrmFGWithScan = [];
              this.messageEvent.emit("true");
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
            this.messageEvent.emit("true");
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
   if(this.psItemManagedBy == "Serial"){
    this.isQtyDisabled = true; 
    this.iQty = 1;
   }
   else{
    this.isQtyDisabled = false; 
   }
  }

  //this will chk if the data we are adding is duplicate
  chkIfFGBatSerAlreadyExists(){
    
    console.log(this.FGWithScanGridFrmMaster);

    for(let rowCount in this.FGWithScanGridFrmMaster){
      if(this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer)
      {
          alert("Serial/Batch already exist");
          this.psBatchSer = "";
          return true;
      }
    }
    return false;
  }

  validateData(){
    //Check whether the input is not empty
    if(this.psBatchSer == '' || this.psBatchSer == null){
      this.bIfBatSerEmpty = true;
      return false;
    }
    else{
      this.bIfBatSerEmpty = false;
    }
    

    //Check whether the qty is not empty
    if(this.iQty <= 0 || this.iQty == undefined){
      this.bIfQtyIsZero = true;
      return false;
    }
    else{
      this.bIfQtyIsZero = false;
    }


    //Check if selection is of both is done
    if(this.bIsNC == true && this.bIsRejected == true){
      this.bothSelectionRestrict = true;
      return false;
    }
    else{
      this.bothSelectionRestrict = false;
    }

    return true;
  }
}
