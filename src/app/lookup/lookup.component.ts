import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

    @Output() messageEvent = new EventEmitter<string>();
    constructor() { }

    ngOnInit() {       
        this.SetDataSource();
    }

    public columns: any = [];

    ngOnChanges(changes: any) {
        if (changes.fillLookupArray != null && changes.fillLookupArray.currentValue != null) {
            this.SetDataSource();
        }
    }


    SetDataSource() {
        if (this.fillLookupArray != null) {
            this.SetColumns();
        }
    }

    SetColumns(): any {
        this.columns = [];

        if (this.fillLookupArray != null) {
            let row = this.fillLookupArray[0];
            this.columns = this.GetColumns(row);
        }
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

                        if (this.columnToShow == undefined || this.columnToShow == null || this.columnToShow.length<1) {
                            item.Hidden = false;
                        }
                        else {

                            if (this.columnToShow.indexOf(property) > -1) {
                                item.Hidden = false;
                            }
                            else {
                                item.Hidden = true;
                            }
                        }
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
    onRowDoubleClick(evt, rowIndex) {
        this.messageEvent.emit(this.fillLookupArray[rowIndex]);
    }

}

