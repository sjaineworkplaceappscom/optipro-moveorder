import { Component, OnInit, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { MoveorderService } from 'src/app/services/moveorder.service';
import { Router } from '@angular/router';
import { LookupComponent } from "src/app/lookup/lookup.component";
//For Ngx Bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { UIHelper } from 'src/app/helpers/ui.helpers';
import { QtyWithoutFGScanComponent } from '../qty-without-fgscan/qty-without-fgscan.component';
import { BaseClass } from 'src/app/classes/BaseClass'
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';
import { FgrmscanparentinputformService } from 'src/app/services/fgrmscanparentinputform.service';

@Component({
  selector: 'app-move-order',
  templateUrl: './move-order.component.html',
  styleUrls: ['./move-order.component.scss']
})

export class MoveOrderComponent implements OnInit {

  constructor(private mo: MoveorderService, private router: Router, private modalService: BsModalService, private lookupData: LookupComponent, private commonService: CommonService, private toastr: ToastrService,private fgrmService: FgrmscanparentinputformService) { }
  showWOLookup: boolean = false;
  showOperLookup: boolean = false;

  selectedWODetail: any;
  selectedWOOperDetail: any;
  CompanyDBId: string;
  modelSource: any;
  allWODetails: any;
  allWOOpDetails: any;
  data: any;
  psWONO: string = '';
  psOperNO: any = '';
  psOperName: string = '';
  psProductCode: string = '';
  psProductDesc: string = '';
  docEntry: number;
  showWODtPopup: boolean = false;
  showOperDtPopup: boolean = false;
  showItemLinkingScreen: boolean = false;
  ScreenName: string = '';
  settingOnSAP: string = "";
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
  bEnabeSaveBtn: boolean = false;
  basicDetails: any = [];
  psItemManagedBy: string;
  //showLookup: boolean = false;
  openedLookup: string = '';
  moDetails: any;
  psToOperation: any;
  loggedInUser: any;
  warehouseName: any;
  iBalQty: number;
  iProducedQty: number = 0;
  iAcceptedQty: number = 0;
  iRejectedQty: number = 0;
  iNCQty: number = 0;
  iOrderedQty: number = 0;
  public FrmToDateTime = [];
  public invalidStartDate: boolean = false;
  public invalidEndDate: boolean = false;
  public showLoader: boolean = false;
  maxDateRestriction: any = new Date();
  currentServerDateTime: any;
  WorkOrderImageStatus: boolean = false;
  OperationDetailImageStatus: boolean = false;
  GetOperationImageStatus: Boolean = false;
  QuantityImageStatus: Boolean = false;
  NoOperAvailable: boolean = false;
  bAllowToSubmit = true;
  psPreOperation: any;
  IsMoveOrderTimeMandatory: any;
  public isCustomizedFor: any;
  public isCustEnabled: any;
  public isUserIsSubcontracter: any = "False";
  public restrictedDate = new Date().getDate();
  public IsSetupOrTDOper: boolean = false;
  public SaveFGData = {};
  //public ApplyGeneology: boolean = false;

  private baseClassObj = new BaseClass();

  //public loginBackground = this.baseClassObj.get_current_url() + "/assets/images/signup/nouse/shutter/body-bg-new-1.jpg";
  public loginBackground = "./assets/images/signup/nouse/shutter/body-bg-new-1.jpg";
  //This array string will show the columns given for lookup , if want to displau all the make this array blank
  columnsToShow: Array<string> = [];
  sWorkOrderLookupColumns = "WorkOrder No,Product Id,Start Date,End Date";
  sOperationLookupColumns = "Operation No,Operation Desc,Balance Quantity";

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
  public parent: string = "wo"
  public selectedLookUpData: any;

  public language: any;

  public oprLookupData: any = [];
  public WoLookupData: any = [];
  public ItemTrack : any;

  gridHeight: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.gridHeight = UIHelper.getMainContentHeight();
  }

  ngOnInit() {

    this.language = JSON.parse(window.localStorage.getItem('language'));

    if (window.localStorage.getItem('loggedInUser') == null ||
     window.localStorage.getItem('loggedInUser') == "null") {
     this.router.navigateByUrl('/login');
   }

   this.mo.updateHeader();

    //This will check if login is valid
    this.checkIfLoginIsValid();

    this.gridHeight = UIHelper.getMainContentHeight();

    this.isFixedRightSection = false;
    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-move-order");
    element.classList.add("opti_account-module");  

    this.commonService.commonData$.subscribe(
      data => {
        if (data == null || data == undefined) {
          return;
        }
        this.selectedLookUpData = data.value;
        console.log('opend lookup-', this.openedLookup);

        //if (this.openedLookup == "WOLookup") {
        if (data.from == "WO") {
          //this.cleanupScreen();

          //here we will clear values
          this.clearScreenAfterLookup();
          this.psWONO = this.selectedLookUpData.U_O_ORDRNO;
          this.psProductCode = this.selectedLookUpData.U_O_PRODID;
          this.psProductDesc = this.selectedLookUpData.ItemName;
          this.docEntry = this.selectedLookUpData.DocEntry;
          this.iOrderedQty = this.selectedLookUpData.U_O_ORDRQTY;
          this.psItemManagedBy = this.selectedLookUpData.ManagedBy;
          this.ItemTrack = this.selectedLookUpData.ManagedBy;
          window.localStorage.setItem('ManagedBy',this.psItemManagedBy);

          console.log("WO-", this.psWONO);
          //Validation when we want to Disable the Operation and Quantity if he Workorder is Not Selected 
          if (this.psWONO != "" && this.psWONO != null && this.psWONO != undefined) {
            //enable  Operation input Box
            this.DisableEnablOperation = false;
            this.getOperationByWONO();
            this.showLoader = false;
          }
          else {
            //disable the Operation input Box
            this.DisableEnablOperation = true;
          }

        }

        //if (this.openedLookup == "OperLookup") {
        if (data.from == "OPER") {
          this.psOperNO = this.selectedLookUpData.U_O_OPERNO;
          this.getSelectedOperationDetail();
          //Validation when we want to Disable the Operation and Quantity if he Workorder is Not Selected 
          if (this.psOperNO != "" && this.psOperNO != null && this.psOperNO != undefined) {
            //enable  Operation input Box
            this.DisableEnablQuantity = false;
            this.InvalidOperation = false;
          }
          else {
            //disable the Operation input Box
            this.DisableEnablQuantity = true;
            this.InvalidOperation = true;
          }
        }
        //To hide the lookup
        //this.showLookup = false;
        this.showWOLookup = false;
        this.showOperLookup = false;
        this.parent = "";

        //close the right section
        this.closeRightSection(false);

        //To clear the lookup screen name on close
        this.openedLookup = '';

        //Clear the data of lookup
        this.lookupData = null;

        //To clear the columns name 
        this.columnsToShow = [];
      }
    );

    //get company name from session
    this.CompanyDBId = window.localStorage.getItem('selectedComp');
    //get the logged in user name from session
    this.loggedInUser = window.localStorage.getItem('loggedInUser');
    //get Whse name from session
    this.warehouseName = window.localStorage.getItem('selectedWhse');


    //Get Settingsfrom DB for Option Screens
    this.getSettingOnSAP();

    //On Form Initialization get All WO
    //this.getAllWorkOrders("init");

    //this.getServerDate();
    this.setDefaultDateTime();

  }


  //This will get all WO
  onWOPress(status) {

    //this.showQtyNoScanScreen=this.showQtyWithFGScanScreen=this.showQtyWithFGRMScanScreen=false;
   
    this.showLoader = true;
    this.columnsToShow = this.sWorkOrderLookupColumns.split(",");
    this.openedLookup = "WOLookup";
    this.isWorkOrderListRightSection = status;
    this.isQuantityRightSection = false;

    //this.openRightSection(status);

    //this.showLookup = true;

    //this.lookupData = this.allWODetails;
    this.getAllWorkOrders("lookup");
    this.WoLookupData = this.allWODetails;

    this.openRightSection(status);

    this.showOperLookup = false;
    this.showWOLookup = true;
    this.parent = "wo";

  }

  onOperationPress(status, GetOperationImageStatus) {
    this.openedLookup = "OperLookup";
    this.showLoader = true;
    //this.showQtyNoScanScreen=this.showQtyWithFGScanScreen=this.showQtyWithFGRMScanScreen=false;
    if (this.psWONO == "" || this.psWONO == null || this.psWONO == undefined || this.NoOperAvailable == true) {

      GetOperationImageStatus = false;
    }
    else {
      this.oprLookupData = this.allWOOpDetails;
      GetOperationImageStatus = true;
    }
    if (GetOperationImageStatus == true) {
      this.columnsToShow = this.sOperationLookupColumns.split(",");
      this.isOperationListRightSection = status;
      this.openRightSection(status);
      this.showOperLookup = true;
      this.showWOLookup = false;
      this.parent = "opr";
    }
    this.showLoader = false;
  }

  //This function will check, if the user entered WO is in the array
  onWorkOrderBlur() {
    var inputValue = (<HTMLInputElement>document.getElementById('psWONOid')).value;
    if (inputValue.length > 0) {
      this.psWONO = inputValue;
    }

    if (this.allWODetails != null &&
      this.allWODetails.length > 0 &&
      this.psWONO.length > 0) {
      this.DisableEnablOperation = false;
      //To check in the array
      let isWOExists = this.allWODetails.some(e => e.U_O_ORDRNO === this.psWONO);
      if (isWOExists == false) {

        this.getAllWorkOrders("change");

        //Message for Invalid WorkOdere
        // this.InvalidWorkOrder = true;
        // this.psWONO = '';
        // this.DisableEnablOperation = true;
      }
      else {
        for (var i = 0; i < this.allWODetails.length; i++) {
          if (this.allWODetails[i].U_O_ORDRNO == this.psWONO) {
            this.docEntry = this.allWODetails[i].DocEntry;
            this.psProductCode = this.allWODetails[i].U_O_PRODID;
            this.psProductDesc = this.allWODetails[i].ItemName;
            this.iOrderedQty = this.allWODetails[i].U_O_ORDRQTY;
            this.psItemManagedBy = this.allWODetails[i].ManagedBy;
            window.localStorage.setItem('ManagedBy',this.psItemManagedBy);
          }
        }

        this.DisableEnablOperation = false;
        //remove the Message if Workorder is not Blank 
        this.InvalidWorkOrder = false;
        this.getOperationByWONO();
      }
    }
    else {
      this.DisableEnablOperation = true;
      this.cleanupScreen();
    }

  }

  //On Work Order Detal Press event
  onWorkOrderDetail(status, WorkOrderImageStatus) {
    if (this.psWONO == "" || this.psWONO == null || this.psWONO == undefined) {
      WorkOrderImageStatus = false;
    }
    else {
      WorkOrderImageStatus = true;
    }
    if (WorkOrderImageStatus == true) {
      this.showWODtPopup = true;
      this.isWorkOrderRightSection = status;
      this.openRightSection(status);
      this.selectedWODetail = this.filterWODetail(this.allWODetails, this.docEntry);
    }
  }


  //On Operation Detal Press event
  onOperDtlPress(status, OperationDetailImageStatus) {

    if (this.psOperNO == "" || this.psOperNO == null || this.psOperNO == undefined) {
      OperationDetailImageStatus = false;
    }
    else {
      OperationDetailImageStatus = true;
    }
    if (OperationDetailImageStatus == true) {
      this.isOperationRightSection = status
      this.openRightSection(status)
      this.getSelectedOperationDetail();

    }
  }

  //If user puts manual entry for operation then this fun will check whether oper is valid
  onOperationNoBlur() {
    var inputValue = (<HTMLInputElement>document.getElementById('psOperNOid')).value;
    if (inputValue.length > 0) {
      this.psOperNO = Number(inputValue);
    }

    if (this.allWOOpDetails != null && this.allWOOpDetails.length > 0) {
      //Enable the Produced Quantity Input 
      this.DisableEnablQuantity = false;
      //To check in the array
      let isWOOperExists = this.allWOOpDetails.some(e => e.U_O_OPERNO == this.psOperNO);
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
  //  if (this.settingOnSAP != "1" && this.psItemManagedBy == "None") {
  //    this.toastr.error('', "Not allowed to add/modify attached items for none tracked finished goods", this.baseClassObj.messageConfig);
  //    return;
  //  }

    //This function will get to know whthere it is necessary to attach Batch/Serials on current operation

    if ((this.settingOnSAP == "2" || this.settingOnSAP == "3") && this.psItemManagedBy != "None" && !this.IsSetupOrTDOper) {
      //this.checkIfOperRequiresMaterial(status);
      //bug fixed by Ashish
      this.openRespectiveScreen(status);
    }
    else{
      this.openRespectiveScreen(status);
    }
  }

  checkChild(){
    if(this.settingOnSAP == '3' && !this.IsSetupOrTDOper){
      let temp = window.localStorage.getItem('SaveFGData');
      if(temp == undefined || temp == null){
        this.toastr.warning('',this.language.attach_bat_ser, this.baseClassObj.messageConfig);
        return;
      }
    }
  }

  //Final submission for Move Order will be done by this function
  onSubmitPress() {
    this.showLoader = true;
    if (this.checkMandatoryInpts() == true) {

      if ((this.settingOnSAP == "2" || this.settingOnSAP == "3") && this.psItemManagedBy != "None" && !this.IsSetupOrTDOper) {
        //First we will chk whether the user have linked FG serials/batch for option 2 screen
        //this.GetBatchSerialLinking()
        this.checkChild()
        this.getServerDate(false);
      }
      else {
        this.getServerDate(false);
        //submission service callled
        //this.submitMoveOrder(false);
      }
    }
    else {
      this.showLoader = false;
    }
  }

  //This will recive data from lookup
  receiveLookupRowData($event) {

    if (this.openedLookup == "WOLookup") {
      //this.cleanupScreen();

      //here we will clear values
      this.clearScreenAfterLookup();

      this.psWONO = $event.U_O_ORDRNO;
      this.psProductCode = $event.U_O_PRODID;
      this.psProductDesc = $event.ItemName;
      this.docEntry = $event.DocEntry;
      this.iOrderedQty = $event.U_O_ORDRQTY;
      this.psItemManagedBy = $event.ManagedBy;

      //Validation when we want to Disable the Operation and Quantity if he Workorder is Not Selected 
      if (this.psWONO != "" && this.psWONO != null && this.psWONO != undefined) {
        //enable  Operation input Box
        this.DisableEnablOperation = false;
        this.getOperationByWONO();
      }
      else {
        //disable the Operation input Box
        this.DisableEnablOperation = true;
      }

    }

    if (this.openedLookup == "OperLookup") {
      //this.psOperNO = $event.U_O_OPERNO;
      this.getSelectedOperationDetail();
      //Validation when we want to Disable the Operation and Quantity if he Workorder is Not Selected 
      if (this.psOperNO != "" && this.psOperNO != null && this.psOperNO != undefined) {
        //enable  Operation input Box
        this.DisableEnablQuantity = false;
        this.InvalidOperation = false;
      }
      else {
        //disable the Operation input Box
        this.DisableEnablQuantity = true;
        this.InvalidOperation = true;
      }

    }
    //To hide the lookup
    //this.showLookup = false;
    this.showWOLookup = false;
    this.showOperLookup = false;
    this.parent = "";

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
  recieveChildSAPSetFormData($event) {

    console.log("FROM CHILD SCREENSSSS--->");
    console.log($event);
    if (this.settingOnSAP == "1" || this.psItemManagedBy == "None" || this.IsSetupOrTDOper) {
      this.iAcceptedQty = $event.AcceptedQty;
      this.iRejectedQty = $event.RejectedQty;      
      this.iNCQty = $event.NCQty;
      this.iProducedQty = $event.AcceptedQty + $event.RejectedQty + $event.NCQty;
    }
   else if (this.settingOnSAP == "2" && this.psItemManagedBy != "None") {
      this.iAcceptedQty = $event.AcceptedQty;
      this.iRejectedQty = $event.RejectedQty;
      this.iNCQty = $event.NCQty;
      this.iProducedQty = $event.ProducedQty;
      this.showQtyWithFGScanScreen = false;
    }
    else if (this.settingOnSAP == "3" && this.psItemManagedBy != "None") {
      this.iAcceptedQty = $event.AcceptedQty;
      this.iRejectedQty = $event.RejectedQty;
      this.iNCQty = $event.NCQty;
      this.iProducedQty = $event.ProducedQty;
      this.showQtyWithFGRMScanScreen = false;
    }

  }

  //on ProdQty Blur
  onProducedQtyBlur() {
    if (this.iProducedQty != null) {
      if (this.iProducedQty > this.iBalQty) {
        this.toastr.error('', this.language.prod_qty_greater_than_bal, this.baseClassObj.messageConfig);
        this.iProducedQty = 0;
      }
      else {
        this.iAcceptedQty = this.iProducedQty;
        this.iNCQty = 0;
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
  getAllWorkOrders(fromEvent) {

    //Show Loader
    this.showLoader = true;
    this.mo.getAllWorkOrders(this.CompanyDBId, this.warehouseName).subscribe(
      data => {
      
        if (data != undefined && data != null) {
          if (data.length > 0) {
            if (data[0].ErrMessage != undefined) {
             // this.toastr.error('', this.language.session_expired, this.baseClassObj.messageConfig);
              this.commonService.RemoveLoggedInUser(this.language.session_expired);
              return;
            }
            
            switch(this.isCustomizedFor){
            case this.baseClassObj.ellyza_london: 
              this.allWODetails = data;
              break;
            
            case this.baseClassObj.dacsa: 
              this.allWODetails = data;
              break;

            default:
              this.allWODetails = data;
              break;
            }
            if (this.allWODetails.length > 0) {
              this.lookupData = this.allWODetails;
              this.WoLookupData = this.allWODetails;

              //JSON
              if (fromEvent == "change") {
                let isWOExists = this.allWODetails.some(e => e.U_O_ORDRNO === this.psWONO);
                if (isWOExists == false) {
                  //Message for Invalid WorkOdere
                  this.InvalidWorkOrder = true;
                  this.psWONO = '';
                  this.DisableEnablOperation = true;
                }
                else {
                  this.lookupData = this.allWODetails;
                  this.WoLookupData = this.allWODetails;

                  for (var i = 0; i < this.allWODetails.length; i++) {
                    if (this.allWODetails[i].U_O_ORDRNO == this.psWONO) {
                      this.docEntry = this.allWODetails[i].DocEntry;
                      this.psProductCode = this.allWODetails[i].U_O_PRODID;
                      this.psProductDesc = this.allWODetails[i].ItemName;
                      this.iOrderedQty = this.allWODetails[i].U_O_ORDRQTY;
                      this.psItemManagedBy = this.allWODetails[i].ManagedBy;
                    }
                  }

                  this.DisableEnablOperation = false;
                  //remove the Message if Workorder is not Blank 
                  this.InvalidWorkOrder = false;
                  this.getOperationByWONO();
                }

              }
              else {
                this.InvalidWorkOrder = false;
                this.showLoader = false;
              }
              this.showLoader = false;
            }
          }
          else {
            this.allWODetails = data;
            this.showLoader = false;
          }
        }
        else {
          //Hide Loader
          this.showLoader = false;
        }
      },
      error => {
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }               
      }
    )
  }

  // checkGeneologyOnItemExtn(){

  //   this.mo.checkGeneologyOnItemExtn(this.CompanyDBId, this.psProductCode).subscribe(
  //     data => {
  //       if(data == true){
  //         this.ApplyGeneology = true;          
  //       }
  //       else {
  //         this.ApplyGeneology = false;
  //       }
  //       this.showLoader = false;
  //     })

  // }

  //get Operations by work order no.
  getOperationByWONO() {
    //show Loader
    this.showLoader = true;
    //this.ApplyGeneology = false;
    window.localStorage.setItem('SaveFGData','');
    if (this.psWONO != null || this.psWONO != undefined) {
      this.mo.getOperationByWorkOrder(this.CompanyDBId, this.docEntry, this.psWONO).subscribe(
        data => {
          if (data != null && data.length > 0) {
            
            if (data[0].ErrMessage != undefined) {             
              this.commonService.RemoveLoggedInUser(this.language.session_expired);
              return;
            }         

            this.NoOperAvailable = false;
            this.GetOperationImageStatus = false;
            this.DisableEnablOperation = false;
            this.allWOOpDetails = data;
            if (this.allWOOpDetails.length > 0) {
              // this.lookupData = this.allWOOpDetails;
              //this.oprLookupData=this.allWOOpDetails;
              this.openedLookup = "OperLookup";
              // this.showLookup = true;
            }

            // if(this.settingOnSAP == '3'){
            //   this.checkGeneologyOnItemExtn();
            // }
           
            //hide Loader
            //this.showLoader = false;
          }
          else {
            //hide Loader
            this.showLoader = false;
            this.NoOperAvailable = true;
            this.GetOperationImageStatus = true;
            this.DisableEnablOperation = true;
          }
        },
        error => {
          this.showLoader = false;
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }               
        }
      )
    }
  }

  // GetNextOperation(NxtOprNo){
  //   this.mo.GetNextOperation(this.CompanyDBId,this.psOperNO,NxtOprNo,this.docEntry,this.psWONO).subscribe(
  //     data => {
  //       if (data != null) {
  //        this.psToOperation = data;
  //        alert(NxtOprNo + data)
  //       }
  //       this.showLoader = false;
  //   })
  // }

  //This will get the selected Operation's
  getSelectedOperationDetail() {
    //show Loader
    this.showLoader = true;
    window.localStorage.setItem('SaveFGData','');
    //here we will need to call a service which will get the Operation Details on the basis of docEntry & OperNo
    this.mo.getOperDetailByDocEntry(this.CompanyDBId, this.docEntry, this.psOperNO,this.psWONO).subscribe(
      data => {
        if (data != null) {

          if (data.length > 0) {
            if (data[0].ErrMessage != undefined) {             
              this.commonService.RemoveLoggedInUser(this.language.session_expired);
              return;
            }
		      }

          // if(data[0].IsTaskRowPresent != undefined){
          //   this.toastr.error('', this.language.task_already_created, this.baseClassObj.messageConfig);
          //   this.DisableEnablQuantity = true;
          //   return;
          // }   
          
          
          this.DisableEnablQuantity = false;
          this.selectedWOOperDetail = data;
          this.showOperDtPopup = true;
          this.psToOperation = data[0].NextOperNo;
          this.psPreOperation = data[0].PrevOperNo;

          if(data[0].U_O_OPR_TYPE == '1' || data[0].U_O_OPR_TYPE == '2'){
            this.IsSetupOrTDOper = true;
            this.DisableEnablQuantity = true;
            this.psToOperation = this.psOperNO;
          }           
          else{
            this.IsSetupOrTDOper = false;
          }
          switch (this.isCustomizedFor) {
            case this.baseClassObj.ellyza_london:
              if (this.isUserIsSubcontracter == "True") {
                this.iBalQty = Number(data[0].U_O_BALQTY);
              }
              else {
                this.iBalQty = Number(data[0].U_O_BALQTY);
              }
              break;
            default:
              this.iBalQty = data[0].U_O_BALQTY;

          }

          //By default set into it
          this.iProducedQty = data[0].U_O_BALQTY;
          this.iAcceptedQty = data[0].U_O_BALQTY;

          //this.GetNextOperation(data[0].NextOperNo);

          //hide Loader
         // this.showLoader = false;
        } else {
          //hide Loader
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
    this.showLoader = false;
  }

  //This function will make the screen reset
  cleanupScreen() {
    this.psWONO = '';
    this.psItemManagedBy = '';
    this.psOperName = '';
    this.psOperNO = '';
    this.psProductCode = '';
    this.psProductDesc = '';
    this.iAcceptedQty = 0;
    this.iBalQty = 0;
    this.iNCQty = 0;
    this.iOrderedQty = 0;
    this.iProducedQty = 0;
    this.iRejectedQty = 0;
    this.psToOperation = '';
    this.psPreOperation = '';


    //this function will reset the time and date of the server
    //As discussed with vaibhav sir and rohit sir the date will not be of server
    //this.getServerDate();
    this.setDefaultDateTime();
  }

  //This will set the time and date
  setDefaultDateTime() {

    // if(this.currentServerDateTime != null && this.currentServerDateTime.length > 0){
    //   let currentDateTime = new Date(this.currentServerDateTime);
    //   this.FrmToDateTime = [
    //     new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes()),
    //     new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(),currentDateTime.getDate(), currentDateTime.getHours(), currentDateTime.getMinutes())
    //   ];
    // }

    let defDateTime = new Date();
    this.FrmToDateTime = [
      new Date(defDateTime.getFullYear(), defDateTime.getMonth(), defDateTime.getDate(), defDateTime.getHours(), defDateTime.getMinutes()),
      new Date(defDateTime.getFullYear(), defDateTime.getMonth(), defDateTime.getDate(), defDateTime.getHours(), defDateTime.getMinutes())
    ];    
    
   }

  //This will get the server date time
  getServerDate(isForcefullSubmission) {
    //here we will need to call a service which will get the Server Date Time
    this.mo.getServerDate(this.CompanyDBId).subscribe(
      data => {
        this.showLoader = false;

        if (data != undefined && data != null) {
          if (data.length > 0) {
            if (data[0].ErrMessage != undefined) {             
              this.commonService.RemoveLoggedInUser(this.language.session_expired);
              return;
            }
		      }
	      }

        console.log("Server Date Time", data[0].DATEANDTIME);

        if (this.FrmToDateTime[1] > new Date(data[0].DATEANDTIME)) {
          this.toastr.error('', this.language.oper_end_time_greater_server, this.baseClassObj.messageConfig);
          return;
        }
        else {
          //If time and date is not greater than server time then will go for submit
          this.submitMoveOrder(isForcefullSubmission);
        }

        this.showLoader = false;
        // this.currentServerDateTime = data[0].DATEANDTIME;
        // this.setDefaultDateTime();
      },
      error => {       
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);                  
        }
        else{
          this.toastr.error('', this.language.some_error, this.baseClassObj.messageConfig);
        }     
        this.showLoader = false;
      }
    )
  }

  //check for the mandatory inputs on submit
  checkMandatoryInpts() {
    if (this.psWONO == "" || this.psWONO == null || this.psWONO == undefined) {
      this.toastr.error('',this.language.select_wo, this.baseClassObj.messageConfig);
      return false;
    }

    if (this.psOperNO == "" || this.psOperNO == null || this.psOperNO == undefined) {
      this.toastr.error('', this.language.select_oper, this.baseClassObj.messageConfig);
      return false;
    }
    if (this.iProducedQty <= 0) {
      this.toastr.error('', this.language.prod_qty_zero, this.baseClassObj.messageConfig);
      return false;
    }
    if (this.FrmToDateTime != null) {
      if (this.FrmToDateTime[0] == "" || this.FrmToDateTime[0] == null || this.FrmToDateTime[0] == undefined) {
       // alert("Please enter start date ")
       this.toastr.error('', this.language.enter_start_date, this.baseClassObj.messageConfig);
        return false;
      }
      if (this.FrmToDateTime[1] == "" || this.FrmToDateTime[1] == null || this.FrmToDateTime[1] == undefined) {
        //alert("Please enter end date ")
        this.toastr.error('', this.language.enter_end_date, this.baseClassObj.messageConfig);
        return false;
      }
    } else {
     // alert("Please enter  date")
     this.toastr.error('', this.language.enter_date, this.baseClassObj.messageConfig);
    }
    return true;
  }

  //This function will read the settings
  getSettingOnSAP() {
    this.showLoader = true;
    //here we will read the settings frm db
    this.mo.getSettingOnSAP(this.CompanyDBId, this.loggedInUser).subscribe(
      data => {
        if (data != null || data != undefined) {
          this.showLoader = false;

          if (data.LICDATA != undefined) {
            if (data.LICDATA[0].ErrMessage != undefined) {             
              this.commonService.RemoveLoggedInUser(this.language.session_expired);
              return;
            }
		      }

          if (data.CustomizationDetails != undefined) {
            if (data.CustomizationDetails.length > 0) {
              this.isCustEnabled = data.CustomizationDetails[0].CustEnabled;
              this.isCustomizedFor = data.CustomizationDetails[0].CustFor;
              window.localStorage.setItem('isCustEnabled', this.isCustEnabled);
            }
          }
          //this.isCustomizedFor = "ellyzaLondon";


          if (data.SettingTable.length > 0) {
            if (data.SettingTable != undefined) {
              this.IsMoveOrderTimeMandatory = data.SettingTable[0].IsMoveOrderTimeMandatory;
              this.settingOnSAP = data.SettingTable[0].ScreenSetting;
             // this.settingOnSAP = "3";
            }
          }

         if(data.UserDetails != undefined){
          if (data.UserDetails.length > 0) {
            if (data.UserDetails != undefined) {
              this.isUserIsSubcontracter = data.UserDetails[0].isUserIsSubcontracter;
              window.localStorage.setItem('isUserIsSubcontracter', this.isUserIsSubcontracter);
            }
            this.showLoader = false;
          }
         }
          //because of async req.
          this.getAllWorkOrders("init");
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
        else{
          this.toastr.error('', this.language.some_error, this.baseClassObj.messageConfig);
        }       
        
      }
    )

  }

  submitFGRMData(taskHDId){

    let temp = window.localStorage.getItem('SaveFGData');
    if(temp != undefined && temp != null){
      this.SaveFGData = JSON.parse(window.localStorage.getItem('SaveFGData'));
      this.fgrmService.SubmitDataforFGandRM(this.SaveFGData,taskHDId).subscribe(
        data => {
          if (data != null) {

            if(data == "7001"){
              this.commonService.RemoveLoggedInUser(this.language.session_expired);
              return;
            }

            if (data == "attach_all_child_item") {
              this.toastr.error('', this.language.attach_all_child, this.baseClassObj.messageConfig);
            }
            else if (data.search("quantity of item") != -1) {
              this.toastr.error('', data, this.baseClassObj.messageConfig);
            }
            else if (data == "True") {
              //alert
              window.localStorage.setItem('SaveFGData','');
            }
            else {
              this.toastr.error('', this.language.some_error, this.baseClassObj.messageConfig);           
             // alert("Error in saving data in FG Batch Serial Table");
              return false;
            }
          }
        },
        error => {
          if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
            this.commonService.unauthorizedToken(error);               
          }               
        }
      ) 
    }      
 }

  submitMoveOrder(forcefullySubmission) {

    if (this.iProducedQty > this.iBalQty) {
      this.toastr.error('', this.language.prod_qty_greater_than_bal, this.baseClassObj.messageConfig);
      return false;
    }

    let tempArr;
    let temStr = window.localStorage.getItem('SaveFGData');
    if(temStr != '' && temStr != undefined){
      tempArr = JSON.parse(window.localStorage.getItem('SaveFGData'));
      
      if(tempArr.ParentDataToSave != undefined && tempArr.ParentDataToSave != null){

        let qty = 0;
        for(let i=0; i<tempArr.ParentDataToSave.length; i++){
          qty = qty+tempArr.ParentDataToSave[i].Quantity;
        }

        if(this.iProducedQty != qty){
          this.toastr.error('', 'Quantity mismatch', this.baseClassObj.messageConfig);
          return false;
        }
      }
    }

    //if To Operation no. is empty then put the same
    if (this.psToOperation == "" || this.psToOperation == undefined) {
      this.psToOperation = this.psOperNO;
    } 

    this.mo.submitMoveOrder(this.CompanyDBId, this.docEntry, this.psOperNO, this.psToOperation, this.psWONO, this.psProductCode, this.loggedInUser, this.iAcceptedQty, this.iRejectedQty, this.iNCQty, this.iOrderedQty, this.iProducedQty, this.FrmToDateTime, this.psPreOperation, this.settingOnSAP, this.IsMoveOrderTimeMandatory, this.iBalQty, forcefullySubmission).subscribe(
      data => {

      if(data != null && data != undefined){
        if (data.LICDATA != undefined) {
          if (data.LICDATA[0].ErrMessage != undefined) {             
            this.commonService.RemoveLoggedInUser(this.language.session_expired);
            return;
          }
        }
      }
        
        //Submit Move Order Status
      //  if(data != undefined && data != null){
      //    if(data.TaskHDRow != undefined){
      //     if(data.TaskHDRow[0].IsTaskRowPresent != undefined)
      //     this.toastr.error('', this.language.task_already_created, this.baseClassObj.messageConfig);
      //     return;
      //    }          
      //   }
       if (data.recordSubmitDetails != undefined) {
        if (data.recordSubmitDetails.length > 0) {
          if (data.recordSubmitDetails[0].isRecordSubmitted == "True") {

            if((this.settingOnSAP == '2' || this.settingOnSAP == '3') && !this.IsSetupOrTDOper && this.psItemManagedBy != "None"){
              this.submitFGRMData(data.recordSubmitDetails[0].LogId);
            }           
            this.toastr.success('', this.language.submit_sucessfull, this.baseClassObj.messageConfig);
            this.cleanupScreen();
            this.showLoader = false;
          }
          else if (data.recordSubmitDetails[0].isRecordSubmitted == "OperOverlapping") {
            this.toastr.error('', this.language.oper_start_time_lesser, this.baseClassObj.messageConfig);
            this.showLoader = false;
          }
        }
       }

      if (data.recordAlreadySubmitDetails != undefined) {
        if (data.recordAlreadySubmitDetails.length > 0) {
          if (data.recordAlreadySubmitDetails[0].OPTM_STATUS == "N") {
            this.toastr.warning('', this.language.record_under_progress, this.baseClassObj.messageConfig);
            //this.cleanupScreen();
            this.showLoader = false;
            return;
          }
          if (data.recordAlreadySubmitDetails[0].OPTM_STATUS == "E") {
            let userResponse;
            userResponse = confirm(this.language.record_have_error + data.recordAlreadySubmitDetails[0].OPTM_RESULTDESC + ", Do you want to continue ?");

            if (userResponse == true) {
              this.getServerDate(true);
              //this.submitMoveOrder(true);
            }
            else {
              this.cleanupScreen();
              this.showLoader = false;
              return;
            }
           this.showLoader = false;
          }
        }
      }       
       else {
          console.log(data);
         // this.toastr.error('', this.language.error_on_submitting, this.baseClassObj.messageConfig);
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
  }
  //This will clear the screen after lookup selection
  clearScreenAfterLookup() {
    this.psWONO = "";
    this.psOperNO = "";
    this.psOperName = "";
    this.psToOperation = "";
    this.iProducedQty = 0;
    this.allWOOpDetails = [];


    //Hiding forms if uncesry opened forms
    if (this.settingOnSAP == "1" || this.psItemManagedBy == "None" || this.IsSetupOrTDOper) {
      this.showQtyNoScanScreen = false;
    }
    if (this.settingOnSAP == "2" && this.psItemManagedBy != "None") {
      this.showQtyWithFGScanScreen = false;
    }
    if (this.settingOnSAP == "3" && this.psItemManagedBy != "None" ) //&& this.ApplyGeneology
     { 
      this.showQtyWithFGRMScanScreen = false;
    }
    // if(this.settingOnSAP == "3" && this.psItemManagedBy != "None" && !this.ApplyGeneology){
    //   this.showQtyNoScanScreen = false;
    // }
  }

  //This function will check whether the FG is linked to WO or not 
  GetBatchSerialLinking() {
    this.showLoader = true;
    this.mo.GetBatchSerialLinking(this.CompanyDBId, this.psWONO, this.warehouseName, Number(this.psOperNO)).subscribe(
      data => {

      if(data != null && data != undefined){
        if (data.LICDATA != undefined) {
          if (data.LICDATA[0].ErrMessage != undefined) {             
            this.commonService.RemoveLoggedInUser(this.language.session_expired);
            return;
          }
        }
      }       

        let isAllowed = true;
        if (data != null && data.Table.length > 0) {
          
          //Putting qtys if there is need to open the fg input screen
          this.basicDetails = [];
          //Setting basic details to share on another screen
          this.basicDetails.push({ 'WorkOrderNo': this.psWONO, 'OperNo': this.psOperNO, 'ItemCode': this.psProductCode, 'ManagedBy': this.psItemManagedBy, 'BalQty': this.iBalQty, 'ProducedQty': this.iProducedQty, 'IsUserIsSubcontracter': this.isUserIsSubcontracter });

          if (data != undefined && data.Table.length > 0) {

              //If data of linked qty is less then zero
              if (Number(data.Table[0].LinkedQuantity) <= 0) {
                this.toastr.error('', this.language.no_batchserial_attached, this.baseClassObj.messageConfig);
                isAllowed = false;
                this.showLoader = false;
                //Load screen elements
                this.loadFGScreenElements();
                //This function will decide the screen to be opened
                this.openItemLinkingScreen();
              }
              //If the Qty is greater than 0 then
              else {
                //If the number of linked qty is more than produced qty
                if (Number(data.Table[0].LinkedQuantity) > this.iProducedQty) {
                  this.toastr.error('', this.language.no_attached_batchserial_greater, this.baseClassObj.messageConfig);
                  isAllowed = false;
                  this.showLoader = false;
                  //Load screen elements
                  this.loadFGScreenElements();
                  //This function will decide the screen to be opened
                  this.openItemLinkingScreen();
                }

                //If the number of linked qty is less than produced qty
                if (Number(data.Table[0].LinkedQuantity) < this.iProducedQty) {
                  this.toastr.error('', this.language.qty_mismatch, this.baseClassObj.messageConfig);
                  isAllowed = false;
                  this.showLoader = false;
                  //Load screen elements
                  this.loadFGScreenElements();
                  //This function will decide the screen to be opened
                  this.openItemLinkingScreen();
                }
              }
             //If all ok then the flag will allow to submit otherwise not
             if (isAllowed == true) {
              this.getServerDate(false);
              //submission service callled
              //this.submitMoveOrder(false);
            }
          }
        }
      },
      error => {
        this.showLoader = false;
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }               
      }
    )
  }

  //THis will deceide which screen have to be opened
  openItemLinkingScreen() {
    this.showItemLinkingScreen = true;
    if (this.settingOnSAP == "1" || this.psItemManagedBy == "None" || this.IsSetupOrTDOper) {
      this.ScreenName = this.language.move_order_summary;
      this.showQtyNoScanScreen = true;
      this.showQtyWithFGScanScreen = false;
      this.showQtyWithFGRMScanScreen = false;
    }
    else if (this.settingOnSAP == "2" && this.psItemManagedBy != "None") {
      this.ScreenName = this.language.finished_goods_scan;
      this.showQtyWithFGScanScreen = true;
      this.showQtyNoScanScreen = false;
    }
    else if (this.settingOnSAP == "3" && this.psItemManagedBy != "None" ) //&& this.ApplyGeneology
    {
      this.ScreenName = this.language.fg_raw_materials_scan;
      this.showQtyWithFGRMScanScreen = true;
      this.showQtyNoScanScreen = false;
    }
    // else if (this.settingOnSAP == "3" && this.psItemManagedBy != "None" && !this.ApplyGeneology) {
    //   this.ScreenName = this.language.move_order_summary;
    //   this.showQtyNoScanScreen = true;
    //   this.showQtyWithFGScanScreen = false;
    //   this.showQtyWithFGRMScanScreen = false;
    // }
  }

  //Load Rifgt Screen elements
  loadFGScreenElements() {
    //For Opening the Right Section
    this.openRightSection(true);
    this.isQuantityRightSection = true;
    document.getElementById('opti_QuantityRightSection').style.display = 'block';
  }

  checkIfLoginIsValid() {
    if (window.localStorage.getItem('loggedInUser') == null || window.localStorage.getItem('loggedInUser') == undefined) {
      this.router.navigateByUrl('/login');
    }
  }

  checkIfOperRequiresMaterial(status){
    this.showLoader = true;
    //here we will read the settings frm db
    this.mo.checkIfOperRequiresMaterial(this.CompanyDBId,this.psWONO,this.psOperNO).subscribe(
      data => {
        if (data != null || data != undefined) {
          this.showLoader = false;

          if (data.length > 0) {
            if (data[0].ErrMessage != undefined) {             
              this.commonService.RemoveLoggedInUser(this.language.session_expired);
              return;
            }
		      }

            if (data.length <= 0) {
              this.toastr.error('', this.language.not_allowed_batchserial, this.baseClassObj.messageConfig);
              this.showLoader = false;
              return;
            }
            else{
              this.openRespectiveScreen(status);
            }
        }
        else{
          this.openRespectiveScreen(status);
        }
      },
      error => {
        this.showLoader = false;
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }
        else{
          this.toastr.error('', this.language.some_error, this.baseClassObj.messageConfig);
        }
       
      }
    )
  }

  openRespectiveScreen(status){
    if (this.psWONO == "" || this.psWONO == null || this.psWONO == undefined || this.psOperNO == "" || this.psOperNO == undefined || this.psOperNO == null || this.DisableEnablQuantity) {
      status = false;
    } else {
      status = true;
    }
    if (status == true) {
      this.openRightSection(status)
      this.isQuantityRightSection = status;
      document.getElementById('opti_QuantityRightSection').style.display = 'block';
      this.basicDetails = [];
      //Setting basic details to share on another screen
      this.basicDetails.push({ 'WorkOrderNo': this.psWONO, 'OperNo': this.psOperNO, 'ItemCode': this.psProductCode, 'ManagedBy': this.psItemManagedBy, 'BalQty': this.iBalQty, 'ProducedQty': this.iProducedQty, 'ToOperNo': this.psToOperation });
      //This will open itel linking screen      
      this.openItemLinkingScreen();
    }
  }
}
