import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionInterface } from '../shared/interfaces/session.interface';
import { SessionService } from '../shared/services/session.service';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  win: any;

  constructor(
    private sessionSV: SessionService,
    private router: Router,
    private userSV: UserService
  ) { }

  ngOnInit() {
    console.log(this.sessionSV.data);
  }

  onSuccess(e) {
    this.saveUserSession(e);
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
        accountId: data.user._id,
        username,
        email,
        firstname,
        lastname
      }
    };
    this.sessionSV.save(session);

    this.userSV.createUser({
      username,
      email,
      firstname,
      lastname,
      accountId: data.user._id
    }).subscribe( x => {
      session.user = x.data;
      this.sessionSV.save(session);
      this.router.navigate(['chat']);
    });
  }
}
