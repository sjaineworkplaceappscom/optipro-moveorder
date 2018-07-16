import { Component, OnInit, TemplateRef } from '@angular/core';
import { MoveorderService } from 'src/app/services/moveorder.service';
import { Router } from '@angular/router';
//For Ngx Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-move-order',
  templateUrl: './move-order.component.html',
  styleUrls: ['./move-order.component.css']
})

export class MoveOrderComponent implements OnInit {
  
  constructor(private mo:MoveorderService,private router:Router, private modalService: BsModalService) { }
  
  modalRef: BsModalRef;
  selectedWODetail:any;
  selectedWOOperDetail:any;
  CompanyDBId:string;
  modelSource:any;
  allWODetails:any;
  
  allWOOpDetails:any;
  data:any;
  psWONO:string = '';
  psOperNO:string ='';
  psOperName:string='';
  psProductCode:string = '';
  docEntry:number;
  showWODtPopup:boolean = false;
  showOperDtPopup:boolean = false;
  showItemLinkingScreen:boolean = false;
  ScreenName:string = '';
  settingOnSAP:string="3";
  showQtyWithFGScanScreen:boolean=false;
  showQtyNoScanScreen:boolean=false;
  showQtyWithFGRMScanScreen:boolean = false;
  bEnabeSaveBtn:boolean = false;
  basicDetails:any = [];
  psItemManagedBy:string;
  ngOnInit() {
  
  }

  //This will get all WO
  onWOPress(){
    this.CompanyDBId = sessionStorage.getItem('selectedComp');
    this.mo.getAllWorkOrders(this.CompanyDBId).subscribe(
      data=> {
       this.allWODetails = data;
       if(this.allWODetails.length > 0){
          this.psWONO = this.allWODetails[16].U_O_ORDRNO
          this.psProductCode = this.allWODetails[16].U_O_PRODID
          this.docEntry = this.allWODetails[16].DocEntry
          this.psItemManagedBy = this.allWODetails[16].ManagedBy
       }
      }
    )
  }

  onOperationPress(){
    this.CompanyDBId = sessionStorage.getItem('selectedComp');
    if(this.psWONO.length > 0){
      this.mo.getOperationByWorkOrder(this.CompanyDBId,this.docEntry).subscribe(
        data=> {
         this.allWOOpDetails = data;
         if(this.allWOOpDetails.length > 0){
          this.psOperNO = this.allWOOpDetails[0].U_O_OPERNO
         }
        }
      )
    }
  }

  onWorkOrderDetail(woDetailtemplate: TemplateRef<any>){
    this.selectedWODetail = this.filterWODetail(this.allWODetails, this.docEntry);
    this.modalRef = this.modalService.show(woDetailtemplate);
    this.showWODtPopup = true;
  }

  onOperDtlPress(woOperDetailtemplate: TemplateRef<any>){
  //here we will need to call a service which will get the Operation Details on the basis of docEntry & OperNo
    this.mo.getOperDetailByDocEntry(this.CompanyDBId,this.docEntry,this.psOperNO).subscribe(
      data=> {
       this.selectedWOOperDetail = data;
       this.modalRef = this.modalService.show(woOperDetailtemplate);
       this.showOperDtPopup = true;
      }
    )
  }

  onQtyProdBtnPress(itemLinkingScreen: TemplateRef<any>){
    //Setting basic details to share on another screen
    this.basicDetails.push({'WorkOrderNo':this.psWONO,'OperNo':this.psOperNO,'ItemCode':this.psProductCode,'ManagedBy': this.psItemManagedBy});
    this.showItemLinkingScreen = true; 
    if(this.settingOnSAP == "1"){
      this.ScreenName = 'Qty with No Scan';
      this.showQtyNoScanScreen = true;
    }
    if(this.settingOnSAP =="2"){
      this.ScreenName = 'Qty with Scan';
      this.showQtyWithFGScanScreen = true;
    }
    if(this.settingOnSAP == "3"){
      this.ScreenName = 'Qty with Finished Good & Raw Materials Scan';
      this.showQtyWithFGRMScanScreen = true;
    }
    this.modalRef = this.modalService.show(itemLinkingScreen);
  }
  //Core Functions
  //This will filter for filter WO
  filterWODetail(data, docEntry) {
        return data.filter(e => e.DocEntry == docEntry)
  }

  //This will filter Oper No
  filterOperDetail(data, operNo,docEntry) {
    return data.filter(e => e.U_O_OPERNO == operNo && e.DocEntry == docEntry)
}
}
