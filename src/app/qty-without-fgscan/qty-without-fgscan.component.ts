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
iNCQty:number =0.0;

constructor() { }
@Output() messageEvent = new EventEmitter<string>();

  ngOnInit() {
    this.iBalQty = this.basicDetailsFrmMO[0].BalQty;
    this.iAcceptedQty = this.basicDetailsFrmMO[0].ProducedQty;
  }
  

  onOKPress(){
    // this.optirightfixedsection.nativeElement.style.display = 'none';
    document.getElementById('opti_rightfixedsectionID').style.display = 'none';
  }

}
