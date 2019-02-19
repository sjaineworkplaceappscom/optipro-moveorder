import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-operation-lookup',
  templateUrl: './operation-lookup.component.html',
  styleUrls: ['./operation-lookup.component.scss']
})
export class OperationLookupComponent implements OnInit {
  
  @Input() height: number = 400;
  @Input() fillLookupArray: any;  
  @Input() width: number = 100;  
  sOperationLookupColumns = ["Operation No", "Operation Desc", "Balance Quantity"];
  dataBind: any = [];
  public showLoader: boolean = false;
  dataGridSelect: any = [];
  dataGridSelectNum: number;
  public language: any;

  constructor(private commonService:CommonService) { }

  ngOnInit() {

    this.language = JSON.parse(window.localStorage.getItem('language'));

    this.showLoader = true;
    this.dataBind = [];

    this.dataBind = JSON.stringify(this.fillLookupArray, this.sOperationLookupColumns);

    this.dataBind = JSON.parse(this.dataBind);

    this.showLoader = false;

  }

  gridRowSelectionChange(evt){
    this.dataGridSelectNum = evt.selectedRows[0].index;
    this.commonService.ShareData({value:this.fillLookupArray[this.dataGridSelectNum],from:"OPER"}); 
 }

  onRowBtnClick(evt, rowIndex){
    this.commonService.ShareData({value:this.fillLookupArray[rowIndex],from:"OPER"}); 
    }
  // onRowClick(evt, rowIndex) {
  //   this.commonService.ShareData({value:this.fillLookupArray[rowIndex],from:"OPER"}); 
  // }
  
  

}
