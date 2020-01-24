import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/landing/user.service';
import { ActionService } from 'src/app/shared/services/action.service';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { JkAlertService } from 'jk-alert';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, OnDestroy {


  subs: Subscription[] = [];

  constructor(
  ) { }

  ngOnInit() {
    this.subs = [
    ];
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
  }
}
