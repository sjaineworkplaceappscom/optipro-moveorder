import { Component, OnInit, Input, ViewChild, HostListener, EventEmitter, Output } from '@angular/core';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import { FgrmscanparentinputformService } from '../services/fgrmscanparentinputform.service';
import { FgrmscanchildinputformComponent } from "../fgrmscanchildinputform/fgrmscanchildinputform.component";
import { UIHelper } from 'src/app/helpers/ui.helpers';
import { BaseClass } from 'src/app/classes/BaseClass'
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';

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
  oSaveData: any = {};
  sendFGDatatoParent : any;
  detailsOfParentToChild: any;
  showFGRMScanChildInsertPopup: boolean = false;
  loggedInUser: string = '';
  CompanyDBId: string = '';
  psItemManagedBy: string = '';
  ManagedBy: string = '';
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
  public RefId: number = 0;
  constructor(private qtyWithFGScanDtl: QtyWithFGScanService, private fgrmParentForm: FgrmscanparentinputformService, private toastr: ToastrService,private commonService: CommonService) { }
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

          else if (this.FGWithScanGridFrmMaster[rowCount].OPTM_NC == false && this.FGWithScanGridFrmMaster[rowCount].OPTM_REJECT == false) {
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
   // this.messageEvent.emit("FromFGRMScanParentInputForm");
    this.messageEvent.emit(this.sendFGDatatoParent);
  }
  ngOnChange() {
    this.clearValues();
  }
  ngOnInit() {

    this.language = JSON.parse(window.localStorage.getItem('language'));
    this.ManagedBy = window.localStorage.getItem('ManagedBy');
    this.gridHeight = UIHelper.getMainContentHeight();

    this.fgrmParentForm.updateHeader();

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
        this.RefId = this.rowDataFrmFGWithScan[0].RefId;

        //If screen is in edit mode then will get all childs
        //this.GetAllChildByParentId();
        this.getSavedChild();
      }
      else {
        this.bIsInEditMode = false;
      }
    }
  }

  getSavedChild(){
    let tempArr;
    let temStr = window.localStorage.getItem('SaveFGData');
    if(temStr != '' && temStr != undefined){
      tempArr = JSON.parse(window.localStorage.getItem('SaveFGData'));
      let MgBy = window.localStorage.getItem('ManagedBy');

     // if(MgBy == 'Batch'){
        let childArr = [];
        for(let i=0; i<tempArr.ChildDataToSave.length; i++){
         if(tempArr.ChildDataToSave[i].ParentBatchSerial == this.psBatchSer && tempArr.ChildDataToSave[i].RefId == this.RefId ) {
            childArr.push(tempArr.ChildDataToSave[i]);
        }
      }
      this.ChildCompGridData = childArr;
      // }
      // else{
      //   this.ChildCompGridData = tempArr.ChildDataToSave;
      // }     
    }   
    console.log(this.ChildCompGridData);
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
          if(this.chkIfFGBatSerAlreadyExists() == false){
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
    
  // if(this.FGWithScanGridFrmMaster != null && this.ManagedBy == "Batch" && this.bIsEdit && this.bIsRejected){
  //     for (let rowCount in this.FGWithScanGridFrmMaster) {
  //       if (this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer && this.FGWithScanGridFrmMaster[rowCount].OPTM_REJECT) {
  //         this.toastr.warning('', 'Batch is already present in Rejected state', this.baseClassObj.messageConfig);
  //         let cbRej = document.getElementById("opti_bIsRejectedID") as HTMLInputElement;
  //         cbRej.checked = false;
  //         this.bIsRejected = false;
  //         return false;
  //       }
  //     }
  //   }

    if (this.bIsRejected){

      this.bIsRejected = true;
    }      
    else{
      this.bIsRejected = false;
    }     
    this.bIsNC = false;
  }
  onIsNCCheck() {

    // if(this.FGWithScanGridFrmMaster != null && this.ManagedBy == "Batch" && this.bIsEdit && this.bIsNC){
    //   for (let rowCount in this.FGWithScanGridFrmMaster) {
    //     if (this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer && this.FGWithScanGridFrmMaster[rowCount].OPTM_NC) {
    //       this.toastr.warning('', 'Batch is already present in NC state', this.baseClassObj.messageConfig);
    //       let cbNC = document.getElementById("opti_bIsNCID") as HTMLInputElement;
    //       cbNC.checked = false;
    //       this.bIsNC = false;
    //       return false;
    //     }
    //   }
    // }


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

     let rowPresent = this.ChildCompGridData.some(e => e.OPTM_ITEMCODE == $event.OPTM_ITEMCODE && e.OPTM_BTCHSERNO == $event.OPTM_BTCHSERNO);  

     if(rowPresent){
      for (let iRowCount in this.ChildCompGridData) {
        if (this.ChildCompGridData[iRowCount].OPTM_ITEMCODE == $event.OPTM_ITEMCODE && 
          $event.OPTM_BTCHSERNO == this.ChildCompGridData[iRowCount].OPTM_BTCHSERNO) {

          this.ChildCompGridData[iRowCount].OPTM_ITEMCODE = $event.OPTM_ITEMCODE
          this.ChildCompGridData[iRowCount].OPTM_BTCHSERNO = $event.OPTM_BTCHSERNO
          this.ChildCompGridData[iRowCount].OPTM_QUANTITY = Number($event.OPTM_QUANTITY)
          
        }         
      }
     }
     else{
      this.ChildCompGridData.push($event);
     }

      // if (this.bIsRMGridInEditMode == false) {
      //  let temp = window.localStorage.getItem('ManagedBy');
      //   // if( temp == 'Batch'){
      //   //   if(this.bIsRejected)
      //   // }           
      //   this.ChildCompGridData.push($event);
      // }
      // //if is in edit mode then
      // else {
      //   for (let iRowCount in this.ChildCompGridData) {
      //     if ($event.OPTM_SEQ == this.ChildCompGridData[iRowCount].OPTM_SEQ &&
      //       this.ChildCompGridData[iRowCount].OPTM_ITEMCODE == $event.OPTM_ITEMCODE) {
      //       this.ChildCompGridData[iRowCount].OPTM_ITEMCODE = $event.OPTM_ITEMCODE
      //       this.ChildCompGridData[iRowCount].OPTM_BTCHSERNO = $event.OPTM_BTCHSERNO
      //       this.ChildCompGridData[iRowCount].OPTM_QUANTITY = Number($event.OPTM_QUANTITY)
            
      //     }         
      //   }
      // }
    }
    //To clear the array after call backing from the child form
    this.rowDataForChildEdit = [];

    //To hide the child input form
    this.showFGRMScanChildInsertPopup = false;
  }

  //This function will save the final data for a single FG Batch/Serial
  onFinalSavePress() {

    if(this.FGWithScanGridFrmMaster != null && this.ManagedBy == "Batch"){
      if(this.bIsEdit){

        if(!this.bIsRejected && !this.bIsNC){
          for(let i=0; i<this.FGWithScanGridFrmMaster.length; i++){
            if(this.FGWithScanGridFrmMaster[i].RefId != this.RefId && !this.FGWithScanGridFrmMaster[i].OPTM_NC && !this.FGWithScanGridFrmMaster[i].OPTM_REJECT){
              this.toastr.warning('', this.language.item_already_present, this.baseClassObj.messageConfig);
              return false;
            }
          }          
        }
        else {
         for (let rowCount in this.FGWithScanGridFrmMaster) {
          if (this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO.toUpperCase() == this.psBatchSer.toUpperCase() && this.FGWithScanGridFrmMaster[rowCount].RefId != this.RefId) {
            if((this.FGWithScanGridFrmMaster[rowCount].OPTM_NC && this.bIsNC) || (this.FGWithScanGridFrmMaster[rowCount].OPTM_REJECT && this.bIsRejected ) ){
              this.toastr.warning('', this.language.item_already_present, this.baseClassObj.messageConfig);
              return false;
              }
            }            
          }
        }
      }
      else{

        if(!this.bIsRejected && !this.bIsNC){
          for(let i=0; i<this.FGWithScanGridFrmMaster.length; i++){
            if(!this.FGWithScanGridFrmMaster[i].OPTM_NC && !this.FGWithScanGridFrmMaster[i].OPTM_REJECT){
              this.toastr.warning('', this.language.item_already_present, this.baseClassObj.messageConfig);
              return false;
            }
          }          
        }

        else{
          for (let rowCount in this.FGWithScanGridFrmMaster) {
          if (this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO.toUpperCase() == this.psBatchSer.toUpperCase()) {
            if((this.FGWithScanGridFrmMaster[rowCount].OPTM_NC && this.bIsNC) || (this.FGWithScanGridFrmMaster[rowCount].OPTM_REJECT && this.bIsRejected)){
              this.toastr.warning('', this.language.item_already_present, this.baseClassObj.messageConfig);
              //this.psBatchSer = "";
              return false;
              }
            }            
          }
        }
      }     
    }
    

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
      
      this.ParentGridData = [{
        'SequenceNo': this.iSeqNo,
        'WorkOrderNo': this.basicFGInputForm[0].WorkOrderNo,
        'FGBatchSerial': this.psBatchSer,
        'Rejected': sIsRejected,
        'User': this.loggedInUser,
        'NC': sIsNC,
        'Item': this.basicFGInputForm[0].ItemCode,
        'Operation': this.basicFGInputForm[0].OperNo,
        'Quantity': Number(this.iQty),
        'CompanyDBId': this.CompanyDBId,
        'RefId': this.RefId
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
     
         //this.fgrmParentForm.SubmitDataforFGandRM(this.oModalData).subscribe(
          this.fgrmParentForm.CheckDataforFGandRM(this.oModalData).subscribe(
            data => {
              if (data != null) {

                if(data == "7001"){
                  this.commonService.RemoveLoggedInUser(this.language.session_expired);
                  return;
                }

                if (data == "attach_all_child_item") {
                  this.toastr.error('', this.language.attach_all_child, this.baseClassObj.messageConfig);
                  //this.showLevelParent();
                }
                else if (data.search("quantity of item") != -1) {
                  this.toastr.error('', data, this.baseClassObj.messageConfig);
                 // this.showLevelParent();
                }
                else if (data == "True") {

                  this.oSaveData.HeaderData = this.oModalData.HeaderData; 
                  let tempArr;                    
                  let temp = window.localStorage.getItem('SaveFGData');

                  if(!this.bIsEdit){
                    this.insertRefId();                    
                    if(temp != undefined && temp != null && temp != ''){                        
                      tempArr = JSON.parse(window.localStorage.getItem('SaveFGData'));

                      //child data
                      if(tempArr.ChildDataToSave != undefined && tempArr.ChildDataToSave != null){
                        for(let i=0; i<this.ChildCompGridData.length; i++){
                          tempArr.ChildDataToSave.push(this.ChildCompGridData[i])
                        }                      
                      }
                      else{
                          this.oSaveData.ChildDataToSave = this.ChildCompGridData;
                      }

                      //parent data
                      if(tempArr.ParentDataToSave != undefined && tempArr.ParentDataToSave != null){
                        for(let i=0; i<this.ParentGridData.length; i++){
                          tempArr.ParentDataToSave.push(this.ParentGridData[i])
                        }
                      }
                      else
                      {
                        this.oSaveData.ParentDataToSave = this.ParentGridData;
                      }
                      window.localStorage.setItem('SaveFGData', JSON.stringify(tempArr));                    
                  }
                  else{                   
                    this.oSaveData.ChildDataToSave = this.ChildCompGridData;
                    this.oSaveData.ParentDataToSave = this.ParentGridData;
                    window.localStorage.setItem('SaveFGData', JSON.stringify(this.oSaveData));
                  }
                }
                
                else{

                  if(temp != undefined && temp != null && temp != ''){                        
                    tempArr = JSON.parse(window.localStorage.getItem('SaveFGData'));
                    
                    const index = tempArr.ParentDataToSave.findIndex(val => val.RefId === this.RefId);
                    tempArr.ParentDataToSave[index] = this.ParentGridData[0]; 
                    
                    if(tempArr.ChildDataToSave != undefined && tempArr.ChildDataToSave != null && this.ChildCompGridData != undefined){
                     tempArr.ChildDataToSave = tempArr.ChildDataToSave.filter(val => val.RefId !== this.RefId); 
                      for(let i=0; i<this.ChildCompGridData.length; i++){
                        this.ChildCompGridData[i].RefId = this.RefId;
                        tempArr.ChildDataToSave.push(this.ChildCompGridData[i])
                      }  
                    }

                  window.localStorage.setItem('SaveFGData', JSON.stringify(tempArr));
                  
                  // let parentData = this.ParentGridData;
                  // tempArr.ParentDataToSave.filter(function(val,idx){
                  //   if(val.FGBatchSerial == parentData[0].FGBatchSerial && val.RefId == parentData[0].RefId){
                  //      tempArr.ParentDataToSave[idx] = parentData[0];
                  //   }
                  // })

                  // let childData = this.ChildCompGridData;
                  // tempArr.ChildDataToSave.filter(function(val,idx){
                  //  childData.filter(function(value,key){
                  //     if(val.OPTM_BTCHSERNO == value.OPTM_BTCHSERNO && val.ParentBatchSerial == value.ParentBatchSerial && val.RefId == value.RefId){
                  //       tempArr.ChildDataToSave[idx] = childData[key];
                  //     }
                  //   })
                  //  })
                 }
                }
                  
                  //this.GetAllChildByParentId();
                  // this.insertRefId();    
                  // this.oSaveData.HeaderData = this.oModalData.HeaderData; 
                  // let tempArr;                    
                  // let temp = window.localStorage.getItem('SaveFGData');
                  // if(temp != undefined && temp != null && temp != ''){
                  //     tempArr = JSON.parse(window.localStorage.getItem('SaveFGData'));
                  //     if(tempArr.ChildDataToSave != undefined && tempArr.ChildDataToSave != null && !this.bIsEdit){
                  //       for(let i=0; i<this.ChildCompGridData.length; i++){
                  //         tempArr.ChildDataToSave.push(this.ChildCompGridData[i])
                  //       }
                  //     }
                  //     else if(this.bIsEdit){
                  //       let childData = this.ChildCompGridData;
                  //       tempArr.ChildDataToSave.filter(function(val,idx){
                  //         childData.filter(function(value,key){
                  //           if(val.OPTM_BTCHSERNO == value.OPTM_BTCHSERNO && val.ParentBatchSerial == value.ParentBatchSerial && val.RefId == value.RefId){
                  //             tempArr.ChildDataToSave[idx] = childData[key];
                  //           }
                  //         })
                  //        })
                  //     }
                  //     else{
                  //       this.oSaveData.ChildDataToSave = this.ChildCompGridData;
                  //     }

                  //     if(tempArr.ParentDataToSave != undefined && tempArr.ParentDataToSave != null && !this.bIsEdit){
                  //       for(let i=0; i<this.ParentGridData.length; i++){
                  //         tempArr.ParentDataToSave.push(this.ParentGridData[i])
                  //       }
                  //     }
                  //     else if(this.bIsEdit){
                  //       let parentData = this.ParentGridData;
                  //       tempArr.ParentDataToSave.filter(function(val,idx){
                  //        if(val.FGBatchSerial == parentData[0].FGBatchSerial && val.RefId == parentData[0].RefId){
                  //         tempArr.ParentDataToSave[idx] = parentData[0];
                  //        }
                  //       })
                  //     }
                  //     else
                  //     {
                  //       this.oSaveData.ParentDataToSave = this.ParentGridData;
                  //     }
                  //     window.localStorage.setItem('SaveFGData', JSON.stringify(tempArr));
                  //  }
                  //  else{
                   
                  //   this.oSaveData.ChildDataToSave = this.ChildCompGridData;
                  //   this.oSaveData.ParentDataToSave = this.ParentGridData;
                  //   window.localStorage.setItem('SaveFGData', JSON.stringify(this.oSaveData));
                  //  }


                  this.sendFGDatatoParent = {
                    OPTM_SEQ: this.ParentGridData[0].SequenceNo,
                    OPTM_BTCHSERNO: this.ParentGridData[0].FGBatchSerial,
                    OPTM_QUANTITY: Number(this.ParentGridData[0].Quantity),
                    OPTM_REJECT: this.ParentGridData[0].Rejected == 'Y' ? true:false,
                    OPTM_NC: this.ParentGridData[0].NC == 'Y' ? true:false,
                    RefId: Number(this.ParentGridData[0].RefId)
                  }
                  
                  this.showLevelParent();
                }
                
                else {
                  this.toastr.error('', this.language.some_error, this.baseClassObj.messageConfig);
                  //this.GetAllChildByParentId();  
                  //this.showLevelParent();
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
    else {
      this.toastr.warning('', this.language.attach_batchserial_before_saving, this.baseClassObj.messageConfig);
    }
  }

  insertRefId(){    
    let temStr = window.localStorage.getItem('SaveFGData');
    let refidno = 0;
    if(temStr != '' && temStr != undefined){
    let tempArr = JSON.parse(window.localStorage.getItem('SaveFGData'));
    
    refidno = tempArr.ParentDataToSave[tempArr.ParentDataToSave.length-1].RefId;
    refidno += refidno;
    this.ParentGridData[0].RefId = refidno; 
    if(this.ChildCompGridData != undefined && this.ChildCompGridData != null){
      for(let i=0; i<this.ChildCompGridData.length;i++){
        this.ChildCompGridData[i].RefId = refidno;
      }
    }      
  }
   else{
    this.ParentGridData[0].RefId = 1;
   if(this.ChildCompGridData != undefined && this.ChildCompGridData != null){
    for(let i=0; i<this.ChildCompGridData.length;i++){
      this.ChildCompGridData[i].RefId = 1;
    }
   }
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

    // if (this.psItemManagedBy == "Batch") {
    //   return false;
    // }

    if (this.FGWithScanGridFrmMaster != null) {
      if (this.psItemManagedBy == "Batch") {
        // for (let rowCount in this.FGWithScanGridFrmMaster) {
        //   if (this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer) {
        //     if((this.FGWithScanGridFrmMaster[rowCount].OPTM_NC && this.bIsNC) || (this.FGWithScanGridFrmMaster[rowCount].OPTM_REJECT && this.bIsRejected) || (!this.bIsRejected && !this.bIsNC)){
        //       this.toastr.warning('', this.language.batch_same_state, this.baseClassObj.messageConfig);
        //       this.psBatchSer = "";
        //       return true;
        //      }
        //     }            
        //   }
        }
      else{
        for (let rowCount in this.FGWithScanGridFrmMaster) {
          if (this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer) {
            this.toastr.warning('', this.language.serial_already_exist, this.baseClassObj.messageConfig);
            this.psBatchSer = "";
            return true;
          }
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
    this.qtyWithFGScanDtl.checkIfFGSerBatisValid(this.CompanyDBId, this.psBatchSer, this.basicFGInputForm[0].WorkOrderNo, this.basicFGInputForm[0].ItemCode, this.basicFGInputForm[0].OperNo,this.psItemManagedBy).subscribe(
      data => {
        // if (data != null || data[0].ItemCheck != "") {
        if (data != null) {

          if (data.length > 0) {
            if (data[0].ErrMessage != undefined) {             
              this.commonService.RemoveLoggedInUser(this.language.session_expired);
              return;
            }
		      }

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
      },
      error => {
        if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
          this.commonService.unauthorizedToken(error);               
        }               
      }
    )
  }

  //This will get all childs of the parent batchserial enterd
  // GetAllChildByParentId() {
  //   this.showLoader = true;
  //   this.fgrmParentForm.GetAllChildByParentId(this.CompanyDBId, this.psBatchSer).subscribe(
  //     data => {
  //       if (data != null) {
  //         this.ChildCompGridData = data;
  //         this.showLoader = false;
  //       }
  //       else {
  //         this.showLoader = false;
  //       }
  //     },
  //     error => {
  //       if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
  //         this.commonService.unauthorizedToken(error);               
  //       }               
  //     }
  //   )
  // }

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
  // deleteRMDataBySeq(rowIndex) {
  //   this.showLoader = true;
  //   console.log(this.ChildCompGridData[rowIndex].OPTM_SEQ);
  //   this.fgrmParentForm.deleteRMDataBySeq(this.CompanyDBId, this.ChildCompGridData[rowIndex].OPTM_SEQ).subscribe(
  //     data => {
  //       if (data != null) {
  //         if (data == "True") {
  //           //After the Data Deletion the grid will refreshed by this
  //          //this.GetAllChildByParentId();
  //         }
  //         else {
  //           this.toastr.error('', this.language.failed_to_delete_data, this.baseClassObj.messageConfig);
  //           console.log("error-->" + data);
  //         }
  //         this.showLoader = false;
  //       }
  //       else {
  //         this.showLoader = false;
  //       }
  //     },
  //     error => {
  //       if(error.error.ExceptionMessage != null && error.error.ExceptionMessage != undefined){
  //         this.commonService.unauthorizedToken(error);               
  //       }               
  //     }
  //   )

  // }

}
