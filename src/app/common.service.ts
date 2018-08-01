import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  // Declaration
  private commonData = new Subject<any>();
  commonData$ = this.commonData.asObservable();

  // Methods
  public ShareData(data: any) {
    this.commonData.next(data);
  }
}
