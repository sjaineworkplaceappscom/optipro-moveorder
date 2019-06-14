import { Component, OnInit, Input, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import { FgrmscanparentinputformService } from '../services/fgrmscanparentinputform.service';
import { FgrmscanchildinputformComponent } from "../fgrmscanchildinputform/fgrmscanchildinputform.component";
import { UIHelper } from 'src/app/helpers/ui.helpers';
import { BaseClass } from 'src/app/classes/BaseClass'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fgrmscanparentinputform',
  templateUrl: './fgrmscanparentinputform.component.html',
  styleUrls: ['./fgrmscanparentinputform.component.scss']
})
export class FgrmscanparentinputformComponent implements OnInit {
  @Input() rowDataFrmFGWithScan: any;
  @Input() FGWithScanGridFrmMaster: any;
  @Input() basicFGInputForm: any;
  @ViewChild(FgrmscanchildinputformComponent) child;
  private baseClassObj = new BaseClass();
  basicDetailsToChildForm: any;
  ChildCompGridData: any = [];
  ParentGridData: any = [];
  rowDataForChildEdit: any = [];
  oModalData: any = {};
  detailsOfParentToChild: any;
  showFGRMScanChildInsertPopup: boolean = false;
  loggedInUser: string = '';
  CompanyDBId: string = '';
  psItemManagedBy: string = '';
  bIsEdit: boolean = false;
  psBatchSer: string = '';
  iQty: number = 1;
  bIsRejected: any = false;
  bIsNC: any = false;
  iSeqNo: number;
  showLoader: boolean = false;
  bIsInEditMode: boolean = false;
  bIsRMGridInEditMode: boolean = false;
  checkBatch: boolean = false;
  public bothSelectionRestrict: boolean = false;
  public bIfBatSerEmpty: boolean = false;
  public bIfQtyIsZero = false;
  public disableSaveBtn: boolean = false;
  public language: any;
  constructor(private qtyWithFGScanDtl: QtyWithFGScanService, private fgrmParentForm: FgrmscanparentinputformService, private toastr: ToastrService) { }
  @Output() messageEvent = new EventEmitter<string>();
  gridHeight: number;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.gridHeight = UIHelper.getMainContentHeight();
  }
  @ViewChild('qtylevelChild') qtylevelChild;
  @ViewChild('qtylevelSuperchild') qtylevelSuperchild;
  showLevelSuperChild() {

    if (this.psItemManagedBy == "Batch") {
      if (this.validateBatchItem() == false)
        this.checkBatch = true;
      else
        this.checkBatch = false;
    }

    //if fields are empty then restrict user from going to add child
    if (this.psBatchSer != undefined || this.psBatchSer != "") {
      //While after putting all data for the FG input serial field the basic validations will be check here
      //This mehtod will retrun true if all things are OK and after we will navigate otherwise will throw error
      if (this.validateData() == true) {
        this.detailsOfParentToChild = {
          ParentBatchSer: this.psBatchSer,
          ParentItemManagedBy: this.psItemManagedBy,
          OperNo: this.basicFGInputForm[0].OperNo
        };

        this.qtylevelChild.nativeElement.style.display = 'none';
        this.qtylevelSuperchild.nativeElement.style.display = 'block';

        this.showFGRMScanChildInsertPopup = true;
      }
    }
    else {
      this.toastr.warning('', this.language.enter_fg_batchserial, this.baseClassObj.messageConfig);
    }
  }

  validateBatchItem() {
    if (this.FGWithScanGridFrmMaster != null) {
      for (let rowCount in this.FGWithScanGridFrmMaster) {
        if (this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer) {

          if (this.FGWithScanGridFrmMaster[rowCount].OPTM_REJECT == true && this.bIsRejected == true) {
            this.toastr.error('', this.language.item_already_rej, this.baseClassObj.messageConfig);
            this.psBatchSer = "";
            this.bIsRejected = false; this.iQty = 1;
            return false;
          }

          else if (this.FGWithScanGridFrmMaster[rowCount].OPTM_NC == true && this.bIsNC == true) {
            this.toastr.error('', this.language.item_already_nc, this.baseClassObj.messageConfig);
            this.psBatchSer = "";
            this.bIsNC = false; this.iQty = 1;
            return false;
          }

          else if (this.FGWithScanGridFrmMaster[rowCount].OPTM_NC == false && this.FGWithScanGridFrmMaster[rowCount].OPTM_NC == false) {
            if (this.bIsRejected == false && this.bIsNC == false) {
              this.toastr.error('', this.language.item_already_present, this.baseClassObj.messageConfig);
              this.psBatchSer = ""; this.iQty = 1;
              return false;
            }
          }
        }
      }
      return true;
    }
  }

  showLevelParent() {
    document.getElementById('opti_QtylevelChildSuperChildID').style.display = 'none';
    document.getElementById('opti_QtylevelParentID').style.display = 'block';
    this.messageEvent.emit("FromFGRMScanParentInputForm");
  }
  ngOnChange() {
    this.clearValues();
  }
  ngOnInit() {

    this.language = JSON.parse(window.localStorage.getItem('language'));
    this.gridHeight = UIHelper.getMainContentHeight();

    // Hide superchild section on initial
    this.qtylevelSuperchild.nativeElement.style.display = 'none';

    this.loggedInUser = window.localStorage.getItem('loggedInUser');
    console.log("On FG SCANC PARENT");
    console.log(this.basicFGInputForm)
    //console.log(this.rowDataFrmFGWithScan);
    this.basicDetailsToChildForm = this.basicFGInputForm;
    this.CompanyDBId = window.localStorage.getItem('selectedComp');

    //taking item managed by
    if (this.basicFGInputForm != null) {
      if (this.basicFGInputForm.length > 0) {
        this.psItemManagedBy = this.basicFGInputForm[0].ManagedBy;
      }
    }

    //Disable/enalbe controls
    //this.disableEnableControls();

    if (this.rowDataFrmFGWithScan != null) {
      if (this.rowDataFrmFGWithScan.length > 0) {
        this.bIsEdit = true;
        this.bIsInEditMode = true;
        this.psBatchSer = this.rowDataFrmFGWithScan[0].FGBatchSerNo;
        this.iQty = this.rowDataFrmFGWithScan[0].Quantity;
        this.bIsRejected = this.rowDataFrmFGWithScan[0].IsRejected;
        this.bIsNC = this.rowDataFrmFGWithScan[0].IsNC;
        this.iSeqNo = this.rowDataFrmFGWithScan[0].SeqNo;
        this.psItemManagedBy = this.rowDataFrmFGWithScan[0].ItemManagedBy;

        //If screen is in edit mode then will get all childs
        this.GetAllChildByParentId();
      }
      else {
        this.bIsInEditMode = false;
      }
    }
  }

  clearValues() {
    this.psBatchSer = "";
  }

  //Events
  onBatchSerBlur() {
    //alert('Hi');
    var inputValue = (<HTMLInputElement>document.getElementById('psBatchSerID')).value;
    if (inputValue.length > 0) {
      this.psBatchSer = inputValue;
    }
    if (this.psBatchSer != null) {
      if (this.psBatchSer.length > 0) {
        this.bIfBatSerEmpty = false;
        if (this.chkIfFGBatSerAlreadyExists() == false) {
          this.validateFGSerBat();
        }
      }
      else {
        this.bIfBatSerEmpty = true;
      }
    }
  }

  //On Qty blur this will run
  onQtyBlur() {
    if (this.iQty <= 0 || this.iQty == undefined) {
      this.bIfQtyIsZero = true;
    }
    else {
      this.bIfQtyIsZero = false;
      //If value is ok then chk produced qty not greater than bal qty
      if (this.iQty > this.basicFGInputForm[0].BalQty) {
        this.toastr.error('', this.language.qty_cant_greater_bal_qty, this.baseClassObj.messageConfig);
        this.iQty = 1;
        return;
      }
      else {
        //If value is ok then chk produced qty not greater than bal qty
        if (this.iQty > this.basicFGInputForm[0].ProducedQty) {
          this.toastr.error('', this.language.qty_cant_greater_pro_qty, this.baseClassObj.messageConfig);
          this.iQty = 1;
          return;
        }
      }
    }
  }

  onIsRejectedCheck() {
    //this.bIsRejected = true;
    if (this.bIsRejected)
      this.bIsRejected = true;
    else
      this.bIsRejected = false;
    this.bIsNC = false;
    console.log(this.bIsRejected);
  }
  onIsNCCheck() {
    //this.bIsNC = true;
    if (this.bIsNC)
      this.bIsNC = true;
    else
      this.bIsNC = false;
    this.bIsRejected = false;
    //document.getElementById("opti_bIsNCID").checked = true;
    //$('#opti_bIsNCID').prop('checked', true);
    console.log(this.bIsNC);
  }

  //This event will recieve the data from its child input form
  receiveArrayRMRowData($event) {
    this.showFGRMScanChildInsertPopup = false;
    console.log("I AM --->" + $event);
    if ($event != undefined || $event != null) {
      if (this.bIsRMGridInEditMode == false) {
        this.ChildCompGridData.push($event);
      }
      //if is in edit mode then
      else {
        for (let iRowCount in this.ChildCompGridData) {
          if ($event.OPTM_SEQ == this.ChildCompGridData[iRowCount].OPTM_SEQ &&
            this.ChildCompGridData[iRowCount].OPTM_ITEMCODE == $event.OPTM_ITEMCODE) {
            this.ChildCompGridData[iRowCount].OPTM_ITEMCODE = $event.OPTM_ITEMCODE
            this.ChildCompGridData[iRowCount].OPTM_BTCHSERNO = $event.OPTM_BTCHSERNO
            this.ChildCompGridData[iRowCount].OPTM_QUANTITY = Number($event.OPTM_QUANTITY)
          }
        }
      }
    }
    //To clear the array after call backing from the child form
    this.rowDataForChildEdit = [];

    //To hide the child input form
    this.showFGRMScanChildInsertPopup = false;
  }

  //This function will save the final data for a single FG Batch/Serial
  onFinalSavePress() {
    //If child data is not saved then we will restrict user
    //if (this.ChildCompGridData != null && this.ChildCompGridData.length > 0) {
    if (this.psBatchSer != "" && this.iQty > 0) {
      let sIsRejected;
      let sIsNC;
      //gather the Parent FG Data here
      if (this.bIsRejected == true) {
        sIsRejected = 'Y';
      }
      else {
        sIsRejected = 'N';
      }

      if (this.bIsNC == true) {
        sIsNC = 'Y';
      }
      else {
        sIsNC = 'N';
      }

      if (this.iSeqNo == undefined || this.iSeqNo == null) {
        this.iSeqNo = 0;
      }

      //this.oModalData.ABC = [{'keyNAME':'ashish'},{'keyNAME':'rmaesh'}]
      this.ParentGridData = [{
        'SequenceNo': this.iSeqNo,
        'WorkOrderNo': this.basicFGInputForm[0].WorkOrderNo,
        'FGBatchSerial': this.psBatchSer,
        'Rejected': sIsRejected,
        'User': this.loggedInUser,
        'NC': sIsNC,
        'Item': this.basicFGInputForm[0].ItemCode,
        'Operation': this.basicFGInputForm[0].OperNo,
        'Quantity': this.iQty,
        'CompanyDBId': this.CompanyDBId
      }]

      this.oModalData.HeaderData = [{
        'CompanyDBId': this.CompanyDBId,
        'WorkOrderNo': this.basicFGInputForm[0].WorkOrderNo,
        'User': this.loggedInUser,
        'Operation': this.basicFGInputForm[0].OperNo,
        'Item': this.basicFGInputForm[0].ItemCode,
        'ToOperationNo': this.basicFGInputForm[0].ToOperNo
      }]
      this.oModalData.ChildDataToSave = this.ChildCompGridData
      this.oModalData.ParentDataToSave = this.ParentGridData
      this.fgrmParentForm.SubmitDataforFGandRM(this.oModalData).subscribe(
        data => {
          if (data != null) {
            if (data == "attach_all_child_item") {
              this.toastr.error('', this.language.attach_all_child, this.baseClassObj.messageConfig);
              this.showLevelParent();
            }
            else if (data.search("quantity of item") != -1) {
              this.toastr.error('', data, this.baseClassObj.messageConfig);
             // this.showLevelParent();
            }
            else if (data == "True") {
              //alert("Data saved sucessfully");
              //Now call the parent componet by event emitter here
              //this.messageEvent.emit("FromFGRMScanParentInputForm");
              //this.GetAllChildByParentId();
              this.showLevelParent();
            }
            else {
              //alert("There was some error while submitting data"); 
              this.toastr.error('', this.language.some_error, this.baseClassObj.messageConfig);
              //this.GetAllChildByParentId();  
              this.showLevelParent();
            }

          }
        }
      )

    }
    else {
      this.toastr.warning('', this.language.attach_batchserial_before_saving, this.baseClassObj.messageConfig);
    }
  }

  //Following will remove the data
  removeHandler({ rowIndex }) {
    //this.deleteRMDataBySeq(rowIndex);
    this.ChildCompGridData.splice(rowIndex, 1);

  }

  //For edititng child the following fucntion will work
  editHandler({ rowIndex }) {

    this.bIsRMGridInEditMode = true;
    //To show the popup screen which will supdateave the data
    this.showLevelSuperChild();
    this.rowDataForChildEdit.push({
      SequenceNo: this.ChildCompGridData[rowIndex].OPTM_SEQ,
      ChildItemCode: this.ChildCompGridData[rowIndex].OPTM_ITEMCODE,
      ChildBatchSerNo: this.ChildCompGridData[rowIndex].OPTM_BTCHSERNO,
      Qty: this.ChildCompGridData[rowIndex].OPTM_QUANTITY,
      ManagedBy: this.ChildCompGridData[rowIndex].ManagedBy,
      loggedInUser: this.loggedInUser
    });

  }

  //Core Functions

  //this will chk if the data we are adding is duplicate
  chkIfFGBatSerAlreadyExists() {

    if (this.psItemManagedBy == "Batch") {
      return false;
    }

    if (this.FGWithScanGridFrmMaster != null) {
      for (let rowCount in this.FGWithScanGridFrmMaster) {
        if (this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer) {
          //alert("Serial/Batch already exist");
          // this.toastr.warning('', "Serial/Batch already exist", this.baseClassObj.messageConfig);
          this.toastr.warning('', this.language.serial_already_exist, this.baseClassObj.messageConfig);
          this.psBatchSer = "";
          return true;
        }
      }
      return false;
    }
    else {
      return false;
    }
  }
  //This will validate the FG Ser Batch
  validateFGSerBat() {
    this.qtyWithFGScanDtl.checkIfFGSerBatisValid(this.CompanyDBId, this.psBatchSer, this.basicFGInputForm[0].WorkOrderNo, this.basicFGInputForm[0].ItemCode, this.basicFGInputForm[0].OperNo).subscribe(
      data => {
        // if (data != null || data[0].ItemCheck != "") {
        if (data != null) {

          if (data[0].ItemCheck != "") {

            if (data[0].ItemCheck == "ItemNotExists") {
              //alert("FG Bat/Ser you are entering is not valid");
              this.toastr.error('', this.language.fg_not_valid, this.baseClassObj.messageConfig);
              this.psBatchSer = '';
            }
            // if (data[0].ItemCheck == "ItemRejected") {
            //   //alert("FG Bat/Ser you are entering is rejected");
            //   this.toastr.error('', "FG Bat/Ser you are entering is rejected", this.baseClassObj.messageConfig);
            //   this.psBatchSer = '';
            //   this.iQty = 1;
            //   return;
            // }
            if (data[0].ItemCheck == "ItemMoved") {
              this.toastr.error('', this.language.fg_already_moved, this.baseClassObj.messageConfig);
              this.psBatchSer = '';
              this.iQty = 1;
              return;
            }
            if (data[0].ItemCheck == "Manual") {
              console.log(this.psBatchSer + " -->This has a maual case");
            }
          }
        }
        else {
          this.toastr.error('', this.language.error_while_validate_fg, this.baseClassObj.messageConfig);
          console.log("error-->" + data)
        }
      }
    )
  }

  //This will get all childs of the parent batchserial enterd
  GetAllChildByParentId() {
    this.showLoader = true;
    this.fgrmParentForm.GetAllChildByParentId(this.CompanyDBId, this.psBatchSer).subscribe(
      data => {
        if (data != null) {
          this.ChildCompGridData = data;
          this.showLoader = false;
        }
        else {
          this.showLoader = false;
        }
      }
    )
  }

  validateData() {
    //Check whether the input is not empty
    if (this.psBatchSer == '' || this.psBatchSer == null) {
      this.bIfBatSerEmpty = true;
      return false;
    }
    else {
      this.bIfBatSerEmpty = false;
    }

    //Check whether the qty is not empty
    if (this.iQty <= 0 || this.iQty == undefined) {
      this.bIfQtyIsZero = true;
      return false;
    }
    else {
      this.bIfQtyIsZero = false;
    }

    //Check if selection is of both is done
    if (this.bIsNC == true && this.bIsRejected == true) {
      this.bothSelectionRestrict = true;
      return false;
    }
    else {
      this.bothSelectionRestrict = false;
    }

    return true;
  }

  onHiddenScanClick() {
    this.onBatchSerBlur();
  }

  //to delete the RM
  deleteRMDataBySeq(rowIndex) {
    this.showLoader = true;
    console.log(this.ChildCompGridData[rowIndex].OPTM_SEQ);
    this.fgrmParentForm.deleteRMDataBySeq(this.CompanyDBId, this.ChildCompGridData[rowIndex].OPTM_SEQ).subscribe(
      data => {
        if (data != null) {
          if (data == "True") {
            //After the Data Deletion the grid will refreshed by this
            this.GetAllChildByParentId();
          }
          else {
            this.toastr.error('', this.language.failed_to_delete_data, this.baseClassObj.messageConfig);
            console.log("error-->" + data);
          }
          this.showLoader = false;
        }
        else {
          this.showLoader = false;
        }
      }
    )

  }

}
