import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import { QtyWithFGScanDetailComponent } from '../qty-with-fgscan-detail/qty-with-fgscan-detail.component';
import { UIHelper } from 'src/app/helpers/ui.helpers';
import { BaseClass } from 'src/app/classes/BaseClass'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-qty-with-fgscan',
  templateUrl: './qty-with-fgscan.component.html',
  styleUrls: ['./qty-with-fgscan.component.scss']
})
export class QtyWithFGScanComponent implements OnInit {
  @Input() basicDetailsFrmMO: any;
  @ViewChild(QtyWithFGScanDetailComponent) child;
  @ViewChild('QtyFGScanIDParent') QtyFGScanIDParent;
  @ViewChild('QtyFGScanChildID') QtyFGScanChildID;

  FGScanGridData: any = [];
  CompanyDBId: string = "";
  public showFGInputForm: boolean = false;
  public view: Observable<GridDataResult>;
  public showLoader: boolean = false;

  constructor(private qtyWithFGScan: QtyWithFGScanService,private toastr: ToastrService,private commonService: CommonService) { this.clearValues();}
  @Output() messageEvent = new EventEmitter<string>();
  txtFGValue: string = "";
  txtFGSerBatValue: string = "";
  txtFGQty: number = 0;
  isFGValid: boolean = true;
  lblBalQty: number = 0.0;
  lblAcceptedQty: number = 0.0;
  lblRejectedQty: number = 0.0;
  lblNCQty: number = 0.0;
  lblProducedQty: number = 0.0;
  rowID: number = 0;
  rowDataForEdit: any = [];
  showEditBtn: boolean = true;
  qtySummaryValuesFGScan: any = [];
  gridHeight: number;
  public language: any;
  private baseClassObj = new BaseClass();
  public SaveFGData = {};

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.gridHeight = UIHelper.getMainContentHeight();
  }
  ngOnChange(){
    //this.clearValues();
    //alert('onchange-Child');
    //this.fillFGData();
    //this.refreshQtys();
  }
  ngOnInit() {

    this.language = JSON.parse(window.localStorage.getItem('language'));
    this.clearValues();

    this.qtyWithFGScan.updateHeader();
    
    //alert('change init');  
    this.gridHeight = UIHelper.getMainContentHeight();

    //  hide child level 
    this.QtyFGScanChildID.nativeElement.style.display = 'none';

    //console.log(this.basicDetailsFrmMO);
    this.CompanyDBId = window.localStorage.getItem('selectedComp');
    console.log(this.basicDetailsFrmMO);
    //Fill all details from DB in the grid
   // this.fillFGData();
    this.getFGData();
    this.refreshQtys();
  }

  clearValues(){
  this.txtFGValue = "";
  this.txtFGSerBatValue = "";
  this.txtFGQty = 0;
  this.isFGValid = true;
  this.lblBalQty = 0.0;
  this.lblAcceptedQty= 0.0;
  this.lblRejectedQty = 0.0;
  this.lblNCQty= 0.0;
  this.lblProducedQty= 0.0;
  this.rowID= 0;
  this.rowDataForEdit = [];
  this.showEditBtn = true;
  //this.basicDetailsFrmMO=[];
  
  }
  showLevelChild() {
    this.QtyFGScanChildID.nativeElement.style.display = 'block';
    this.QtyFGScanIDParent.nativeElement.style.display = 'none';
    //This will make the FG input Form show 
    this.showFGInputForm = true;
  }

  receiveMessage($event) {
   
    // if ($event == "true") {      
    //   this.fillFGData();      
    //   this.rowDataForEdit = [];
    //   this.showFGInputForm = false;
    // }

    this.rowDataForEdit = [];
    this.showFGInputForm = false;

    if($event != undefined && $event != null){
            
      let rowExists = false;
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
          
          if($event.RefId == this.FGScanGridData[iRowCount].RefId){  
            this.FGScanGridData[iRowCount].OPTM_BTCHSERNO = $event.OPTM_BTCHSERNO         
            this.FGScanGridData[iRowCount].OPTM_QUANTITY = Number($event.OPTM_QUANTITY)
            this.FGScanGridData[iRowCount].OPTM_REJECT = $event.OPTM_REJECT
            this.FGScanGridData[iRowCount].OPTM_NC = $event.OPTM_NC,
            this.FGScanGridData[iRowCount].RefId = $event.RefId
          }         
        }
      }

      console.log(this.FGScanGridData);
      this.refreshQtys();   
      
    }
  }
  //Kendo inbuilt method handlers
  removeHandler(evt) {
    // this.qtyWithFGScan.deleteBatchSerInfo(this.CompanyDBId, this.FGScanGridData[rowIndex].OPTM_SEQ, this.FGScanGridData[rowIndex].OPTM_WONO, this.FGScanGridData[rowIndex].OPTM_ITEMCODE,this.FGScanGridData[rowIndex].OPTM_BTCHSERNO).subscribe(
    //   data => {
    //     if (data != null) {
    //       if (data == "True") {
    //         //alert("Data deleted");
    //         this.fillFGData();
    //       }
    //       else {
    //         this.toastr.error('', this.language.failed_to_delete_data, this.baseClassObj.messageConfig);
    //         console.log("error-->" + data);
    //       }
    //     }
    //   }
    // )

    this.FGScanGridData.splice(evt.rowIndex, 1);
    let tempArr;
    tempArr = JSON.parse(window.localStorage.getItem('SaveFGData')); 
    
    tempArr.ParentDataToSave = tempArr.ParentDataToSave.filter(val => val.RefId !== evt.dataItem.RefId); 
    window.localStorage.setItem('SaveFGData', JSON.stringify(tempArr));  
    this.refreshQtys();
  }

  editHandler({ rowIndex }) {
    //To show the popup screen which will supdateave the data
    this.showLevelChild();
    this.rowDataForEdit.push({ FGBatchSerNo: this.FGScanGridData[rowIndex].OPTM_BTCHSERNO, Quantity: this.FGScanGridData[rowIndex].OPTM_QUANTITY, IsRejected: this.FGScanGridData[rowIndex].OPTM_REJECT, IsNC: this.FGScanGridData[rowIndex].OPTM_NC, SeqNo: this.FGScanGridData[rowIndex].OPTM_SEQ, ItemManagedBy: this.FGScanGridData[rowIndex].ManagedBy });
  }

  //On OK Press the control will back to the main Move Order screen
  onOKPress() {

      if(this.lblProducedQty > this.lblBalQty){
        this.toastr.error('', this.language.prod_qty_greater_than_bal, this.baseClassObj.messageConfig);
        return false;
      }

      // this.optirightfixedsection.nativeElement.style.display = 'none';
      document.getElementById('opti_rightfixedsectionID').style.display = 'none';
      document.getElementById('opti_QuantityRightSection').style.display = 'none';

      //We will get this values and push into this array to send back
      let QtySummary: any = {
        'BalQty': this.lblBalQty,
        'AcceptedQty': this.lblAcceptedQty,
        'RejectedQty': this.lblRejectedQty,
        'NCQty': this.lblNCQty,
        'ProducedQty': this.lblProducedQty
      };

      this.messageEvent.emit(QtySummary);
   
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
  }

  //Core Functions

  //This func. will fill data into the grid
   fillFGData() {
    
    this.showLoader = true;
    console.log(this.lblProducedQty);
     this.qtyWithFGScan.getBatchSerialInfo(this.CompanyDBId, this.basicDetailsFrmMO[0].WorkOrderNo, this.basicDetailsFrmMO[0].ItemCode, this.basicDetailsFrmMO[0].OperNo).subscribe(
      data => {
        if (data != null) {

          this.FGScanGridData = data;
          for (let iCount in this.FGScanGridData) {
            if (this.FGScanGridData[iCount].OPTM_REJECT == 'Y') {
              this.FGScanGridData[iCount].OPTM_REJECT = true;
            }
            else {
              this.FGScanGridData[iCount].OPTM_REJECT = false;
            }

            if (this.FGScanGridData[iCount].OPTM_NC == 'Y') {
              this.FGScanGridData[iCount].OPTM_NC = true;
            }
            else {
              this.FGScanGridData[iCount].OPTM_NC = false;
            }

          }
          // refresh the qtys in the lower table
          this.refreshQtys();
          this.showLoader = false;
        }
        else {
          this.showLoader = false;
        }
      },
      error => {
        this.showLoader = false;
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }               
      }
    )

    if (this.basicDetailsFrmMO[0].ManagedBy == "Serial") {
      this.showEditBtn = false;
    }
    else {
      this.showEditBtn = true;
    }

  }

  //refresh Qtys in the lower table
  refreshQtys() {
    let iRejectCount: number = 0;
    let iNCCount: number = 0;
    let balQty: number = 0;
    let totalProducedQty: number = 0;
    for (let recCount in this.FGScanGridData) {

      totalProducedQty = totalProducedQty + this.FGScanGridData[recCount].OPTM_QUANTITY;
      balQty = balQty + this.FGScanGridData[recCount].OPTM_QUANTITY;
      if (this.FGScanGridData[recCount].OPTM_REJECT == true) {
        iRejectCount = iRejectCount + this.FGScanGridData[recCount].OPTM_QUANTITY;
        balQty = balQty - this.FGScanGridData[recCount].OPTM_QUANTITY;
      }
      if (this.FGScanGridData[recCount].OPTM_NC == true) {
        iNCCount = iNCCount + this.FGScanGridData[recCount].OPTM_QUANTITY;

        balQty = balQty - this.FGScanGridData[recCount].OPTM_QUANTITY;

      }

    }

    this.lblBalQty = this.basicDetailsFrmMO[0].BalQty;
    this.lblRejectedQty = iRejectCount;
    this.lblNCQty = iNCCount;
    this.lblProducedQty = totalProducedQty;
    this.lblAcceptedQty = totalProducedQty - iNCCount - iRejectCount;

    //put the summary in an array for calculation
  //  this.qtySummaryValuesFGScan.push({RejectedQty: this.lblRejectedQty, NcQty:this.lblNCQty, AcceptedQty:this.lblAcceptedQty, BalQty:this.lblBalQty, ProducedQty:this.lblProducedQty});
  }
}
