import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { FgrmscanchildinputformService } from "src/app/services/fgrmscanchildinputform.service";
import { BaseClass } from 'src/app/classes/BaseClass'
import { ToastrService } from 'ngx-toastr';
import { QtyWithFGScanService } from '../services/qty-with-fg-scan.service';

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
  iQty:number = 1;
  bIsReject:boolean;
  bIsNC:boolean;
  sChildBin:string;
  sChildWhse:string;
  iChildQtyInInventory:number;
  sChildManagedBy:string;
  childCompItemCodeDetls:any;
  sendRMRowToParent: any;
  loggedInUser:string;
  iSysNum:number;  
  seqNo:any;
  showLoader:boolean = false;
  bIsInEditMode:boolean = false;
  public bIsChildItemCodeEmpty:boolean = false;
  public disableChildBatSerEmpty:boolean = false;
  public disableQtyField:boolean = false;
  public iChildInventory:any;
  public bIsQtyIsZero:boolean = false;
  public bIsChildBatSerEmpty = false;
  private baseClassObj = new BaseClass();
  constructor(private qtyWithFGScanDtl: QtyWithFGScanService,private FGRMinput:FgrmscanchildinputformService,private toastr: ToastrService) { }
  
  @Output() messageEvent = new EventEmitter<string>();
  
  ngOnInit() {
    this.CompanyDBId = sessionStorage.getItem('selectedComp');
    this.loggedInUser = sessionStorage.getItem('loggedInUser');
    
    this.psChildCompItemCode="";
    this.psChildCompBatchSer="";
    this.iQty = 1;
    this.sChildBin = "";
    this.sChildWhse = "";
    this.sChildManagedBy = "";

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
    this.messageEvent.emit(this.sendRMRowToParent);
  }

  //Events
  onChildCompItemBlur(){
    var inputValue = (<HTMLInputElement>document.getElementById('psChildCompItemCodeID')).value;
    if(inputValue.length>0){
      this.psChildCompItemCode = inputValue;
//This function will get the decoded string
      this.getDecodedString();
    }
    this.showLoader = true;
    //First we will check whether the child component Item code entered is valid and get its details
    if(this.psChildCompItemCode != ""){
      this.FGRMinput.CheckIfChildCompExists(this.CompanyDBId,this.basicDetailFrmParentInput[0].ItemCode,this.psChildCompItemCode,this.basicDetailFrmParentInput[0].WorkOrderNo,this.basicDetailFrmParentInput[0].OperNo).subscribe(
        data=> {
          if(data != null){
            this.bIsChildItemCodeEmpty = false;
            this.disableChildBatSerEmpty = false;
            //The entire details of item will be fetched here
            this.childCompItemCodeDetls = data;
            
            //if the item not exists then we will give error 
            if(this.childCompItemCodeDetls[0].isChildComExists == "False"){
              this.disableChildBatSerEmpty = true;
              this.toastr.error('',"The item code does'nt exists",this.baseClassObj.messageConfig);
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
    else{
      this.showLoader = false;
      this.bIsChildItemCodeEmpty = true;
    }
  }

  //This will check the bat / serial enterd by user
  onChildCompBatchSerBlur(){
    this.showLoader = true;
    if(this.psChildCompBatchSer != ""){
      this.FGRMinput.CheckIfValidBatchSerialComponentEntered(this.CompanyDBId,this.sChildWhse,this.sChildBin,this.psChildCompBatchSer,this.psChildCompItemCode).subscribe(
        data=> {
          if(data != null){
            if(data.length > 0){
              this.bIsChildBatSerEmpty = false;
              //If the Child Item code is Batch Tracked
              if(this.sChildManagedBy == "Batch"){
                //enable qty field if batch 
                this.disableQtyField = false;

                if(data[0].TOTALQTY == ""){
                  this.toastr.error('','No inventory found for '+ this.psChildCompBatchSer,this.baseClassObj.messageConfig);
                }
                else{
                  this.iChildInventory = data[0].TOTALQTY;
                }

              }
              //If the Child Item code is Serial Tracked
            if(this.sChildManagedBy == "Serial"){
              //disable qty field if serial and set qty to 1
              this.disableQtyField = true;
              

              if(data[0].TOTALQTY == ""){
                this.toastr.error('','No inventory found for '+ this.psChildCompBatchSer,this.baseClassObj.messageConfig);
              }
              else{
                this.iQty = data[0].TOTALQTY;
              }
            }

              //Get the sysnumber of the child item code
              this.iSysNum = data[0].SYSNUMBER;
            }
            else{
              this.toastr.error('',"It does'nt belong to this item or it is consumed",this.baseClassObj.messageConfig);  
              this.psChildCompBatchSer = '';     
            }
            
            this.showLoader = false;
          }
          else{
            this.showLoader = false;
          }
        }
      )
    }
    else{
      this.showLoader = false;
      this.bIsChildBatSerEmpty = true;
    }
  }

  //on Save row press
  onRMAddRowPress(){
    
       if(this.bIsInEditMode == false){
    if(this.checkIfChildComponentsExists() == false)
    {
    
        //This json row will be added to the grid present in the parent form of this one
        this.sendRMRowToParent = {
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

    // //check that the entered data is not duplicate before pushing into array
    // let isEntryExists = this.childGridDataArray.some(e => e.OPTM_BTCHSERNO === this.psChildCompBatchSer && e.OPTM_ITEMCODE == e.psChildCompItemCode);

    // //if the entry is new then ok else we will stop
    // // if(isEntryExists == false){
    // //   this.messageEvent.emit(this.sendRMRowToParent);
    // // }
    // if(isEntryExists == true){
    //   //alert("The item code with this serial/batch already exsits")
    //   this.toastr.error('',"The item code with this serial/batch already exsits",this.baseClassObj.messageConfig);    
    //   this.psChildCompBatchSer = '';
    //   this.psChildCompItemCode = '';
    // }

    this.showLevelChild();

    }
    else{
      //alert("Item componenent with this batch/serial already exists");
      this.toastr.error('',"The item code with this serial/batch already exsits",this.baseClassObj.messageConfig); 
    }

    
  }
  //update/edit Mode
  else{
     //This json row will use to update the child data
        this.sendRMRowToParent = {
          OPTM_SEQ: this.seqNo,
          OPTM_ITEMCODE: this.psChildCompItemCode,
          OPTM_BTCHSERNO: this.psChildCompBatchSer,
          OPTM_QUANTITY: this.iQty,
          ManagedBy: this.sChildManagedBy,
          LoggedInUser:this.loggedInUser
        }
        //this.messageEvent.emit(this.sendRMRowToParent);
        this.showLevelChild();
  }
  }

  //OnQty blur this will be called
  onQuantityBlur(){
      //If qty is greater than zero
      if(this.iQty > 0){
        this.bIsQtyIsZero = false;

        //chk for the managed by
        if(this.sChildManagedBy == "Serial"){
          if(this.iChildInventory < this.iQty){
            this.toastr.warning('',"Quantity can't be greater than inventory quantity",this.baseClassObj.messageConfig);       
            this.iQty = 1;
          }
        }
        if(this.sChildManagedBy =="Batch"){
          if(this.iChildInventory < this.iQty){
            this.toastr.warning('',"Quantity can't be greater than inventory quantity",this.baseClassObj.messageConfig);       
            this.iQty = 1;
          }

        }
        
      }
      else{
        this.bIsQtyIsZero = true;
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

  //Get Decoded String
  getDecodedString(){
    this.showLoader = true;
    this.qtyWithFGScanDtl.getDecodedString(this.CompanyDBId,this.psChildCompItemCode).subscribe(
      data=> {
        if(data!=null){
        this.showLoader = false;
         console.log("DECODED DATA GOT FROM--->");
         if(data.length > 0){
            console.log("response data"+data);
            this.psChildCompItemCode = "";
            this.iQty = 1;
         }
         }
      }
  )
  }
}
