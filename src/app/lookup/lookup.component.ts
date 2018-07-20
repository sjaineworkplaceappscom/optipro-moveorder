import { Component, OnInit } from '@angular/core';
import { sampleCustomers, customers } from 'src/sample';

@Component({
    selector: 'app-lookup',
    templateUrl: './lookup.component.html',
    styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {
    public height: number = 400;
    public dataSource: any = customers;

    constructor() { }

    ngOnInit() {

        this.SetDataSource();

    }

    public columns: any = [];

    ngOnChanges(changes: any) {
        if (changes.dataSource != null && changes.dataSource.currentValue != null) {
            this.SetDataSource();
        }
    }


    SetDataSource() {
        if (this.dataSource != null) {
            this.SetColumns();
        }
    }

    SetColumns(): any {
        this.columns = [];

        if (this.dataSource != null) {
            let row = this.dataSource[0];
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

    onRowDoubleClick(evt, rowIndex) {
        alert('You clicked row ' + rowIndex + '!');
      }
}

