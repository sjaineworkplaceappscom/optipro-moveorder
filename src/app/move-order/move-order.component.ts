import { Component, OnInit, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { MoveorderService } from 'src/app/services/moveorder.service';
import { Router } from '@angular/router';
import { LookupComponent } from "src/app/lookup/lookup.component";
//For Ngx Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { UIHelper } from 'src/app/helpers/ui.helpers';
import { QtyWithoutFGScanComponent } from '../qty-without-fgscan/qty-without-fgscan.component';

@Component({
  selector: 'app-move-order',
  templateUrl: './move-order.component.html',
  styleUrls: ['./move-order.component.scss']
})

export class MoveOrderComponent implements OnInit {

  constructor(private mo: MoveorderService, private router: Router, private modalService: BsModalService,private lookupData: LookupComponent) { }

  selectedWODetail: any;
  selectedWOOperDetail: any;
  CompanyDBId: string;
  modelSource: any;
  allWODetails: any;
  allWOOpDetails: any;
  data: any;
  psWONO: string = '';
  psOperNO: string = '';
  psOperName: string = '';
  psProductCode: string = '';
  psProductDesc: string = '';
  docEntry: number;
  showWODtPopup: boolean = false;
  showOperDtPopup: boolean = false;
  showItemLinkingScreen: boolean = false;
  ScreenName: string = '';
  settingOnSAP: string = "1";
  showQtyWithFGScanScreen: boolean = false;
  showQtyNoScanScreen: boolean = false;
  showQtyWithFGRMScanScreen: boolean = false;
  DisableEnablOperation: boolean = true;
  DisableEnablQuantity: boolean = true;
  //variable for Invalid Operation 
  InvalidOperation: boolean
  //variable for Invalid WorkOrder 
  InvalidWorkOrder: boolean
  //variable for WorkOrder Blank 
 // WorkOrderBlank: boolean =false;
  // DisableEnablOperationLookUp:boolean =true;
  bEnabeSaveBtn: boolean = false;
  basicDetails: any = [];
  psItemManagedBy: string;
  showLookup: boolean = false;
  openedLookup: string = '';
  moDetails:any;
  psToOperation:any;
  loggedInUser:any;
  iBalQty:number;
  iProducedQty:number = 0;
  iAcceptedQty:number = 0;
  iRejectedQty:number = 0;
  iNCQty:number = 0;
  iOrderedQty:number = 0;
  public FrmToDateTime = [];
  public invalidStartDate:boolean = false;
  public invalidEndDate:boolean = false;
  maxDateRestriction:any = new Date();
  currentServerDateTime:any;
  //This array string will show the columns given for lookup , if want to displau all the make this array blank
  columnsToShow: Array<string> = [];
  sWorkOrderLookupColumns = "WorkOrder No,Product Id,Start Date,End Date";
  sOperationLookupColumns = "Operation No,Operation Desc,Balance Quantity";

  // public selectedMoments = [
  //   new Date(2018, 1, 12, 10, 30),
  //   new Date(2018, 3, 21, 20, 30)
  // ];

  // show and hide right content section
  @ViewChild('optirightfixedsection') optirightfixedsection;
  //lookup data reciever
  @ViewChild(LookupComponent) child;
  @ViewChild(QtyWithoutFGScanComponent) childSAPSettingForms;
  isFixedRightSection: boolean;
  isWorkOrderRightSection: boolean = false;
  isOperationRightSection: boolean = false;
  isQuantityRightSection: boolean = false;
  isWorkOrderListRightSection: boolean = false;
  isOperationListRightSection: boolean = false;


  gridHeight: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.gridHeight = UIHelper.getMainContentHeight();
  }



  ngOnInit() {

    this.gridHeight = UIHelper.getMainContentHeight();

    this.isFixedRightSection = false;
    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-move-order");
    element.classList.add("opti_account-module");
    //get company name from the session
    this.CompanyDBId = sessionStorage.getItem('selectedComp');
    //get the logged in user name
    this.loggedInUser = sessionStorage.getItem('loggedInUser');
    //On Form Initialization get All WO
    this.getAllWorkOrders();
    //this function will set the time and date of the server
    this.getServerDate();
   
  }

  //This will get all WO
  onWOPress(status) {
    this.columnsToShow = this.sWorkOrderLookupColumns.split(",");
    this.openedLookup = "WOLookup";
    this.isWorkOrderListRightSection = status;
    this.openRightSection(status);

    this.showLookup = true;
    //On Form Initialization get All WO
    this.getAllWorkOrders();

  }

  onOperationPress(status) {
    this.columnsToShow = this.sOperationLookupColumns.split(",");
    this.isOperationListRightSection = status;
    this.openRightSection(status);

    //This funciton will get the operation on docEntry and Work Order no. basis
    this.getOperationByWONO();

    //if(this.psWONO.length > 0){

    // this.mo.getOperationByWorkOrder(this.CompanyDBId,this.docEntry,this.psWONO).subscribe(
    //     data=> {
    //      this.allWOOpDetails = data;
    //      if(this.allWOOpDetails.length > 0){
    //       this.psOperNO = this.allWOOpDetails[0].U_O_OPERNO
    //      }
    //     }
    //   )


    // }
    // else{
    //   alert("Select workorder no. first");
    // }
  }

  //This function will check, if the user entered WO is in the array
  onWorkOrderBlur() {

    if (this.allWODetails != null &&
      this.allWODetails.length > 0 &&
      this.psWONO.length > 0) {
      this.DisableEnablOperation = false;
      //To check in the array
      let isWOExists = this.allWODetails.some(e => e.U_O_ORDRNO === this.psWONO);
      if (isWOExists == false) {
        //alert("Invalid workorder no. selection");
        //Message for Invalid WorkOdere
        this.InvalidWorkOrder = true;
        this.psWONO = '';
        this.DisableEnablOperation = true;
        // this.DisableEnablOperationLookUp=true;
      }
      else {
        this.DisableEnablOperation = false;
        //remove the Message if Workorder is not Blank 
        this.InvalidWorkOrder = false;
        //this.DisableEnablOperationLookUp=false;
        this.getOperationByWONO();

      }
    }
    else {
      this.DisableEnablOperation = true;
      //this.DisableEnablOperationLookUp=true;
    }

  }


  onWorkOrderDetail(status) {
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



  onOperDtlPress(status) {
    // if(this.psOperNO !=null && this.psOperNO){
    this.isOperationRightSection = status
    this.openRightSection(status)

    //Get Operation Details of the seleceted operation
    this.getSelectedOperationDetail();
    // }
    // else{
    //   alert("Select operation no. first");
    // }
  }

  //If user puts manual entry for operation then this fun will check whether oper is valid
  onOperationNoBlur() {
    if (this.allWOOpDetails != null && this.allWOOpDetails.length > 0) {
      //Enable the Produced Quantity Input 
      this.DisableEnablQuantity = false;
      //To check in the array
      let isWOOperExists = this.allWOOpDetails.some(e => e.U_O_OPERNO === this.psOperNO);
      if (isWOOperExists == false) {
        //message for invalid Operation
        this.InvalidOperation = true;
        this.psOperNO = '';
        //disable the Produced Quantity Field
        this.DisableEnablQuantity = true;
      }
      else {
        //Enable the Produced Quantity 
        this.DisableEnablQuantity = false;
        //message for invalid operation 
        this.InvalidOperation = false;

        this.getSelectedOperationDetail()

      }
    }
    else {
      //Disable the Produced Quantity 
      this.DisableEnablQuantity = true;

    }
  }

  onQtyProdBtnPress(status) {
    this.isQuantityRightSection = status;
    this.openRightSection(status)
    //Setting basic details to share on another screen
    this.basicDetails.push({ 'WorkOrderNo': this.psWONO, 'OperNo': this.psOperNO, 'ItemCode': this.psProductCode, 'ManagedBy': this.psItemManagedBy , 'BalQty': this.iBalQty, 'ProducedQty': this.iProducedQty});
    this.showItemLinkingScreen = true;
    if (this.settingOnSAP == "1") {
      this.ScreenName = 'Move Order Summary';
      this.showQtyNoScanScreen = true;
    }
    if (this.settingOnSAP == "2") {
      this.ScreenName = 'Finished Goods Scan';
      this.showQtyWithFGScanScreen = true;
    }
    if (this.settingOnSAP == "3") {
      this.ScreenName = 'Finished Goods & Raw Materials Scan';
      this.showQtyWithFGRMScanScreen = true;
    }

  }

  //Final submission for Move Order will be done by this function
  onSubmitPress() {
    //If oper is blank
    if(this.psToOperation == '' || this.psToOperation == 0 || this.psToOperation == undefined){
      this.psToOperation = this.psOperNO;
    }


    //If oper is blank
    if(this.psToOperation == '' || this.psToOperation == 0 || this.psToOperation == undefined){
      this.psToOperation = this.psOperNO;
    }
    //submission service callled
    this.mo.submitMoveOrder(this.CompanyDBId,this.psOperNO,this.psToOperation,this.psWONO,this.psProductCode,this.loggedInUser,this.iAcceptedQty,this.iRejectedQty,this.iNCQty,this.iOrderedQty,this.iProducedQty,this.FrmToDateTime).subscribe(
      data => {
        if(data == "True"){
            alert("Record submitted sucessfully");
            this.cleanupScreen();
        }
        else{
          alert("There was some error while submitting the record");
        }
      }
    )
  }

  //This will recive data from lookup
  receiveLookupRowData($event) {
    console.log("---> DAATA FROM WO LOOKUP");
    console.log($event);
    if (this.openedLookup == "WOLookup") {
      this.psWONO = $event.U_O_ORDRNO;
      this.psProductCode = $event.U_O_PRODID;
      this.psProductDesc = $event.ItemName;
      this.docEntry = $event.DocEntry;
      this.iOrderedQty = $event.U_O_ORDRQTY;

      //Validation when we want to Disable the Operation and Quantity if he Workorder is Not Selected 
      if (this.psWONO != "" || this.psWONO != null || this.psWONO != undefined) {
        //enable  Operation input Box
        this.DisableEnablOperation = false;
        this.getOperationByWONO();
        //this.DisableEnablOperationLookUp=false;
      }
      else {
        //disable the Operation input Box
        this.DisableEnablOperation = true;
        //  this.DisableEnablOperationLookUp=true;
      }

    }

    if (this.openedLookup == "OperLookup") {
      this.psOperNO = $event.U_O_OPERNO;
      this.getSelectedOperationDetail();
      //Validation when we want to Disable the Operation and Quantity if he Workorder is Not Selected 
      if (this.psOperNO != "" || this.psOperNO != null || this.psOperNO != undefined) {
        //enable  Operation input Box
        this.DisableEnablQuantity = false;
        this.InvalidOperation=false;
      }
      else {
        //disable the Operation input Box
        this.DisableEnablQuantity = true;
        this.InvalidOperation=true;
      }

    }
    //To hide the lookup
    this.showLookup = false;

    //close the right section
    this.closeRightSection(false);

    //To clear the lookup screen name on close
    this.openedLookup = '';

    //Clear the data of lookup
    this.lookupData = null;

    //To clear the columns name 
    this.columnsToShow = [];
  }

  //This emitter event will send the data back to the main form
  recieveChildSAPSetFormData($event){ 
   
    console.log("FROM CHILD SCREENSSSS--->");
    console.log($event);
    if(this.settingOnSAP == "1"){
      this.iAcceptedQty = $event.AcceptedQty;
      this.iRejectedQty = $event.RejectedQty;
      this.iNCQty = $event.NCQty;
    }
  
  }

  //on ProdQty Blur
  onProducedQtyBlur(){
    if(this.iProducedQty != null){
      if(this.iProducedQty > this.iBalQty ){
        alert("Produced Qty should not be greater than balance qty");
        this.iProducedQty = 0;
      }
      else{
        this.iAcceptedQty = this.iProducedQty;
        this.iNCQty =0;
        this.iRejectedQty = 0;
      }
    }
  }

  
  //Core Functions
  //This will filter for filter WO
  filterWODetail(data, docEntry) {
    return data.filter(e => e.DocEntry == docEntry)
  }

  //This will filter Oper No
  filterOperDetail(data, operNo, docEntry) {
    return data.filter(e => e.U_O_OPERNO == operNo && e.DocEntry == docEntry)
  }

  //This fun will get all WO
  getAllWorkOrders() {
    this.mo.getAllWorkOrders(this.CompanyDBId).subscribe(
      data => {
        this.allWODetails = data;
        if (this.allWODetails.length > 0) {
          this.lookupData = this.allWODetails;
         // this.WorkOrderBlank=false;
        }
      }
    )
  }

  //get Operations by work order no.
  getOperationByWONO() {
    if (this.psWONO == "") {
    //  this.WorkOrderBlank = true;
      return;
    }
     else {
   // this.WorkOrderBlank = false;
    }

    
    this.mo.getOperationByWorkOrder(this.CompanyDBId, this.docEntry, this.psWONO).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.allWOOpDetails = data;
          if (this.allWOOpDetails.length > 0) {
            this.lookupData = this.allWOOpDetails;
            this.openedLookup = "OperLookup";
            this.showLookup = true;
          }
        }
      }
    )
  }


  //This will get the selected Operation's
  getSelectedOperationDetail(){
  //here we will need to call a service which will get the Operation Details on the basis of docEntry & OperNo
  this.mo.getOperDetailByDocEntry(this.CompanyDBId, this.docEntry, this.psOperNO).subscribe(
    data => {
      this.selectedWOOperDetail = data;
      this.showOperDtPopup = true;
      this.psToOperation = data[0].NextOperNo;
      this.iBalQty = data[0].U_O_BALQTY;
      //By default set into it
      this.iProducedQty =  data[0].U_O_BALQTY;
      this.iAcceptedQty =  data[0].U_O_BALQTY;
    }
  ) 
  }

  openRightSection(status) {
    this.optirightfixedsection.nativeElement.style.display = 'block'; //content section
    this.isFixedRightSection = status;
  }

  closeRightSection(status) {
    this.optirightfixedsection.nativeElement.style.display = 'none';
    this.isFixedRightSection = status;

    this.isQuantityRightSection = status;
    this.isOperationRightSection = status;
    this.isWorkOrderRightSection = status;
    this.isWorkOrderListRightSection = status;
    this.isOperationListRightSection = status;
  }

  //This function will make the screen reset
  cleanupScreen(){
    this.psWONO = '';
    this.psItemManagedBy ='';
    this.psOperName ='';
    this.psOperNO='';
    this.psProductCode='';
    this.psProductDesc='';
    this.iAcceptedQty=0;
    this.iBalQty=0;
    this.iNCQty=0;
    this.iOrderedQty=0;
    this.iProducedQty = 0;
    this.iRejectedQty =0;
    this.FrmToDateTime=[];
  }

  //This will set the time and date
  setDefaultDateTime(){
    
  if(this.currentServerDateTime != null && this.currentServerDateTime.length > 0){
    let currentDateTime = new Date(this.currentServerDateTime);
    this.FrmToDateTime = [
      new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes()),
      new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes())
    ];

  }
  }

  //This will get the server date time
  getServerDate(){
    //here we will need to call a service which will get the Server Date Time
    this.mo.getServerDate(this.CompanyDBId).subscribe(
      data => {
            this.currentServerDateTime = data[0].DATEANDTIME;
            this.setDefaultDateTime();
      }
    ) 
    }

    //check for the mandatory inputs on submit
    checkMandatoryInpts(){

      return false;
    }
}
