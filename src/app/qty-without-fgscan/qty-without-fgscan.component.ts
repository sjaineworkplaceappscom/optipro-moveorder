import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-qty-without-fgscan',
  templateUrl: './qty-without-fgscan.component.html',
  styleUrls: ['./qty-without-fgscan.component.scss']
})
export class QtyWithoutFGScanComponent implements OnInit {
@Input() basicDetailsFrmMO: any;
iBalQty:number =0;
iAcceptedQty:number =0;
iRejectedQty:number =0;
iNCQty:number =0;
  constructor() { }
  
  ngOnInit() {
    this.iBalQty = this.basicDetailsFrmMO[0].BalQty;
  }

  onOKPress(){
    // this.optirightfixedsection.nativeElement.style.display = 'none';
    document.getElementById('opti_rightfixedsectionID').style.display = 'none';
  }

}
