import { Component, OnInit, Input, ViewChild, HostListener,EventEmitter, Output } from '@angular/core';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import { FgrmscanparentService } from '../services/fgrmscanparent.service';
import { UIHelper } from 'src/app/helpers/ui.helpers';
import { BaseClass } from 'src/app/classes/BaseClass'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-fgrmscanparent',
  templateUrl: './fgrmscanparent.component.html',
  styleUrls: ['./fgrmscanparent.component.scss']
})
export class FgrmscanparentComponent implements OnInit {
  @Input() basicDetailsFrmMO: any;
  FGScanGridData:any = [];
  CompanyDBId:string = '';
  showEditBtn:boolean = true;
  lblBalQty:number =0.0;
  lblAcceptedQty:number =0.0;
  lblRejectedQty:number =0.0;
  lblNCQty:number =0.0;
  lblProducedQty:number = 0.0;
  basicDetailsToFGParentInput:any;
  rowDataForEdit: any = [];
  bIsFGRMGridInEditMode: boolean = false;
  showFGInputForm:any = false;
  showLoader:boolean = false;
  public language: any;
  private baseClassObj = new BaseClass();
  public SaveFGData = {};
  constructor(private qtyWithFGScan: QtyWithFGScanService, private fgrmService: FgrmscanparentService,private toastr: ToastrService,private commonService: CommonService) { }
  @Output() messageEvent = new EventEmitter<string>();

  gridHeight: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.gridHeight = UIHelper.getMainContentHeight();
  }

  islevel2:boolean=false;
  islevel1:boolean=true;
  @ViewChild('qtylevel1') qtylevel1;
  @ViewChild('qtylevelChildSuperchild') qtylevelChildSuperchild;
  showLevelChildSuperChild(){
    this.qtylevel1.nativeElement.style.display = 'none';
    this.qtylevelChildSuperchild.nativeElement.style.display = 'block';
    this.showFGInputForm = true;
  }
  

  ngOnInit() {
   this.language = JSON.parse(window.localStorage.getItem('language'));
   this.gridHeight = UIHelper.getMainContentHeight();

   this.fgrmService.updateHeader();

   // hide childsuperchild level on initial    
   this.qtylevelChildSuperchild.nativeElement.style.display = 'none';

   this.CompanyDBId = window.localStorage.getItem('selectedComp');
   console.log(this.basicDetailsFrmMO);
   this.basicDetailsToFGParentInput = this.basicDetailsFrmMO;
   //Fill all details from DB in the grid
  // this.fillFGData();  
   
   this.getFGData();
   this.refreshQtys();
  }

  getFGData(){
    this.FGScanGridData = [];
    let tempArr;
    let temStr = window.localStorage.getItem('SaveFGData');

    if(temStr != '' && temStr != undefined){
      tempArr = JSON.parse(window.localStorage.getItem('SaveFGData'));
      let ArrData = tempArr.ParentDataToSave;
    for(let i=0; i< ArrData.length; i++){
      ArrData[i].OPTM_SEQ = ArrData[i].SequenceNo;
      ArrData[i].OPTM_BTCHSERNO = ArrData[i].FGBatchSerial;
      ArrData[i].OPTM_QUANTITY = Number(ArrData[i].Quantity);
      ArrData[i].OPTM_REJECT = ArrData[i].Rejected == 'Y' ? true:false ;
      ArrData[i].OPTM_NC = ArrData[i].NC == 'Y' ? true:false;
      ArrData[i].RefId = Number(ArrData[i].RefId);
     }  
     this.FGScanGridData = ArrData;
    }     
   console.log(this.FGScanGridData);
  }

  //Event
  onInsertFGBatSerRowPress(){
    //show the dialog for fg serial / batch
    //this.showFGRMScanParentInsertPopup = true;
  }
  
  //Kendo inbuilt method handlers
  removeHandler(evt){
  //this.deleteParentFGandRM(rowIndex);
  
  this.FGScanGridData.splice(evt.rowIndex, 1);
  let tempArr;
  tempArr = JSON.parse(window.localStorage.getItem('SaveFGData')); 
  
  tempArr.ParentDataToSave = tempArr.ParentDataToSave.filter(val => val.RefId !== evt.dataItem.RefId); 

  if(tempArr.ChildDataToSave != undefined && tempArr.ChildDataToSave != null){
    tempArr.ChildDataToSave = tempArr.ChildDataToSave.filter(val => val.RefId !== evt.dataItem.RefId); 
  }  
  window.localStorage.setItem('SaveFGData', JSON.stringify(tempArr));  
  this.refreshQtys();
}

  //For edit functionalities
  editHandler({ rowIndex }) {
    //To show the popup screen which will supdateave the data
    this.bIsFGRMGridInEditMode = true;    
    this.rowDataForEdit.push({ FGBatchSerNo: this.FGScanGridData[rowIndex].OPTM_BTCHSERNO,Quantity: this.FGScanGridData[rowIndex].OPTM_QUANTITY,IsRejected:this.FGScanGridData[rowIndex].OPTM_REJECT,IsNC: this.FGScanGridData[rowIndex].OPTM_NC,SeqNo: this.FGScanGridData[rowIndex].OPTM_SEQ,ItemManagedBy: this.FGScanGridData[rowIndex].ManagedBy,RefId: this.FGScanGridData[rowIndex].RefId});

    this.showLevelChildSuperChild();  
  }

  //This will reload the screen
  receiveMessage($event) {
    // if($event == "FromFGRMScanParentInputForm"){
    //   //This will hide the FGRM Svan paretn input form
    //   this.showFGInputForm = false;
    //   this.fillFGData();
    //   //This will clear ro data
    //   this.rowDataForEdit = [];
    //   }

      let rowExists = false;
      this.showFGInputForm = false;  
      this.rowDataForEdit = []; 
      if($event != undefined)   {
        let temStr = window.localStorage.getItem('SaveFGData');
        if(temStr != '' && temStr != undefined){
          this.SaveFGData = JSON.parse(window.localStorage.getItem('SaveFGData'));
        }
      
      if(this.FGScanGridData != null && this.FGScanGridData.length > 0){
        rowExists = this.FGScanGridData.some(e => e.RefId == $event.RefId);  
      }

      if (!rowExists) {
        if($event != undefined)
        this.FGScanGridData.push($event);
      }
  
      else{
        for (let iRowCount in this.FGScanGridData) {
          // if ($event.OPTM_SEQ == this.FGScanGridData[iRowCount].OPTM_SEQ &&
          //   this.FGScanGridData[iRowCount].OPTM_BTCHSERNO == $event.OPTM_BTCHSERNO) {

          if($event.RefId == this.FGScanGridData[iRowCount].RefId){  
            this.FGScanGridData[iRowCount].OPTM_BTCHSERNO = $event.OPTM_BTCHSERNO         
            this.FGScanGridData[iRowCount].OPTM_QUANTITY = Number($event.OPTM_QUANTITY)
            this.FGScanGridData[iRowCount].OPTM_REJECT = $event.OPTM_REJECT
            this.FGScanGridData[iRowCount].OPTM_NC = $event.OPTM_NC,
            this.FGScanGridData[iRowCount].RefId = $event.RefId
          }         
        }
      }

      this.refreshQtys();    
    }          
    
  }

  //On OK Press the control will back to the main Move Order screen
  onOKPress(){

    if(this.lblProducedQty > this.lblBalQty){
      this.toastr.error('', this.language.prod_qty_greater_than_bal, this.baseClassObj.messageConfig);
      return false;
    }

    // this.optirightfixedsection.nativeElement.style.display = 'none';
    document.getElementById('opti_rightfixedsectionID').style.display = 'none';
    document.getElementById('opti_QuantityRightSection').style.display = 'none';
    
    //We will get this values and push into this array to send back
    
      let QtySummary:any = {
        'BalQty': this.lblBalQty,
        'AcceptedQty': this.lblAcceptedQty,
        'RejectedQty': this.lblRejectedQty,
        'NCQty': this.lblNCQty,
        'ProducedQty': this.lblProducedQty
      };
      
      this.messageEvent.emit(QtySummary);
  }
  //Core Functions
  //This func. will fill data into the grid
  // fillFGData(){
  //   this.showLoader = true;
    
  //   this.qtyWithFGScan.getBatchSerialInfo(this.CompanyDBId,this.basicDetailsFrmMO[0].WorkOrderNo,this.basicDetailsFrmMO[0].ItemCode,this.basicDetailsFrmMO[0].OperNo).subscribe(
  //     data=> {
  //       if(data != null){
  //         this.FGScanGridData = data;
  //         for(let iCount in this.FGScanGridData){
  //             if(this.FGScanGridData[iCount].OPTM_REJECT == 'Y'){
  //               this.FGScanGridData[iCount].OPTM_REJECT = true;
  //             }
  //             else{
  //               this.FGScanGridData[iCount].OPTM_REJECT = false;
  //             }
              
  //             if(this.FGScanGridData[iCount].OPTM_NC == 'Y'){
  //               this.FGScanGridData[iCount].OPTM_NC = true;
  //             }
  //             else{
  //               this.FGScanGridData[iCount].OPTM_NC = false;
  //             }
  //         }
  //           // refresh the qtys in the lower table
  //           this.refreshQtys();
  //           this.showLoader = false;
  //       }
  //     },
  //     error => {
  //       this.showLoader = false;
  //       if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
  //         this.commonService.unauthorizedToken(error);               
  //       }               
  //     }
  //   )
  // }

//refresh Qtys in the lower table
refreshQtys(){
  let iRejectCount:number =0;
  let iNCCount:number = 0;
  let balQty:number = 0;
  let totalBalQty:number = 0;
  let totalProducedQty:number = 0;
  for(let recCount in this.FGScanGridData){

    totalProducedQty = totalProducedQty+this.FGScanGridData[recCount].OPTM_QUANTITY;
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
    this.lblBalQty = this.basicDetailsFrmMO[0].BalQty;
    this.lblRejectedQty = iRejectCount;
    this.lblNCQty = iNCCount;
    this.lblProducedQty = totalProducedQty;
    this.lblAcceptedQty = totalProducedQty - iNCCount - iRejectCount;
}

//This will Delete the Parent FGs and its corresponding attached Child RMs
// deleteParentFGandRM(rowIndex){
//   this.showLoader = true;
//   this.fgrmService.deleteParentFGandRM(this.CompanyDBId,this.FGScanGridData[rowIndex].OPTM_SEQ,this.basicDetailsFrmMO[0].WorkOrderNo,this.FGScanGridData[rowIndex].OPTM_BTCHSERNO,
//     this.FGScanGridData[rowIndex].OPTM_ITEMCODE, this.FGScanGridData[rowIndex].OPTM_BTCHSERNO).subscribe(
//     data=> {
//       if(data!=null){
//         if(data == "True")  {
//           this.fillFGData();
//         }
//         else{
//           this.toastr.error('',this.language.failed_to_delete_data,this.baseClassObj.messageConfig);    
//         }
//         this.showLoader = false;
//        }
//        else{
//         this.showLoader = false;
//        }
//     },
//     error => {
//       this.showLoader = false;
//       if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
//         this.commonService.unauthorizedToken(error);               
//       }               
//     }
//   )

// } 

}


