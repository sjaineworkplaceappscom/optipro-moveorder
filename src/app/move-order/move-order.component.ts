import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MoveorderService } from 'src/app/services/moveorder.service';
import { Router } from '@angular/router';
//For Ngx Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-move-order',
  templateUrl: './move-order.component.html',
  styleUrls: ['./move-order.component.scss']
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

  public startdate: Date;
  public enddate: Date;

  ngOnInit() {
    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-move-order");
    element.classList.add("opti_account-module");
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
      this.mo.getOperationByWorkOrder(this.CompanyDBId,this.docEntry,this.psWONO).subscribe(
        data=> {
         this.allWOOpDetails = data;
         if(this.allWOOpDetails.length > 0){
          this.psOperNO = this.allWOOpDetails[1].U_O_OPERNO
         }
        }
      )
    }
  }

  isWorkOrderRightSection:boolean = false;
  onWorkOrderDetail(status){
    if(this.psWONO !=null && this.psWONO){
      this.showWODtPopup = true;
      this.isWorkOrderRightSection = status;
      this.openRightSection(status);
      this.selectedWODetail = this.filterWODetail(this.allWODetails, this.docEntry);
    }
    else{
      alert("Select workorder no. first");
    }
    
  }

  isOperationRightSection:boolean = false;
  onOperDtlPress(status){
    if(this.psOperNO !=null && this.psOperNO){
    this.isOperationRightSection = status
    this.openRightSection(status)
    
    //here we will need to call a service which will get the Operation Details on the basis of docEntry & OperNo
    this.mo.getOperDetailByDocEntry(this.CompanyDBId,this.docEntry,this.psOperNO).subscribe(
      data=> {
       this.selectedWOOperDetail = data;
       this.showOperDtPopup = true;
      }
    )
  }
  else{
    alert("Select operation no. first");
  }
  }

  isQuantityRightSection:boolean = false;
  onQtyProdBtnPress(status){
    this.isQuantityRightSection = status;
    this.openRightSection(status)
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

  

  // show and hide right content section
  @ViewChild('optirightfixedsection') optirightfixedsection;
  isFixedRightSection: boolean;

  openRightSection(status) {
      this.optirightfixedsection.nativeElement.style.display='block'; //content section
      this.isFixedRightSection = status;
  }

  closeRightSection(status) {
    this.optirightfixedsection.nativeElement.style.display='none';
    this.isFixedRightSection = status;

    this.isQuantityRightSection = status;
    this.isOperationRightSection = status;
    this.isWorkOrderRightSection = status;
  }


}
