import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../common.service';
import { SelectableSettings } from '@progress/kendo-angular-grid/dist/es2015/main';


@Component({
  selector: 'app-work-order-lookup',
  templateUrl: './work-order-lookup.component.html',
  styleUrls: ['./work-order-lookup.component.scss']
})
export class WorkOrderLookupComponent implements OnInit {

  @Input() height: number = 400;
  @Input() fillLookupArray: any;  
  @Input() width: number = 100;  

  public language: any;
  //sWorkOrderLookupColumns = ["WorkOrder No", "Product Id", "Start Date", "End Date"];
  sWorkOrderLookupColumns = [];
   
  dataBind: any = [];
  public showLoader: boolean = false;
  dataGridSelect: any = [];
  dataGridSelectNum: number;


  //  sWorkOrderLookupColumns = ["WorkOrder No", "Product Id", "Start Date", "End Date"];    

  constructor(private commonService:CommonService) { }

 

  ngOnInit() {

    this.showLoader = true;
    this.dataBind = [];

    this.language = JSON.parse(window.localStorage.getItem('language'));

    this.sWorkOrderLookupColumns = [this.language.workorderno_title , this.language.productid_title , this.language.startdate , this.language.enddate];

    this.dataBind = JSON.stringify(this.fillLookupArray, this.sWorkOrderLookupColumns);

   // console.log("this.fillLookupArray");
    //console.log(this.fillLookupArray);
    this.dataBind = JSON.parse(this.dataBind);

    this.showLoader = false;
  }

  ngOnChanges(){
    this.showLoader = true;
    this.dataBind = [];

    this.dataBind = JSON.stringify(this.fillLookupArray, this.sWorkOrderLookupColumns);

    //console.log("this.fillLookupArray");
    //console.log(this.fillLookupArray);
    this.dataBind = JSON.parse(this.dataBind);

    this.showLoader = false;
  }

  gridRowSelectionChange(evt){
     this.dataGridSelectNum = evt.selectedRows[0].index;
     this.commonService.ShareData({value:this.fillLookupArray[this.dataGridSelectNum],from:"WO"}); 
  }

  onRowBtnClick(evt, rowIndex){
    this.commonService.ShareData({value:this.fillLookupArray[rowIndex],from:"WO"}); 
  }
  // onRowClick(evt, rowIndex) {
  //   alert(rowIndex)
  //   this.commonService.ShareData({value:this.fillLookupArray[rowIndex],from:"WO"}); 
  //   }
}
