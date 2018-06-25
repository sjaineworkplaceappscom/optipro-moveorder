import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})



export class LoginServiceService {
  private serviceURL: string = 'assets/data/loginCredentials.json';

  constructor() {}
}
