import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseClass } from 'src/app/classes/BaseClass'
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private baseClassObj = new BaseClass();  
  public authTokenstr:string = "The remote server returned an error: (401) Unauthorized.";  

  constructor(private toastr: ToastrService, private router: Router,  private auth: AuthenticationService,) { }
  
  // Declaration
  private commonData = new Subject<any>();
  commonData$ = this.commonData.asObservable();
  

  // Methods
  public ShareData(data: any) {
    this.commonData.next(data);
  }

  public unauthorizedToken(Error){
    this.toastr.error('', Error.error.ExceptionMessage,this.baseClassObj.messageConfig);
    if(Error.error.ExceptionMessage == this.authTokenstr ){
        sessionStorage.clear();
        localStorage.clear();
        this.router.navigateByUrl('/login');              
    }
}

  public RemoveLoggedInUser(toastMsg){

    let cmpName=window.localStorage.getItem("selectedComp");
    let guid=window.localStorage.getItem("GUID");
    let username=window.localStorage.getItem("loggedInUser");
    let serviceURL = JSON.parse(window.localStorage.getItem('arrConfigData'));

    this.auth.removeCurrentUser(serviceURL.service_url,cmpName,guid,username).subscribe(
      data => {       
        if(data == true){
          if(toastMsg != ''){
            this.toastr.error('',toastMsg,this.baseClassObj.messageConfig);
          }
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }
        else{
         // this.toastr.error('',toastMsg,this.baseClassObj.messageConfig); 
         console.log("Cannot Log Out");
        }
      },
      error => {
          console.log(error);  
          //this.toastr.error('',toastMsg,this.baseClassObj.messageConfig);              
        } 
    )

                    
  }



}
