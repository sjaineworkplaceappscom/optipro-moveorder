import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MoveOrderComponent } from './move-order/move-order.component';
import { OperationalDetailComponent } from './operational-detail/operational-detail.component';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';
import { QtyWithoutFGScanComponent } from './qty-without-fgscan/qty-without-fgscan.component';
import { QtyWithFGAndRMScanComponent } from './qty-with-fgand-rmscan/qty-with-fgand-rmscan.component';
import { QtyWithFGScanComponent } from './qty-with-fgscan/qty-with-fgscan.component';
import { FGScanDetailComponent } from './fgscan-detail/fgscan-detail.component';
import { RouterModule, Routes } from '@angular/router';
import { StorageServiceModule } from 'angular-webstorage-service';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DemoKendoGridComponent } from './demo-kendo-grid/demo-kendo-grid.component';

import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
//import { DialogModule } from '@progress/kendo-angular-dialog';

import { EditService } from './services/edit.service';
import { QtyWithFGScanDetailComponent } from './qty-with-fgscan-detail/qty-with-fgscan-detail.component';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FgrmscanparentComponent } from './fgrmscanparent/fgrmscanparent.component';
import { FgrmscanparentinputformComponent } from './fgrmscanparentinputform/fgrmscanparentinputform.component';
import { FgrmscanchildinputformComponent } from './fgrmscanchildinputform/fgrmscanchildinputform.component';

const myRoots: Routes = [  
  { path: 'login', component: LoginComponent }  ,
  { path: 'moveorder', component: MoveOrderComponent } ,   
  { path: 'operationaldetail', component: OperationalDetailComponent } ,
  { path: 'workorderdetail', component: WorkOrderDetailComponent } ,
  { path: 'qtywithoutfgscan', component: QtyWithoutFGScanComponent },
  { path: 'qtywithfgandrmscan', component: QtyWithFGAndRMScanComponent },
  { path: 'qtywithfgscan', component: QtyWithFGScanComponent }, 
  { path: 'fgscandetail', component: FGScanDetailComponent },
  { path: 'demoKendo', component: DemoKendoGridComponent },
  { path: 'fgrmscanparent', component: FgrmscanparentComponent },
  { path: 'fgrmscanparentinputform', component: FgrmscanparentinputformComponent },
  { path: 'fgrmscanchildinputform', component: FgrmscanchildinputformComponent }
   
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MoveOrderComponent,
    OperationalDetailComponent,
    WorkOrderDetailComponent,
    QtyWithoutFGScanComponent,
    QtyWithFGAndRMScanComponent,
    QtyWithFGScanComponent,
    FGScanDetailComponent,
    DemoKendoGridComponent,
    QtyWithFGScanDetailComponent,
    FgrmscanparentComponent,
    FgrmscanparentinputformComponent,
    FgrmscanchildinputformComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(myRoots),
    StorageServiceModule,
    ModalModule.forRoot(),
    InputsModule,
    BrowserAnimationsModule,
    GridModule,
    DropDownsModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    UploadModule
  ],
  providers: [FGScanDetailComponent,EditService],
  bootstrap: [AppComponent]
})
export class AppModule { }
