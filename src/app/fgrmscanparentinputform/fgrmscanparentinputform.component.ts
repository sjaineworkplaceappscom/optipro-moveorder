import { Component, OnInit, Input, ViewChild, HostListener,EventEmitter, Output } from '@angular/core';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';
import {FgrmscanparentinputformService } from '../services/fgrmscanparentinputform.service';
import { FgrmscanchildinputformComponent } from "../fgrmscanchildinputform/fgrmscanchildinputform.component";
import { UIHelper } from 'src/app/helpers/ui.helpers';

@Component({
  selector: 'app-fgrmscanparentinputform',
  templateUrl: './fgrmscanparentinputform.component.html',
  styleUrls: ['./fgrmscanparentinputform.component.scss']
})
export class FgrmscanparentinputformComponent implements OnInit {
  @Input() rowDataFrmFGWithScan: any;
  @Input() FGWithScanGridFrmMaster: any;
  @Input() basicFGInputForm:any;
  @ViewChild(FgrmscanchildinputformComponent) child;
  basicDetailsToChildForm: any;
  ChildCompGridData:any = [];
  ParentGridData:any = [];
  oModalData:any = {};
  detailsOfParentToChild:any;
  showFGRMScanChildInsertPopup:boolean = false;
  loggedInUser:string='';
  CompanyDBId:string= '';
  psItemManagedBy:string='';
  bIsEdit:boolean = false;
  psBatchSer:string = '';
  iQty:number = 0;
  bIsRejected:any= false;
  bIsNC:any;
  iSeqNo:number;
  bIsInEditMode:boolean = false;
  public bothSelectionRestrict:boolean = false;
  public bIfBatSerEmpty:boolean = false;
  public bIfQtyIsZero = false;
  constructor(private qtyWithFGScanDtl: QtyWithFGScanService, private fgrmParentForm: FgrmscanparentinputformService) { }

  @Output() messageEvent = new EventEmitter<string>();


  gridHeight: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.gridHeight = UIHelper.getMainContentHeight();
  }


  @ViewChild('qtylevelChild') qtylevelChild;
  @ViewChild('qtylevelSuperchild') qtylevelSuperchild;
  showLevelSuperChild(){
    //While after putting all data for the FG input serial field the basic validations will be check here
    //This mehtod will retrun true if all things are OK and after we will navigate otherwise will throw error
    if(this.validateData() == true){
      this.detailsOfParentToChild = {
        ParentBatchSer:this.psBatchSer,
        ParentItemManagedBy:this.psItemManagedBy,
        OperNo:this.basicFGInputForm[0].OperNo
      };

      this.qtylevelChild.nativeElement.style.display = 'none';
      this.qtylevelSuperchild.nativeElement.style.display = 'block';

      this.showFGRMScanChildInsertPopup = true;


    }
  }

  showLevelParent(){
    document.getElementById('opti_QtylevelChildSuperChildID').style.display = 'none';
    document.getElementById('opti_QtylevelParentID').style.display = 'block';
  }

  ngOnInit() {

    this.gridHeight = UIHelper.getMainContentHeight();

    // Hide superchild section on initial
    this.qtylevelSuperchild.nativeElement.style.display = 'none';

    this.loggedInUser = sessionStorage.getItem('loggedInUser');
    console.log("On FG SCANC PARENT");
    console.log(this.basicFGInputForm)
    //console.log(this.rowDataFrmFGWithScan);
    this.basicDetailsToChildForm = this.basicFGInputForm;
    this.CompanyDBId = sessionStorage.getItem('selectedComp');

    //taking item managed by
    if(this.basicFGInputForm !=null){
      if(this.basicFGInputForm.length > 0){
        this.psItemManagedBy = this.basicFGInputForm[0].ManagedBy;
      }
    }

    //Disable/enalbe controls
    this.disableEnableControls();
    
    if(this.rowDataFrmFGWithScan !=null){
      if(this.rowDataFrmFGWithScan.length > 0){
        this.bIsEdit = true;
        this.bIsInEditMode = false;
        this.psBatchSer = this.rowDataFrmFGWithScan[0].FGBatchSerNo;
        this.iQty = this.rowDataFrmFGWithScan[0].Quantity;
        this.bIsRejected = this.rowDataFrmFGWithScan[0].IsRejected;
        this.bIsNC = this.rowDataFrmFGWithScan[0].IsNC;
        this.iSeqNo = this.rowDataFrmFGWithScan[0].SeqNo;
        this.psItemManagedBy = this.rowDataFrmFGWithScan[0].ItemManagedBy;

        //If screen is in edit mode then will get all childs
        this.GetAllChildByParentId();
      }
    }
  }

  //Events
  onBatchSerBlur(){
    if(this.psBatchSer != null){
      if(this.psBatchSer.length > 0){
        this.bIfBatSerEmpty = false;
         if(this.chkIfFGBatSerAlreadyExists() == false){
          this.validateFGSerBat();
         }
      }
      else{
        this.bIfBatSerEmpty = true;
      }
    }
  }

  onQtyBlur(){

    if(this.iQty <= 0 || this.iQty == undefined){
      this.bIfQtyIsZero = true;
    }
    else{
      this.bIfQtyIsZero = false;

      
    }
    
    
  }

  onIsRejectedCheck(){
    console.log(this.bIsRejected);
  }
  onIsNCCheck(){
    console.log(this.bIsNC);
  }

  //This event will recieve the data from its child input form
  receiveArrayRMRowData($event) {
      this.showFGRMScanChildInsertPopup = false;
      this.ChildCompGridData.push($event);
  }

  //This function will save the final data for a single FG Batch/Serial
  onFinalSavePress(){
    let sIsRejected;
    let sIsNC;
    //gather the Parent FG Data here
   if(this.bIsRejected == true){
        sIsRejected = 'Y';
   }
   else{
        sIsRejected = 'N';
   }

   if(this.bIsNC == true){
        sIsNC = 'Y';
   }
   else{
        sIsNC = 'N';
   }
  
   if(this.iSeqNo == undefined || this.iSeqNo == null){
     this.iSeqNo =0;
   }

   //this.oModalData.ABC = [{'keyNAME':'ashish'},{'keyNAME':'rmaesh'}]
   this.ParentGridData = [{ 
                            'SequenceNo':this.iSeqNo,
                            'WorkOrder': this.basicFGInputForm[0].WorkOrderNo,
                            'FGBatchSerial':this.psBatchSer,
                            'Rejected':sIsRejected,
                            'User':this.loggedInUser,
                            'NC':sIsNC,
                            'Item':this.basicFGInputForm[0].ItemCode,
                            'Operation':this.basicFGInputForm[0].OperNo,
                            'Quantity':this.iQty,
                            'CompanyDBId':this.CompanyDBId
                          }]

   this.oModalData.HeaderData = [{CompanyDBId:this.CompanyDBId}]                        
   this.oModalData.ChildDataToSave = this.ChildCompGridData
   this.oModalData.ParentDataToSave = this.ParentGridData
      this.fgrmParentForm.SubmitDataforFGandRM(this.oModalData).subscribe(
        data=> {
              if(data !=null){
                if(data == "True"){
                  alert("Data saved sucessfully");
                  //Now call the parent componet by event emitter here
                  this.messageEvent.emit("FromFGRMScanParentInputForm");
                  this.GetAllChildByParentId();
                }
                else{
                  alert("There was some error while submitting data"); 
                  this.GetAllChildByParentId();                 
                }
                
              }
            }
    )

    this.showLevelParent();

  }

  removeHandler({ rowIndex }){
      this.deleteRMDataBySeq(rowIndex);
  }
  editHandler({ rowIndex }){}
  //Core Functions
  disableEnableControls(){
    // if(this.bIsEdit == true){
    //   // if(this.basicDetailsFrmFGWithScan[0].itemType == "Serial"){
    //   //   this.isQtyDisabled = true;
    //   // }
    // }
    // else{
    //       this.bIsInEditMode = false;
    // }
  }

  //this will chk if the data we are adding is duplicate
  chkIfFGBatSerAlreadyExists(){
      if(this.FGWithScanGridFrmMaster !=null){
            for(let rowCount in this.FGWithScanGridFrmMaster){
              if(this.FGWithScanGridFrmMaster[rowCount].OPTM_BTCHSERNO == this.psBatchSer)
              {
                  alert("Serial/Batch already exist");
                  this.psBatchSer = "";
                  return true;
              }
            }
            return false;
        }
        else{
          return false;
        }
}
  //This will validate the FG Ser Batch
  validateFGSerBat(){ 
        this.qtyWithFGScanDtl.checkIfFGSerBatisValid(this.CompanyDBId,this.psBatchSer,this.basicFGInputForm[0].WorkOrderNo,this.basicFGInputForm[0].ItemCode,this.basicFGInputForm[0].OperNo).subscribe(
          data=> {
          if(data[0].ItemCheck =="ItemExists")
          {
            //If entered bat ser is wright then will fetch its child 
            //this.GetAllChildByParentId();
          }
          else if(data[0].ItemCheck =="ItemNotExists"){
            alert("FG Bat/Ser you are entering is not valid");
            this.psBatchSer = '';
          }
          else{
            alert("some error occured");
          }
      }
    )
  }

  //This will get all childs of the parent batchserial enterd
  GetAllChildByParentId(){
    this.fgrmParentForm.GetAllChildByParentId(this.CompanyDBId,this.psBatchSer).subscribe(
      data=> {
        if(data != null){
          this.ChildCompGridData = data;
        }
      }
    )
  }

  validateData(){
    //Check whether the input is not empty
    if(this.psBatchSer == '' || this.psBatchSer == null){
      this.bIfBatSerEmpty = true;
      return false;
    }
    else{
      this.bIfBatSerEmpty = false;
    }
    

    //Check whether the qty is not empty
    if(this.iQty <= 0 || this.iQty == undefined){
      this.bIfQtyIsZero = true;
      return false;
    }
    else{
      this.bIfQtyIsZero = false;
    }


    //Check if selection is of both is done
    if(this.bIsNC == true && this.bIsRejected == true){
      this.bothSelectionRestrict = true;
      return false;
    }
    else{
      this.bothSelectionRestrict = false;
    }

    return true;
  }

  //to delete the RM
  deleteRMDataBySeq(rowIndex){
    console.log(this.ChildCompGridData[rowIndex].OPTM_SEQ);
    this.fgrmParentForm.deleteRMDataBySeq(this.CompanyDBId,this.ChildCompGridData[rowIndex].OPTM_SEQ).subscribe(

      
      data=> {
        if(data!=null){
          if(data == "True")  {
            alert("Data deleted");
            //After the Data Deletion the grid will refreshed by this
            this.GetAllChildByParentId();
          }
          else{
            alert("Failed to delete data");
          }
         }
      }
    )

  }

}
