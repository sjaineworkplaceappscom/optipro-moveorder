import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { FgrmscanchildinputformService } from "src/app/services/fgrmscanchildinputform.service";

@Component({
  selector: 'app-fgrmscanchildinputform',
  templateUrl: './fgrmscanchildinputform.component.html',
  styleUrls: ['./fgrmscanchildinputform.component.scss']
})
export class FgrmscanchildinputformComponent implements OnInit {
  @Input() basicDetailFrmParentInput:any;
  @Input() detailsOfParentinputFrm:any;
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
  constructor(private FGRMinput:FgrmscanchildinputformService) { }
  
  @Output() messageEvent = new EventEmitter<string>();
  
  ngOnInit() {
    this.CompanyDBId = sessionStorage.getItem('selectedComp');
    this.loggedInUser = sessionStorage.getItem('loggedInUser');
    console.log(this.basicDetailFrmParentInput)
    //console.log("THAT COMP OVER");
    console.log(this.detailsOfParentinputFrm);

  }

  showLevelChild(){
    document.getElementById('opti_QtylevelChildID').style.display = 'block';
    document.getElementById('opti_qtylevelSuperchildID').style.display = 'none';
  }

  //Events
  onChildCompItemBlur(){
    //First we will check whether the child component Item code entered is valid and get its details
    if(this.psChildCompItemCode != null){
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
          }
        }
      )

    }
  }

  //This will check the bat / serial enterd by user
  onChildCompBatchSerBlur(){
    if(this.psChildCompBatchSer != null){
      this.FGRMinput.CheckIfValidBatchSerialComponentEntered(this.CompanyDBId,this.sChildWhse,this.sChildBin,this.psChildCompBatchSer,this.psChildCompItemCode).subscribe(
        data=> {
          if(data != null){
            if(data.length > 0){
              this.iSysNum = data[0].SYSNUMBER;
            }
            else{
              alert("It does'nt belong to this item or it is consumed")            
            }
          }
        }
      )
    }
  }

  //on Save row press
  onRMAddRowPress(){
    //This json row will be added to the grid present in the parent form of this one
    let sendRMRowToParent: any = {
      OPTM_SEQ: '',
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
    this.messageEvent.emit(sendRMRowToParent);
  }
  //Core Functions
  

}
