import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';

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
  basicDetailsToFGParentInput:any;
  showFGRMScanParentInsertPopup:boolean = false;
  constructor(private qtyWithFGScan: QtyWithFGScanService) { }

  islevel2:boolean=false;
  islevel1:boolean=true;
  @ViewChild('qtylevel1') qtylevel1;
  @ViewChild('qtylevelChildSuperchild') qtylevelChildSuperchild;
  showLevelChildSuperChild(){
    this.qtylevel1.nativeElement.style.display = 'none';
    this.qtylevelChildSuperchild.nativeElement.style.display = 'block';
  }
  

  ngOnInit() {
   
   // hide childsuperchild level on initial    
   this.qtylevelChildSuperchild.nativeElement.style.display = 'none';

   this.CompanyDBId = sessionStorage.getItem('selectedComp');
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


