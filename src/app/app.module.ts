import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MoveOrderComponent } from './move-order/move-order.component';
import { OperationalDetailComponent } from './operational-detail/operational-detail.component';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';
import { QtyWithoutFGScanComponent } from './qty-without-fgscan/qty-without-fgscan.component';
import { QtyWithFGScanComponent } from './qty-with-fgscan/qty-with-fgscan.component';
import { RouterModule, Routes } from '@angular/router';
import { StorageServiceModule } from 'angular-webstorage-service';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { QtyWithFGScanDetailComponent } from './qty-with-fgscan-detail/qty-with-fgscan-detail.component';
import { UploadModule } from '@progress/kendo-angular-upload';
import { FgrmscanparentComponent } from './fgrmscanparent/fgrmscanparent.component';
import { FgrmscanparentinputformComponent } from './fgrmscanparentinputform/fgrmscanparentinputform.component';
import { FgrmscanchildinputformComponent } from './fgrmscanchildinputform/fgrmscanchildinputform.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TopbarComponent } from './topbar/topbar.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
 // Bootstrap Dropdown

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { LookupComponent } from './lookup/lookup.component';
import { OperationLookupComponent } from './operation-lookup/operation-lookup.component';
import { WorkOrderLookupComponent } from './work-order-lookup/work-order-lookup.component';

//Ngx Toaster
import { ToastrModule } from 'ngx-toastr';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

const myRoots: Routes = [  
  
  { path: 'login', component: LoginComponent }  ,
  { path: 'moveorder', component: MoveOrderComponent } ,   
  { path: 'operationaldetail', component: OperationalDetailComponent } ,
  { path: 'workorderdetail', component: WorkOrderDetailComponent } ,
  { path: 'qtywithoutfgscan', component: QtyWithoutFGScanComponent },
  { path: 'qtywithfgscan', component: QtyWithFGScanComponent },   
  { path: 'fgrmscanparent', component: FgrmscanparentComponent },
  { path: 'fgrmscanparentinputform', component: FgrmscanparentinputformComponent },
  { path: 'fgrmscanchildinputform', component: FgrmscanchildinputformComponent },
  { path: 'lookup', component: LookupComponent },
  { path: '', component: LoginComponent }  ,
  { path: '**', component: LoginComponent }  ,   
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MoveOrderComponent,
    OperationalDetailComponent,
    WorkOrderDetailComponent,
    QtyWithoutFGScanComponent,
    QtyWithFGScanComponent,
    
    QtyWithFGScanDetailComponent,
    FgrmscanparentComponent,
    FgrmscanparentinputformComponent,
    FgrmscanchildinputformComponent,
    TopbarComponent,
    LookupComponent,
    OperationLookupComponent,
    WorkOrderLookupComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(myRoots, {useHash: true}),
    StorageServiceModule,
    ModalModule.forRoot(),
    InputsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    GridModule,
    DropDownsModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    UploadModule,
    ButtonsModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    DateInputsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [LookupComponent,QtyWithoutFGScanComponent, 
  //  {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-US'}], 
  {provide: OWL_DATE_TIME_LOCALE, useValue: window.navigator.language}],
  bootstrap: [AppComponent]
})

// export const MY_MOMENT_FORMATS = {
//   parseInput: 'l LT',
//   fullPickerInput: 'l LT',
//   datePickerInput: 'l',
//   timePickerInput: 'LT',
//   monthYearLabel: 'MMM YYYY',
//   dateA11yLabel: 'LL',
//   monthYearA11yLabel: 'MMMM YYYY',
// };
export class AppModule { }

