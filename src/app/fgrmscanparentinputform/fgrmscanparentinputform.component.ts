import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
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
  constructor(private qtyWithFGScanDtl: QtyWithFGScanService, private fgrmParentForm: FgrmscanparentinputformService) { }


  gridHeight: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.gridHeight = UIHelper.getMainContentHeight();
  }


  @ViewChild('qtylevelChild') qtylevelChild;
  @ViewChild('qtylevelSuperchild') qtylevelSuperchild;
  showLevelSuperChild(){
    this.qtylevelChild.nativeElement.style.display = 'none';
    this.qtylevelSuperchild.nativeElement.style.display = 'block';
  }

  showLevelParent(){
    document.getElementById('opti_QtylevelChildSuperChildID').style.display = 'none';
    document.getElementById('opti_QtylevelParentID').style.display = 'block';
  }

  // showLevelChild(){
  //   this.qtylevelChild.nativeElement.style.display = 'block';
  //   this.qtylevelSuperchild.nativeElement.style.display = 'none';
  // }


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
        this.psBatchSer = this.rowDataFrmFGWithScan[0].FGBatchSerNo;
        this.iQty = this.rowDataFrmFGWithScan[0].Quantity;
        this.bIsRejected = this.rowDataFrmFGWithScan[0].IsRejected;
        this.bIsNC = this.rowDataFrmFGWithScan[0].IsNC;
        this.iSeqNo = this.rowDataFrmFGWithScan[0].SeqNo;
        this.psItemManagedBy = this.rowDataFrmFGWithScan[0].ItemManagedBy;
      }
    }
  }

  //Events
  onInsertChildRowPress(){
  //this.showFGRMScanChildInsertPopup = true;
  }

  onBatchSerBlur(){
    if(this.psBatchSer != null){
      if(this.psBatchSer.length > 0){
         if(this.chkIfFGBatSerAlreadyExists() == false){
          this.validateFGSerBat();
         }
      }
      else{
        alert("Enter valid batch/serial")
      }
    }
  }

  onQtyBlur(){
    this.detailsOfParentToChild = {
            ParentBatchSer:this.psBatchSer,
            ParentItemManagedBy:this.psItemManagedBy,
            OperNo:this.basicFGInputForm[0].OperNo
          };

          console.log("detailsOfParentToChild FILLED");
          console.log(this.detailsOfParentToChild);
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
   //this.oModalData.ABC = [{'keyNAME':'ashish'},{'keyNAME':'rmaesh'}]
   this.ParentGridData = [{ 
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
   console.log("OMODAL ADTA")
   console.log(this.oModalData)
      this.fgrmParentForm.SubmitDataforFGandRM(this.oModalData).subscribe(
        data=> {
              if(data !=null){
                if(data == true){
                  alert("Data saved sucessfully");
                }
                
              }
            }
    )

    this.showLevelParent();

  }
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
                  alert("Finished Good  Already Added");
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
            this.GetAllChildByParentId();
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
}
