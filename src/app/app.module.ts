import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
//import { AppRoutingModule } from './app-routing.module';
import { FormsModule }   from '@angular/forms';
import { HttpClient, HttpHandler, HttpClientModule } from '@angular/common/http';


const myRoots: Routes = [  
  { path: 'login', component: LoginComponent }  ,
  { path: 'moveorder', component: MoveOrderComponent } ,   
  { path: 'operationaldetail', component: OperationalDetailComponent } ,
  { path: 'workorderdetail', component: WorkOrderDetailComponent } ,
  { path: 'QtyWithoutFGScan', component: QtyWithoutFGScanComponent },
  { path: 'QtyWithFGAndRMScan', component: QtyWithFGAndRMScanComponent },
  { path: 'QtyWithFGScan', component: QtyWithFGScanComponent }, 
  { path: 'FGScanDetail', component: FGScanDetailComponent }, 
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
    FGScanDetailComponent
  ],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    RouterModule.forRoot(myRoots)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
