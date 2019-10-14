import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BaseClass } from 'src/app/classes/BaseClass'

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private baseClassObj = new BaseClass();
  public authTokenstr:string = "The remote server returned an error: (401) Unauthorized.";

  constructor(private toastr: ToastrService, private router: Router,) { }
  
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

}
