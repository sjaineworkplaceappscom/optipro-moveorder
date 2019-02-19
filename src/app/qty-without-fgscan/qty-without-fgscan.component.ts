import { Component, OnInit,Input,EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-qty-without-fgscan',
  templateUrl: './qty-without-fgscan.component.html',
  styleUrls: ['./qty-without-fgscan.component.scss']
})
export class QtyWithoutFGScanComponent implements OnInit {
@Input() basicDetailsFrmMO: any;
iBalQty:number = 0.0;
iAcceptedQty:number = 0.0;
iRejectedQty:number = 0.0;
iNCQty:number = 0.0;
iSum:number = 0.0;
allSum:number = 0.0;
diff:number = 0.0;
diffFlag: number = 0.0;
negativeQty:boolean = false;
sumOfQty:boolean = false;
public language: any;

constructor() { }
@Output() messageEvent = new EventEmitter<string>();

  ngOnInit() {
    this.language = JSON.parse(window.localStorage.getItem('language'));
    this.iBalQty = parseFloat(this.basicDetailsFrmMO[0].BalQty);
    this.iAcceptedQty = parseFloat(this.basicDetailsFrmMO[0].ProducedQty);
  }

  //Events
  onOKPress(){   
    
    //We will get this values and push into this array to send back
    if(this.validateSumOfQtys() == true){
       // this.optirightfixedsection.nativeElement.style.display = 'none';
      document.getElementById('opti_rightfixedsectionID').style.display = 'none';
      document.getElementById('opti_QuantityRightSection').style.display = 'none';
      let QtySummary:any = {
        'BalQty': this.iBalQty,
        'AcceptedQty': this.iAcceptedQty,
        'RejectedQty': this.iRejectedQty,
        'NCQty': this.iNCQty
      };
      
      this.messageEvent.emit(QtySummary);
      //If data is ok then we will navigate back
       document.getElementById('opti_rightfixedsectionID').style.display = 'none';
    }
    else{
        return false;
    }
    
  }

  //On Accepeted Qty blur
  onAccepetedQtyBlur(){
    if(this.iAcceptedQty !=null){
        if(this.isQtyIsNegative(this.iAcceptedQty) == true){
          this.iAcceptedQty = 0;
        }
    }

    if(this.iAcceptedQty > this.iBalQty){
      this.iAcceptedQty = this.iBalQty;
      this.iRejectedQty = 0;
      this.iNCQty = 0;
      return;
    }

    this.allSum = this.iAcceptedQty + this.iRejectedQty + this.iNCQty;
    if(this.allSum > this.iBalQty){      
      this.diff = this.allSum - this.iBalQty;

     if(this.iRejectedQty > 0){
     // this.iRejectedQty = this.iRejectedQty - this.diff;
     this.diffFlag = this.iRejectedQty - this.diff;

      if(this.diffFlag > 0 || this.diffFlag == 0 ) {
        this.iRejectedQty = this.diffFlag;
      }
      else {
        this.iRejectedQty = 0;
        this.iNCQty = 0;
        this.iAcceptedQty = this.iBalQty;
      }
    }
     else if(this.iNCQty > 0){
      this.diffFlag = this.iNCQty - this.diff;
      if(this.diffFlag > 0 || this.diffFlag == 0 ) {
        this.iNCQty = this.diffFlag;
      }
      else {
        this.iNCQty = 0;
        this.iRejectedQty = 0;
        this.iAcceptedQty = this.iBalQty;
      }
    }
     else if(this.iAcceptedQty > this.iBalQty)
      this.iAcceptedQty = this.iBalQty;
    }
    
  }

  //On Rejected Qry blur
  onRejectQtyBlur(){
    if(this.iRejectedQty !=null){
      if(this.isQtyIsNegative(this.iRejectedQty) == true){
        this.iRejectedQty = 0;
      }
    }

    if(this.iRejectedQty > this.iBalQty){
      this.iRejectedQty = this.iBalQty;
      this.iAcceptedQty = 0;
      this.iNCQty = 0;
      return;
    }

    this.allSum = this.iAcceptedQty + this.iRejectedQty + this.iNCQty;
    if(this.allSum > this.iBalQty){  
      if(this.iAcceptedQty > 0) {    
        this.diff = this.allSum - this.iBalQty;
        this.diffFlag = this.iAcceptedQty - this.diff;
      
      if(this.diffFlag > 0 || this.diffFlag == 0) {
        this.iAcceptedQty = this.diffFlag;
      }
        else {
          this.iAcceptedQty = 0;
          this.iNCQty = 0;
          this.iRejectedQty = this.iBalQty;
        }

      }

     else if(this.iNCQty > 0){
      //this.iNCQty = this.iNCQty - this.diff;
      this.diffFlag = this.iNCQty - this.diff;
      if(this.diffFlag > 0 || this.diffFlag == 0) {
        this.iNCQty = this.diffFlag;
      }
      else {
        this.iNCQty = 0;
        this.iAcceptedQty = 0;
        this.iRejectedQty = this.iBalQty;
      }
     }
     else if(this.iRejectedQty > this.iBalQty)
      this.iRejectedQty = this.iBalQty;
    }
  }

  //On NC Qty blur
  onNCQtyBlur(){
    if(this.iNCQty !=null){
      if(this.isQtyIsNegative(this.iNCQty) == true){
        this.iNCQty = 0;
      }
    } 

    if(this.iNCQty > this.iBalQty){
      this.iNCQty = this.iBalQty;
      this.iAcceptedQty = 0;
      this.iRejectedQty = 0;
      return;
    }

    this.allSum = this.iAcceptedQty + this.iRejectedQty + this.iNCQty;
    if(this.allSum > this.iBalQty){      
      this.diff = this.allSum - this.iBalQty;

      if(this.iAcceptedQty > 0) {
        this.diffFlag = this.iAcceptedQty - this.diff;

        if(this.diffFlag > 0 || this.diffFlag == 0) {
          this.iAcceptedQty = this.diffFlag;
        }
        else {
          this.iAcceptedQty = 0;
          this.iRejectedQty = 0;
          this.iNCQty = this.iBalQty;
        }
        //this.iAcceptedQty = this.iAcceptedQty - this.diff;
      }
     else if(this.iRejectedQty > 0){
      //this.iRejectedQty = this.iRejectedQty - this.diff;
      this.diffFlag = this.iRejectedQty - this.diff;
      if(this.diffFlag > 0 || this.diffFlag == 0) {
        this.iRejectedQty = this.diffFlag;
      }
      else {
        this.iRejectedQty = 0;
        this.iAcceptedQty = 0;
        this.iNCQty = this.iBalQty;
      }
     }
     else if(this.iNCQty > this.iBalQty)
      this.iNCQty = this.iBalQty;
    }
    
  }

  //Core Functions
  //This will check the qty is negative or not 
  isQtyIsNegative(inputQty){
    if(inputQty < 0){
      this.negativeQty= true;
      return true;
    }
    else{
      this.negativeQty = false;
      return false;
    }
  }

  //This will check the sum of qty not to be greater then produced
  validateSumOfQtys(){
    this.iSum = this.iAcceptedQty + this.iRejectedQty + this.iNCQty;

    if(this.iSum > this.basicDetailsFrmMO[0].ProducedQty){
        this.sumOfQty = true;
        return false;
    }
    else{
        this.sumOfQty = false;
        return true;
    }    

  }
}