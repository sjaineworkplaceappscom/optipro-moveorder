import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import { BaseClass } from 'src/app/classes/BaseClass'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-qty-with-fgscan-detail',
  templateUrl: './qty-with-fgscan-detail.component.html',
  styleUrls: ['./qty-with-fgscan-detail.component.scss']
})
export class QtyWithFGScanDetailComponent implements OnInit {
  @Input() basicDetailsFrmFGWithScan: any;
  @Input() rowDataFrmFGWithScan: any;
  @Input() FGWithScanGridFrmMaster: any;
  @Input() qtySummaryValues: any;
  
  psBatchSer:string = '';
  iQty:number = 1;
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
  iSum:any =0;
  iAcceptedQty:any = 0;
  iRejectedQty:any = 0;
  iNCQty:any = 0;
  iProducedQty:any = 0;
  checkBatch:boolean = false;
  public bothSelectionRestrict:boolean = false;
  public bIfBatSerEmpty:boolean = false;
  public bIfQtyIsZero = false;
  public showLoader = false;
  private baseClassObj = new BaseClass();
  constructor(private qtyWithFGScanDtl: QtyWithFGScanService,private toastr: ToastrService) { }

  @Output() messageEvent = new EventEmitter<string>();

  
  //Events
  ngOnInit() {
    this.loggedInUser = window.localStorage.getItem('loggedInUser');
    this.CompanyDBId = window.localStorage.getItem('selectedComp');

    //taking item managed by
    if(this.basicDetailsFrmFGWithScan !=null){
      if(this.basicDetailsFrmFGWithScan.length > 0){
        this.psItemManagedBy = this.basicDetailsFrmFGWithScan[0].ManagedBy;
      }
    }

   
    if(this.rowDataFrmFGWithScan !=null){
      if(this.rowDataFrmFGWithScan.length > 0){
        this.bIsEdit = true;
        this.bIsInEditMode = true;
        this.psBatchSer = this.rowDataFrmFGWithScan[0].FGBatchSerNo;
        this.iQty = this.rowDataFrmFGWithScan[0].Quantity;
        this.bIsRejected = this.rowDataFrmFGWithScan[0].IsRejected;
        this.bIsNC = this.rowDataFrmFGWithScan[0].IsNC;
        this.iSeqNo = this.rowDataFrmFGWithScan[0].SeqNo;
        this.psItemManagedBy = this.rowDataFrmFGWithScan[0].ItemManagedBy;
      }
      else{
        this.bIsInEditMode = false;
      }
    }

     //Disable/enalbe controls
     this.disableEnableControls();

     console.log("QTY SUMMARY");
     console.log(this.qtySummaryValues);

     //this.updateQtySummaryValues();
  }

  onClosePress(){
      this.ShowParent('close');
  }
  ShowParent(FromOper){
    document.getElementById('opti_QtyFGScanChildID').style.display='none';
    document.getElementById('opti_QtyFGScanID').style.display='block';
      if(FromOper == "close"){
        //THis will notify the parent form i.e fg list
          this.messageEvent.emit("true");
      }
  
  }

  onAddPress(){
    
    if(this.psItemManagedBy == "Batch"){
      if(this.validateBatchItem() == false)
      this.checkBatch = true;
      else
      this.checkBatch = false;
    }
    
    //This mehtod will retrun true if all things are OK
     if(this.validateData() == true && this.checkBatch == false){
      //validate sum of qtys
      if(this.validateSumOfQtys()==true){
          if(this.bIsEdit==true){
            this.updateBatchSerInfoRow();
          }
          else{
            this.bIsInEditMode = false;
            this.saveBatchSerInfoRow();
          }
          
          this.ShowParent('add');
      }
     }
  }

 
  onBatchSerBlur(){
     //Added if for first time value is avail\able in input field.
     var inputValue = (<HTMLInputElement>document.getElementById('FgBatchSerialID')).value;
   //  var inputValue = "123#O1#5";
     if(inputValue.length>0){
      //alert('input values:'+inputValue);
       this.psBatchSer = inputValue; 
    
      //this.getDecodedString();
      //this.decodeBarcodeQRString();
    }
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

  //On Qty blur thi swill run
  onQtyBlur(){
    if(this.iQty <= 0 || this.iQty == undefined){
      this.bIfQtyIsZero = true;
    }
    else{
      this.bIfQtyIsZero = false;
     
      if(this.iQty > this.basicDetailsFrmFGWithScan[0].BalQty){
        //alert("Quantity can't be greater than balance qty");
        this.toastr.error('',"Quantity can't be greater than balance qty",this.baseClassObj.messageConfig);    
        this.iQty = 1;
        return;
      }
      else{
        //If value is ok then chk produced qty not greater than bal qty
        if(this.iQty > this.basicDetailsFrmFGWithScan[0].ProducedQty){
         // alert("Quantity can't be greater than produced quantity")
         this.toastr.error('',"Quantity can't be greater than produced qty",this.baseClassObj.messageConfig);    
          this.iQty = 1;
          return;
        }
      }
    }
  }

  onIsRejectedCheck(){
    this.bIsRejected = true;
    this.bIsNC = false;
    console.log(this.bIsRejected);
  }
  onIsNCCheck(){
    this.bIsNC = true;
    this.bIsRejected = false;
    console.log(this.bIsNC);
  }

  //Core Functions
  
  //this will save data 
  saveBatchSerInfoRow(){
    this.showLoader = true;
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
    
    if(this.iSeqNo == undefined || this.iSeqNo == null){
        this.iSeqNo = 0;
    }

    this.qtyWithFGScanDtl.saveBatchSerInfo(this.CompanyDBId,this.iSeqNo,this.psBatchSer,this.iQty,isRejected,isNC,this.basicDetailsFrmFGWithScan[0].WorkOrderNo,this.basicDetailsFrmFGWithScan[0].ItemCode,this.basicDetailsFrmFGWithScan[0].OperNo,this.loggedInUser).subscribe(
      data=> {
           if(data!=null){
            if(data == "True")  {
              //alert("Data saved");
              this.rowDataFrmFGWithScan = [];
              this.messageEvent.emit("true");
            }
            else{
              //alert("Failed to Save Data");
              this.toastr.error('',"Failed to Save Data",this.baseClassObj.messageConfig);    
              this.rowDataFrmFGWithScan = [];
            }
            this.showLoader = false;
          }
      }
    )

  }

  //This will validate the FG Ser Batch
  validateFGSerBat(){ 

        this.CompanyDBId = window.localStorage.getItem('selectedComp');
        this.qtyWithFGScanDtl.checkIfFGSerBatisValid(this.CompanyDBId,this.psBatchSer,this.basicDetailsFrmFGWithScan[0].WorkOrderNo,this.basicDetailsFrmFGWithScan[0].ItemCode,this.basicDetailsFrmFGWithScan[0].OperNo).subscribe(
          data=> {
          if(data[0].ItemCheck =="ItemNotExists"){
            this.toastr.error('',"FG Bat/Ser you are entering is not valid",this.baseClassObj.messageConfig);    
            this.psBatchSer = '';
            this.iQty = 1;
            return;
          }
          if(data[0].ItemCheck =="ItemRejected"){
            this.toastr.error('',"FG Bat/Ser you are entering is rejected",this.baseClassObj.messageConfig);   
            this.psBatchSer = '';
            this.iQty = 1;
            return;
            }
          if(data[0].ItemCheck =="ItemMoved"){
            this.toastr.error('',"FG Bat/Ser you are entering is already moved",this.baseClassObj.messageConfig);   
            this.psBatchSer = '';
            this.iQty = 1;
            return;
            }
          if(data[0].ItemCheck =="Manual"){
            console.log(this.psBatchSer+" -->This has a maual case");
          }
      }
    )
  }

   //This will validate the FG Batch

  validateBatchItem(){

    console.log(this.FGWithScanGridFrmMaster);

    if (this.FGWithScanGridFrmMaster != null) {

    for(let rowCount in this.FGWithScanGridFrmMaster){
      if(this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer)
      {
        if(this.FGWithScanGridFrmMaster[rowCount].OPTM_REJECT == true && this.bIsRejected == true){
              this.toastr.error('',"Item is already rejected. You can edit it from the grid.",this.baseClassObj.messageConfig);    
              this.psBatchSer = "";
              this.bIsRejected = false; this.iQty = 1;
              return false;
        }

        else if(this.FGWithScanGridFrmMaster[rowCount].OPTM_NC == true && this.bIsNC == true){
            this.toastr.error('',"Item is already present in NC. You can edit it from the grid.",this.baseClassObj.messageConfig);    
            this.psBatchSer = "";
            this.bIsNC = false; this.iQty = 1;
            return false;
         }
          
        else if(this.FGWithScanGridFrmMaster[rowCount].OPTM_NC == false && this.FGWithScanGridFrmMaster[rowCount].OPTM_NC == false){
          if(this.bIsRejected == false && this.bIsNC == false){
            this.toastr.error('',"Item is already present. You can edit it from the grid.",this.baseClassObj.messageConfig);    
            this.psBatchSer = ""; this.iQty = 1;
            return false;
          }
       }
        
      }
    }

    return true;
  }
   
  }

  //This will update FG Ser Batch 
  updateBatchSerInfoRow(){
    this.showLoader = true;

    this.CompanyDBId = window.localStorage.getItem('selectedComp');
    this.qtyWithFGScanDtl.updateBatchSerInfoRow(this.CompanyDBId,this.psBatchSer,this.iQty,this.bIsRejected,this.bIsNC,this.basicDetailsFrmFGWithScan[0].WorkOrderNo,this.basicDetailsFrmFGWithScan[0].OperNo,this.basicDetailsFrmFGWithScan[0].ItemCode,this.loggedInUser,this.iSeqNo).subscribe(
      data=> {
        if(data!=null){
          if(data == "True")  {
            //alert("Data Updated sucessfully");
            this.rowDataFrmFGWithScan = [];
            this.messageEvent.emit("true");
          }
          else{
            //alert("Failed to update Data");
            this.toastr.error('',"Failed to update Data",this.baseClassObj.messageConfig);  
            console.log("DATA save failed-->"+data);  
            this.rowDataFrmFGWithScan = [];
          }
          this.showLoader = false;
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

    if(this.psItemManagedBy == "Batch"){
      return false;
    }
    
    console.log(this.FGWithScanGridFrmMaster);

    for(let rowCount in this.FGWithScanGridFrmMaster){
      if(this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer)
      {
          //alert("Serial/Batch already exist");
          this.toastr.warning('',"Serial/Batch already exist",this.baseClassObj.messageConfig);    
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

  //Get Decoded String
  getDecodedString(){
    this.showLoader = true;
    this.qtyWithFGScanDtl.getDecodedString(this.CompanyDBId,this.psBatchSer).subscribe(
      data=> {
        if(data!=null){
        this.showLoader = false;
        
         if(data.length > 0){
            console.log("response data"+data);
            this.psBatchSer = "";
            this.iQty = 1;
         }
         }
      }
  )
  }

  //This will check the sum of qty not to be greater then produced
  validateSumOfQtys(){
    let isValidQtys = true;
    
    if(this.psItemManagedBy == "Serial"){
      console.log(this.FGWithScanGridFrmMaster)
      debugger;
      let totalQty = 0;
      for(let rowCount in this.FGWithScanGridFrmMaster){
        totalQty=this.FGWithScanGridFrmMaster[rowCount].OPTM_QUANTITY + totalQty;
      }
     
      //Check sum of qtys here
      if(totalQty > this.basicDetailsFrmFGWithScan[0].BalQty){
        //alert("Quantity can't be greater than balance qty");
        this.toastr.error('',"Quantity can't be greater than balance qty",this.baseClassObj.messageConfig);    
        this.iQty = 1;
        return;
      }
      else{
        //If value is ok then chk produced qty not greater than bal qty
        if(totalQty > this.basicDetailsFrmFGWithScan[0].ProducedQty){
          //alert("Quantity can't be greater than produced quantity")
          this.toastr.error('',"Quantity can't be greater than produced qty",this.baseClassObj.messageConfig);    
          this.iQty = 1;
          return;
        }
      }

    }
    else{
      if(this.iQty > this.basicDetailsFrmFGWithScan[0].ProducedQty)
      {
        //alert("Quantity can't be greater than produced quantity")
        this.toastr.error('',"Quantity can't be greater than produced qty",this.baseClassObj.messageConfig);    
        isValidQtys = false;
      }
    }
    


    return isValidQtys;
  }

  //Update Qty Summary Values
  updateQtySummaryValues(){

    this.iAcceptedQty = this.qtySummaryValues[0].AcceptedQty;
    this.iNCQty = this.qtySummaryValues[0].NcQty;
    this.iRejectedQty = this.qtySummaryValues[0].RejectedQty;
    this.iProducedQty = this.qtySummaryValues[0].ProducedQty;

  }
  //Decode the string
//   decodeBarcodeQRString(){

//  //If Local Scanning is required
//        if(this.psBatchSer.indexOf("#")==-1){
//           //nothing to do.
//        }else{
//        let x = this.psBatchSer.split("#");
//        //alert('splited values:'+x[0]+","+x[1]);
//        if(this.psItemManagedBy == "Serial"){
//         //alert("if serial conditon");
//         if(x[1] != null ||  x[1] != undefined){
//           //alert("in null undefined if conditon");
//          if(Number(x[1])> 1){
//           //alert("value grater then 1 if conditon");
//             //show error.
//             alert("Quantity not allowed for serial tracked item.");
//             return;
//          }
//          else{
//          // alert("batch serial else");
//           this.psBatchSer = x[0]; 
//          }
          
//         }else{
//          // alert("outer else");
//          this.psBatchSer = x[0];
//         }
//        }else{
//        // alert("Else of serial");
//          this.psBatchSer = x[0];
//          this.iQty = Number(x[1]);
//        }
//      //  alert("values psBatchSer,iQty"+this.psBatchSer+", "+this.iQty);
//      }
//   }
}
