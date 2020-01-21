import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionInterface } from '../shared/interfaces/session.interface';
import { SessionService } from '../shared/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  win: any;

  constructor(
    private sessionSV: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.sessionSV.data);
  }

  login() {
    this.win = window.open(
      environment.loginURL,
      'Login' ,
      'dialog=yes,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no');
  }

  @HostListener('window:message', ['$event'])
  onMessage(event) {
    this.listentoWindowMessage(event);
  }

  private listentoWindowMessage(event: any) {
    const action = event.data.action;
    switch (action) {
      case 'SSO_PAGE_LOADED':
        this.submitAppID();
        break;
      case 'LOGIN':
        this.saveUserSession(event.data.data.data);
        break;
      default:
        break;
    }
  }

  private saveUserSession(data: any) {
    const {
      username,
      email,
      firstname,
      lastname
    } = data.user;

    const session: SessionInterface = {
      token: data.token,
      user: {
        id: data.user._id,
        username,
        email,
        firstname,
        lastname
      }
    };
    this.sessionSV.save(session);
    this.router.navigate(['v2/chat']);
  }

  private submitAppID() {
    this.win.postMessage({
        action: 'SUBMIT_APP_ID',
        data: environment.appId,
    }, environment.loginURL);
  }
}
