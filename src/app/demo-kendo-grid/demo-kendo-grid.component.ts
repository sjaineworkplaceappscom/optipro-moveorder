import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { Product } from 'src/app/model';
import { EditService } from 'src/app/services/edit.service';
import { QtyWithFGScanService } from 'src/app/services/qty-with-fg-scan.service';


import { map } from 'rxjs/operators/map';

@Component({
  selector: 'my-app',
  templateUrl: './demo-kendo-grid.component.html',
})
export class DemoKendoGridComponent implements OnInit {
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };

    public changes: any = {};

    constructor(private formBuilder: FormBuilder, public editService: EditService,public QtyWithFGScan: QtyWithFGScanService) {
    }

    public ngOnInit(): void {
        //this.view = this.editService.pipe(map(data => process(data, this.gridState)));

        this.editService.read();
    }

    public onStateChange(state: State) {
        this.gridState = state;

        this.editService.read();
    }

    public cellClickHandler({ sender, rowIndex, columnIndex, dataItem, isEdited }) {
        if (!isEdited) {
            sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
        }
    }

    public cellCloseHandler(args: any) {
        const { formGroup, dataItem } = args;

        if (!formGroup.valid) {
             // prevent closing the edited cell if there are invalid values.
            args.preventDefault();
        } else if (formGroup.dirty) {
            this.editService.assignValues(dataItem, formGroup.value);
            this.editService.update(dataItem);
        }
    }

    public addHandler({ sender }) {
        sender.addRow(this.createFormGroup(new Product()));
    }

    public cancelHandler({ sender, rowIndex }) {
        sender.closeRow(rowIndex);
    }

    public saveHandler({ sender, formGroup, rowIndex }) {
      
        this.QtyWithFGScan.checkIfFGSerBatisValid(sessionStorage.getItem('selectedComp'),formGroup.value.serNo,"PO00000055","100025","20").subscribe(
            data=> {
          if(data =="ItemNotExists"){
              alert("FG Bat/Ser you are entering is not valid");
             
          }
            }
          );
        // if (formGroup.valid) {
            this.editService.create(formGroup.value);
            sender.closeRow(rowIndex);
       // }
    }

    public removeHandler({ sender, dataItem }) {
        this.editService.remove(dataItem);

        sender.cancelCell();
    }

    public saveChanges(grid: any): void {
        grid.closeCell();
        grid.cancelCell();

        this.editService.saveChanges();
    }

    public cancelChanges(grid: any): void {
        grid.cancelCell();

        this.editService.cancelChanges();
    }

    public createFormGroup(dataItem: any): FormGroup {
      debugger;
      console.log(dataItem)
      
        // return this.formBuilder.group({
        //     'ProductID': dataItem.ProductID,
        //     'ProductName': [dataItem.ProductName],
        //     'UnitPrice': dataItem.UnitPrice,
        //     'UnitsInStock': [dataItem.UnitsInStock, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,3}')])],
        //     'Discontinued': dataItem.Discontinued
        // });

          return this.formBuilder.group({
            'serNo': dataItem.serNo,
            'Serial': [dataItem.Serial, Validators.required],
            'Qty': dataItem.Qty,
            'Reject': dataItem.Reject,
            'NC': dataItem.NC
        });
    }
    
    // public test(): void{ alert("gg")}
}
