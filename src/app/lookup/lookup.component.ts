import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
    selector: 'app-lookup',
    templateUrl: './lookup.component.html',
    styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
    @Input() height: number = 400;
    @Input() fillLookupArray: any;
    @Input() columnToShow: Array<string> = [];
    @Input() width: number = 100;
    @Input() parent: string = "";

    sWorkOrderLookupColumns = ["WorkOrder No", "Product Id", "Start Date", "End Date"];
    sOperationLookupColumns = ["Operation No", "Operation Desc", "Balance Quantity"];
    dataBind: any = [];
    public columns: any = [];

    public showLoader: boolean = false;

    @Output() messageEvent = new EventEmitter<string>();

    public checkboxOnly = false;
    constructor(private commonService:CommonService) { }

    ngOnInit() {
        
        //show loader
        this.showLoader = true;

        this.dataBind = [];

        if (this.parent == 'opr') {
            this.dataBind = JSON.stringify(this.fillLookupArray, this.sOperationLookupColumns);
        }
        else if (this.parent == 'wo') {
            this.dataBind = JSON.stringify(this.fillLookupArray, this.sWorkOrderLookupColumns);
        }

        this.dataBind=JSON.parse(this.dataBind);
        //JSON.stringify(this.fillLookupArray,"WorkOrderNo")  
         this.SetDataSource();
        this.showLoader = false;
    }



    ngOnChanges(changes: any) {
        // if (changes.fillLookupArray != null && changes.fillLookupArray.currentValue != null) {
        //     this.SetDataSource();
        // }
    }


    SetDataSource() {
        if (this.dataBind != null) {
            this.SetColumns();
        }
    }

    SetColumns(): any {
        this.columns = [];

        if (this.dataBind != null) {
            let row = this.dataBind[0];
            this.columns = this.GetColumns(row);
        }
        //hide loader
        this.showLoader = false;
    }

    protected GetColumns(obj: any): any {
        let properties: any = [];

        if (obj != null && typeof obj == "object") {
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (property != '$type') {
                        let item: any = {};

                        item.Name = property;
                        item.DisplayFormat = null;
                        item.CanSort = true;
                        item.CanFilter = true;

                        item.DataType = 'String';

                        // if (this.columnToShow == undefined || this.columnToShow == null || this.columnToShow.length < 1) {
                        //     item.Hidden = false;
                        // }
                        // else {

                        //     if (this.columnToShow.indexOf(property) > -1) {
                        //         item.Hidden = false;
                        //     }
                        //     else {
                        //         item.Hidden = true;
                        //     }
                        // }
                        properties.push(item);

                    }
                }
            }
        }

        if (properties != null)
            properties.sort();

        return properties;
    }

    public setStyles(): any {

        let styles = {
            'height': (this.height - 45) + 'px'
        };

        return styles;
    }

    //Double click will handle the lookup values back to the move order component
    onRowClick(evt, rowIndex) {
        //this.messageEvent.emit(this.fillLookupArray[rowIndex]);
        this.commonService.ShareData(this.fillLookupArray[rowIndex]);

        alert(this.fillLookupArray[rowIndex]);
        console.log("Value-",this.fillLookupArray[rowIndex]);
        
    }

    // onRowBtnClick(evt, rowIndex){
    //     this.messageEvent.emit(this.fillLookupArray[rowIndex]);
    // }



}

