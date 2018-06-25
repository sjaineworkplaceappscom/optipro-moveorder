import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginId:string;
  password:string;
  constructor(private auth:AuthenticationService,private router:Router) { }

  ngOnInit() {
  }

  onLoginClick(){
this.auth.login(this.loginId,this.password).subscribe(
  data=> {
     this.router.navigateByUrl('/moveorder');
   
  }
)
   

  }

  

}
