import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import { QtyWithFGScanDetailComponent } from '../qty-with-fgscan-detail/qty-with-fgscan-detail.component';
import { UIHelper } from 'src/app/helpers/ui.helpers';


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

  constructor(private qtyWithFGScan: QtyWithFGScanService) { this.clearValues();}
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

  gridHeight: number;

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

  this.clearValues();

    //alert('change init');  
    this.gridHeight = UIHelper.getMainContentHeight();

    //  hide child level 
    this.QtyFGScanChildID.nativeElement.style.display = 'none';

    //console.log(this.basicDetailsFrmMO);
    this.CompanyDBId = this.CompanyDBId = sessionStorage.getItem('selectedComp');
    console.log(this.basicDetailsFrmMO);
    //Fill all details from DB in the grid
    this.fillFGData();
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
   
    if ($event == "true") {
      
 
      //This will again refresh the grid again
     
      this.fillFGData(); 
     
      this.rowDataForEdit = [];

       //This will again hide the popup again
       this.showFGInputForm = false;
    }
  }
  //Kendo inbuilt method handlers
  removeHandler({ rowIndex }) {
    this.qtyWithFGScan.deleteBatchSerInfo(this.CompanyDBId, this.FGScanGridData[rowIndex].OPTM_SEQ).subscribe(
      data => {
        if (data != null) {
          if (data == "True") {
            alert("Data deleted");
            this.fillFGData();
          }
          else {
            alert("Failed to delete data");
          }
        }
      }
    )
  }

  editHandler({ rowIndex }) {
    //To show the popup screen which will supdateave the data
    this.showLevelChild();
    this.rowDataForEdit.push({ FGBatchSerNo: this.FGScanGridData[rowIndex].OPTM_BTCHSERNO, Quantity: this.FGScanGridData[rowIndex].OPTM_QUANTITY, IsRejected: this.FGScanGridData[rowIndex].OPTM_REJECT, IsNC: this.FGScanGridData[rowIndex].OPTM_NC, SeqNo: this.FGScanGridData[rowIndex].OPTM_SEQ, ItemManagedBy: this.FGScanGridData[rowIndex].ManagedBy });
  }

  //On OK Press the control will back to the main Move Order screen
  onOKPress() {
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

  //Core Functions

  //This func. will fill data into the grid
   fillFGData() {
    
    this.showLoader = true;
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
  }
}
