import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MoveorderService } from 'src/app/services/moveorder.service';
import { Router } from '@angular/router';
//For Ngx Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-move-order',
  templateUrl: './move-order.component.html',
  styleUrls: ['./move-order.component.scss']
})

export class MoveOrderComponent implements OnInit {
  
  constructor(private mo:MoveorderService,private router:Router, private modalService: BsModalService) { }
  
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
  psProductDesc:string = '';
  docEntry:number;
  showWODtPopup:boolean = false;
  showOperDtPopup:boolean = false;
  showItemLinkingScreen:boolean = false;
  ScreenName:string = '';
  settingOnSAP:string="3";
  showQtyWithFGScanScreen:boolean=false;
  showQtyNoScanScreen:boolean = false;
  showQtyWithFGRMScanScreen:boolean = false;
  bEnabeSaveBtn:boolean = false;
  basicDetails:any = [];
  psItemManagedBy:string;
  showLookup:boolean = false;

  public selectedMoments = [
    new Date(2018, 1, 12, 10, 30),
    new Date(2018, 3, 21, 20, 30)
];
  
 // show and hide right content section
 @ViewChild('optirightfixedsection') optirightfixedsection;
 isFixedRightSection: boolean;
 isWorkOrderRightSection:boolean = false;
 isOperationRightSection:boolean = false;
 isQuantityRightSection:boolean = false;
 isWorkOrderListRightSection:boolean = false;
 isOperationListRightSection:boolean = false;

  ngOnInit() {
    this.isFixedRightSection = false;
    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-move-order");
    element.classList.add("opti_account-module");
    //get company name from the session
    this.CompanyDBId = sessionStorage.getItem('selectedComp');
    //On Form Initialization get All WO
    this.getAllWorkOrders();
  }

  //This will get all WO
  onWOPress(status){

    this.isWorkOrderListRightSection = status;
    this.openRightSection(status);

    this.showLookup = true;
    //On Form Initialization get All WO
    // this.getAllWorkOrders();
    this.mo.getAllWorkOrders(this.CompanyDBId).subscribe(
      data=> {
       this.allWODetails = data;
       if(this.allWODetails.length > 0){
          this.psWONO = this.allWODetails[38].U_O_ORDRNO
          this.psProductDesc = this.allWODetails[38].ItemName
          this.docEntry = this.allWODetails[38].DocEntry
          this.psItemManagedBy = this.allWODetails[38].ManagedBy
       }
      }
    )
  }

  onOperationPress(status){

    this.isOperationListRightSection = status;
    this.openRightSection(status);

    //if(this.psWONO.length > 0){
     
    this.mo.getOperationByWorkOrder(this.CompanyDBId,this.docEntry,this.psWONO).subscribe(
        data=> {
         this.allWOOpDetails = data;
         if(this.allWOOpDetails.length > 0){
          this.psOperNO = this.allWOOpDetails[0].U_O_OPERNO
         }
        }
      )

    //This funciton will get the operation on docEntry and Work Order no. basis
    //this.getOperationByWONO();


      // }
    // else{
    //   alert("Select workorder no. first");
    // }
  }

  //This function will check, if the user entered WO is in the array
  onWorkOrderBlur(){
   
    if(this.allWODetails != null && 
      this.allWODetails.length > 0 &&
      this.psWONO.length > 0){
      //To check in the array
      let isWOExists = this.allWODetails.some(e => e.U_O_ORDRNO === this.psWONO);
      if(isWOExists == false){
        alert("Invalid workorder no. selection");
        this.psWONO = '';
      }
      else{
        this.getOperationByWONO();
      }
    }
    
  }

  
  onWorkOrderDetail(status){
    //if(this.psWONO !=null && this.psWONO){
      this.showWODtPopup = true;
      this.isWorkOrderRightSection = status;
      this.openRightSection(status);
      this.selectedWODetail = this.filterWODetail(this.allWODetails, this.docEntry);
    // }
    // else{
    //   alert("Select workorder no. first");
    // }
    
  }
  

  
  onOperDtlPress(status){
   // if(this.psOperNO !=null && this.psOperNO){
    this.isOperationRightSection = status
    this.openRightSection(status)
    
    //here we will need to call a service which will get the Operation Details on the basis of docEntry & OperNo
    this.mo.getOperDetailByDocEntry(this.CompanyDBId,this.docEntry,this.psOperNO).subscribe(
      data=> {
       this.selectedWOOperDetail = data;
       this.showOperDtPopup = true;
      }
    )
  // }
  // else{
  //   alert("Select operation no. first");
  // }
  }

  //If user puts manual entry for operation then this fun will check whether oper is valid
  onOperationNoBlur(){
      if(this.allWOOpDetails != null && this.allWOOpDetails.length > 0){
         //To check in the array
      let isWOOperExists = this.allWOOpDetails.some(e => e.U_O_OPERNO === this.psOperNO);
      if(isWOOperExists == false){
        alert("Invalid operation no. selection");
        this.psOperNO = '';
      }
      }
  }

  
  onQtyProdBtnPress(status){
    this.isQuantityRightSection = status;
    this.openRightSection(status)
    //Setting basic details to share on another screen
    this.basicDetails.push({'WorkOrderNo':this.psWONO,'OperNo':this.psOperNO,'ItemCode':this.psProductCode,'ManagedBy': this.psItemManagedBy});
    this.showItemLinkingScreen = true; 
    if(this.settingOnSAP == "1"){
      this.ScreenName = 'Move Order Summary';
      this.showQtyNoScanScreen = true;
    }
    if(this.settingOnSAP =="2"){
      this.ScreenName = 'Finished Goods Scan';
      this.showQtyWithFGScanScreen = true;
    }
    if(this.settingOnSAP == "3"){
      this.ScreenName = 'Finished Goods & Raw Materials Scan';
      this.showQtyWithFGRMScanScreen = true;
    }
    
  }

  //Final submission for Move Order will be done by this function
  onSubmitPress(){
    //submission service callled
    this.mo.submitMoveOrder(this.CompanyDBId).subscribe(
      data=> {
      }
    )
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

  getAllWorkOrders(){
    this.mo.getAllWorkOrders(this.CompanyDBId).subscribe(
      data=> {
       this.allWODetails = data;
       if(this.allWODetails.length > 0){
          // this.psWONO = this.allWODetails[38].U_O_ORDRNO
          // this.psProductCode = this.allWODetails[38].U_O_PRODID
          // this.psProductDesc = this.allWODetails[38].ItemName
          // this.docEntry = this.allWODetails[38].DocEntry
          // this.psItemManagedBy = this.allWODetails[38].ManagedBy
       }
      }
    )
  }

  //get Operations by work order no.
  getOperationByWONO(){
    this.mo.getOperationByWorkOrder(this.CompanyDBId,this.docEntry,this.psWONO).subscribe(
      data=> {
      if(this.data !=null && this.data.length > 0){
        this.allWOOpDetails = data;
        }
      }
    )
  }
  

 

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
    this.isWorkOrderListRightSection = status;
    this.isOperationListRightSection = status;
  }


  WorkOrderDetailDataList = [
    {
      "startDate": '2/12/2018, 10:30 AM',
      "endDate": '2/12/2018, 10:30 AM',
      "so": 1,
      "customer": 'Prashant',
      "product": 'mobile'
    },
    {
      "startDate": '2/12/2018, 10:30 AM',
      "endDate": '2/12/2018, 10:30 AM',
      "so": 1,
      "customer": 'Ankit',
      "product": 'mobile'
    },
    {
      "startDate": '2/12/2018, 10:30 AM',
      "endDate": '2/12/2018, 10:30 AM',
      "so": 1,
      "customer": 'Dheeraj',
      "product": 'mobile'
    },
    {
      "startDate": '2/12/2018, 10:30 AM',
      "endDate": '2/12/2018, 10:30 AM',
      "so": 1,
      "customer": 'Ankur',
      "product": 'mobile'
    },
    {
      "startDate": '2/12/2018, 10:30 AM',
      "endDate": '2/12/2018, 10:30 AM',
      "so": 1,
      "customer": 'Arjun',
      "product": 'mobile'
    },
    {
      "startDate": '2/12/2018, 10:30 AM',
      "endDate": '2/12/2018, 10:30 AM',
      "so": 1,
      "customer": 'Shashank',
      "product": 'mobile'
    },
    {
      "startDate": '2/12/2018, 10:30 AM',
      "endDate": '2/12/2018, 10:30 AM',
      "so": 1,
      "customer": 'Ronak',
      "product": 'mobile'
    },
    {
      "startDate": '2/12/2018, 10:30 AM',
      "endDate": '2/12/2018, 10:30 AM',
      "so": 1,
      "customer": 'Harry',
      "product": 'mobile'
    }
  ]

  public WorkOrderDetailData: any[] = this.WorkOrderDetailDataList;



}
