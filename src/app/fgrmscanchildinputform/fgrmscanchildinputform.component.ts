import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { FgrmscanchildinputformService } from "src/app/services/fgrmscanchildinputform.service";
import { isWorkbookOptions } from '@progress/kendo-angular-excel-export';

@Component({
  selector: 'app-fgrmscanchildinputform',
  templateUrl: './fgrmscanchildinputform.component.html',
  styleUrls: ['./fgrmscanchildinputform.component.scss']
})
export class FgrmscanchildinputformComponent implements OnInit {
  @Input() basicDetailFrmParentInput:any;
  @Input() detailsOfParentinputFrm:any;
  @Input() childGridDataArray:any;
  @Input() rowChildEditFrmParentInpt:any;
  psChildCompItemCode:string = '';
  psChildCompBatchSer:string = '';
  CompanyDBId:string = '';
  iQty:number=0;
  bIsReject:boolean;
  bIsNC:boolean;
  sChildBin:string;
  sChildWhse:string;
  iChildQtyInInventory:number;
  sChildManagedBy:string;
  childCompItemCodeDetls:any;
  loggedInUser:string;
  iSysNum:number;  
  seqNo:any;
  showLoader:boolean = false;
  bIsInEditMode:boolean = false;
  constructor(private FGRMinput:FgrmscanchildinputformService) { }
  
  @Output() messageEvent = new EventEmitter<string>();
  
  ngOnInit() {
    this.CompanyDBId = sessionStorage.getItem('selectedComp');
    this.loggedInUser = sessionStorage.getItem('loggedInUser');
    
    //Take if is in edit mode
    if(this.rowChildEditFrmParentInpt !=null){
      if(this.rowChildEditFrmParentInpt.length > 0){
        this.bIsInEditMode = true;
        this.psChildCompItemCode = this.rowChildEditFrmParentInpt[0].ChildItemCode
        this.psChildCompBatchSer = this.rowChildEditFrmParentInpt[0].ChildBatchSerNo
        this.iQty = this.rowChildEditFrmParentInpt[0].Qty,
        this.seqNo = this.rowChildEditFrmParentInpt[0].SequenceNo
        this.sChildManagedBy = this.rowChildEditFrmParentInpt[0].ManagedBy
      }
    }
  }

  showLevelChild(){
    document.getElementById('opti_QtylevelChildID').style.display = 'block';
    document.getElementById('opti_qtylevelSuperchildID').style.display = 'none';
  }

  //Events
  onChildCompItemBlur(){
    this.showLoader = true;
    //First we will check whether the child component Item code entered is valid and get its details
    if(this.psChildCompItemCode != null && this.psChildCompItemCode.length > 0){
      this.FGRMinput.CheckIfChildCompExists(this.CompanyDBId,this.basicDetailFrmParentInput[0].ItemCode,this.psChildCompItemCode,this.basicDetailFrmParentInput[0].WorkOrderNo,this.basicDetailFrmParentInput[0].OperNo).subscribe(
        data=> {
          if(data != null){
            //The entire details of item will be fetched here
            this.childCompItemCodeDetls = data;
            
            //if the item not exists then we will give error 
            if(this.childCompItemCodeDetls[0].isChildComExists == "False"){
              alert("The item code does'nt exists");
              this.psChildCompItemCode = '';
            }
            //if all ok then will fill another details of the item code 
            else{
                  this.sChildBin = this.childCompItemCodeDetls[0].Bin
                  this.sChildWhse = this.childCompItemCodeDetls[0].WareHouse
                  this.sChildManagedBy = this.childCompItemCodeDetls[0].ManagedBy
                }
                this.showLoader = false;
          }
          else{
            this.showLoader = false;
          }
        }
      )

    }
  }

  //This will check the bat / serial enterd by user
  onChildCompBatchSerBlur(){
    this.showLoader = true;
    if(this.psChildCompBatchSer != null && this.psChildCompBatchSer.length > 0){
      this.FGRMinput.CheckIfValidBatchSerialComponentEntered(this.CompanyDBId,this.sChildWhse,this.sChildBin,this.psChildCompBatchSer,this.psChildCompItemCode).subscribe(
        data=> {
          if(data != null){
            if(data.length > 0){
              this.iSysNum = data[0].SYSNUMBER;
            }
            else{
              alert("It does'nt belong to this item or it is consumed");            
            }
            
            this.showLoader = false;
          }
          else{
            this.showLoader = false;
          }
        }
      )
    }
  }

  //on Save row press
  onRMAddRowPress(){
    let sendRMRowToParent: any;

      // if(this.bIsInEditMode == false){
        //This means it is in edit mode so prepare array for updation
      // else{
      //   //This json row will use to update the child data
      //   sendRMRowToParent = {
      //     OPTM_SEQ: this.seqNo,
      //     OPTM_ITEMCODE: this.psChildCompItemCode,
      //     OPTM_BTCHSERNO: this.psChildCompBatchSer,
      //     OPTM_QUANTITY: this.iQty,
      //     ManagedBy: this.sChildManagedBy
      //   }

      // }

       if(this.bIsInEditMode == false){
    if(this.checkIfChildComponentsExists() == false)
    {
    
        //This json row will be added to the grid present in the parent form of this one
        sendRMRowToParent = {
          OPTM_SEQ: 0,
          OPTM_ITEMCODE: this.psChildCompItemCode,
          OPTM_BTCHSERNO: this.psChildCompBatchSer,
          OPTM_QUANTITY:this.iQty,
          OPTM_BINNO: this.sChildBin,
          OPTM_WHSCODE: this.sChildWhse,
          ManagedBy: this.sChildManagedBy,
          CompanyDBId :this.CompanyDBId,
          WorkOrder : this.basicDetailFrmParentInput[0].WorkOrderNo,
          ParentBatchSerial: this.detailsOfParentinputFrm.ParentBatchSer,
          User: this.loggedInUser,
          OperNo: this.detailsOfParentinputFrm.OperNo,
          SysNumber: this.iSysNum
        };

    //check that the entered data is not duplicate before pushing into array
    let isEntryExists = this.childGridDataArray.some(e => e.OPTM_BTCHSERNO === this.psChildCompBatchSer && e.OPTM_ITEMCODE == e.psChildCompItemCode);

    //if the entry is new then ok else we will stop
    if(isEntryExists == false){
      this.messageEvent.emit(sendRMRowToParent);
    }
    else{
      alert("The item code with this serial/batch already exsits")
      this.psChildCompBatchSer = '';
      this.psChildCompItemCode = '';
    }

    this.showLevelChild();

    }
    else{
      alert("Item componenent with this batch/serial already exists");
    }
  }
  //update/edit Mode
  else{
     //This json row will use to update the child data
        sendRMRowToParent = {
          OPTM_SEQ: this.seqNo,
          OPTM_ITEMCODE: this.psChildCompItemCode,
          OPTM_BTCHSERNO: this.psChildCompBatchSer,
          OPTM_QUANTITY: this.iQty,
          ManagedBy: this.sChildManagedBy,
          LoggedInUser:this.loggedInUser
        }
        this.messageEvent.emit(sendRMRowToParent);
        this.showLevelChild();
  }
  }
  //Core Functions
  checkIfChildComponentsExists(){
    let isCompExists = false;
    if(this.childGridDataArray != null && this.childGridDataArray.length > 0){
      isCompExists = this.childGridDataArray.some(e => e.OPTM_ITEMCODE == this.psChildCompItemCode && e.OPTM_BTCHSERNO == this.psChildCompBatchSer);  
    }
    
    return isCompExists;
  }
}
