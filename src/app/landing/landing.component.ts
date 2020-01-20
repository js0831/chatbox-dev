import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  win: any;
  loginUrl = 'https://ilogin.netlify.com';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.win = window.open(this.loginUrl, 'Login' , 'dialog=yes,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no');

  }

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    if (event.data.action === 'SSO_PAGE_LOADED') {
      this.win.postMessage({
          action: 'SUBMIT_APP_ID',
          data: environment.appId,
      }, this.loginUrl);
    }

    if (event.data.action === 'LOGIN') {
      const data = event.data.data.data;
      const {
        username,
        email,
        lastname,
        firstname
      } = data.user;

      let session = {
        info: {},
        token: data.token
      };
      this.saveSession(session);

      this.userService.createUser({
        username,
        email,
        firstname,
        lastname,
        accountId: data.user._id,
      }).subscribe( (x: any) => {
        session = {
          info: x.data,
          token: data.token
        };
        this.saveSession(session);
        this.router.navigate(['chat']);
      });
    }
  }

  private saveSession(data) {
    this.userService.setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  }
}
