import { Component, OnInit, Input, ViewChild, HostListener,EventEmitter, Output } from '@angular/core';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import { FgrmscanparentService } from '../services/fgrmscanparent.service';
import { UIHelper } from 'src/app/helpers/ui.helpers';
import { BaseClass } from 'src/app/classes/BaseClass'
import { ToastrService } from 'ngx-toastr';

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
  showFGInputForm:any = false;
  showLoader:boolean = false;
  private baseClassObj = new BaseClass();
  constructor(private qtyWithFGScan: QtyWithFGScanService, private fgrmService: FgrmscanparentService,private toastr: ToastrService) { }
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
   
   this.gridHeight = UIHelper.getMainContentHeight();

   // hide childsuperchild level on initial    
   this.qtylevelChildSuperchild.nativeElement.style.display = 'none';

   this.CompanyDBId = window.localStorage.getItem('selectedComp');
   console.log(this.basicDetailsFrmMO);
   this.basicDetailsToFGParentInput = this.basicDetailsFrmMO;
   //Fill all details from DB in the grid
   this.fillFGData();
   this.refreshQtys();
  }

  //Event
  onInsertFGBatSerRowPress(){
    //show the dialog for fg serial / batch
    //this.showFGRMScanParentInsertPopup = true;
  }
  
  //Kendo inbuilt method handlers
  removeHandler({rowIndex}){
  this.deleteParentFGandRM(rowIndex);
  }

  //For edit functionalities
  editHandler({ rowIndex }) {
    //To show the popup screen which will supdateave the data
    
    this.rowDataForEdit.push({ FGBatchSerNo: this.FGScanGridData[rowIndex].OPTM_BTCHSERNO,Quantity: this.FGScanGridData[rowIndex].OPTM_QUANTITY,IsRejected:this.FGScanGridData[rowIndex].OPTM_REJECT,IsNC: this.FGScanGridData[rowIndex].OPTM_NC,SeqNo: this.FGScanGridData[rowIndex].OPTM_SEQ,ItemManagedBy: this.FGScanGridData[rowIndex].ManagedBy});

    this.showLevelChildSuperChild();
  
  }

  //This will reload the screen
  receiveMessage($event) {
    if($event == "FromFGRMScanParentInputForm"){
      //This will hide the FGRM Svan paretn input form
      this.showFGInputForm = false;
      this.fillFGData();
      //This will clear ro data
      this.rowDataForEdit = [];
      }
  }

  //On OK Press the control will back to the main Move Order screen
  onOKPress(){
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
  fillFGData(){
    this.showLoader = true;
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
              
              if(this.FGScanGridData[iCount].OPTM_NC == 'Y'){
                this.FGScanGridData[iCount].OPTM_NC = true;
              }
              else{
                this.FGScanGridData[iCount].OPTM_NC = false;
              }
          }
            // refresh the qtys in the lower table
            this.refreshQtys();
            this.showLoader = false;
        }
      }
    )
  }

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
deleteParentFGandRM(rowIndex){
  this.showLoader = true;
  this.fgrmService.deleteParentFGandRM(this.CompanyDBId,this.FGScanGridData[rowIndex].OPTM_SEQ,this.basicDetailsFrmMO[0].WorkOrderNo,this.FGScanGridData[rowIndex].OPTM_BTCHSERNO).subscribe(
    data=> {
      if(data!=null){
        if(data == "True")  {
          //alert("Data deleted");
          this.fillFGData();
        }
        else{
          this.toastr.error('',"Failed to delete Data",this.baseClassObj.messageConfig);    
        }
        this.showLoader = false;
       }
       else{
        this.showLoader = false;
       }
    }
  )

} 

}


