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

constructor() { }
@Output() messageEvent = new EventEmitter<string>();

  ngOnInit() {
    this.iBalQty = parseFloat(this.basicDetailsFrmMO[0].BalQty);
    this.iAcceptedQty = parseFloat(this.basicDetailsFrmMO[0].ProducedQty);
  }

  //Events
  onOKPress(){
    // this.optirightfixedsection.nativeElement.style.display = 'none';
    document.getElementById('opti_rightfixedsectionID').style.display = 'none';
    //We will get this values and push into this array to send back

    if(this.validateSumOfQtys() == true){
      let QtySummary:any = {
        'BalQty': this.iBalQty,
        'AcceptedQty': this.iAcceptedQty,
        'RejectedQty': this.iRejectedQty,
        'NCQty': this.iNCQty
      };
      
      this.messageEvent.emit(QtySummary);
    }
    else{
        return false;
    }
  }

  onAccepetedQtyBlur(){
    if(this.iAcceptedQty !=null){
        if(this.isQtyIsNegative(this.iAcceptedQty) == true){
          this.iAcceptedQty = 0;
        }
    }
  }

  onRejectQtyBlur(){
    if(this.iRejectedQty !=null){
      if(this.isQtyIsNegative(this.iRejectedQty) == true){
        this.iRejectedQty = 0;
      }
    }
  }

  onNCQtyBlur(){
    if(this.iNCQty !=null){
      if(this.isQtyIsNegative(this.iNCQty) == true){
        this.iNCQty = 0;
      }
    } 
  }

  //Core Functions
  //This will check the qty is negative or not 
  isQtyIsNegative(inputQty){
    if(inputQty < 0){
      alert("Qty should not be negative");
      return true;
    }
    else{
      return false;
    }
  }

  //This will check the sum of qty not to be greater then produced
  validateSumOfQtys(){
    this.iSum = this.iAcceptedQty + this.iRejectedQty + this.iNCQty

    if(this.iSum > this.basicDetailsFrmMO[0].ProducedQty){
        alert("Sum of accepted quantity and reject quantity should not equal to produced quantity");
        return false;
    }
    else{
        return true;
    } 
  }

  
}