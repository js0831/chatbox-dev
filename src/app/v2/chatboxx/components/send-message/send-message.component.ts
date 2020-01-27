import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/landing/user.service';
import { ActionService } from 'src/app/shared/services/action.service';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/shared/services/chat.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { JkAlertService } from 'jk-alert';
import { ConversationService } from 'src/app/v2/shared/services/conversation.service';
import { CONVERSATION_SELECT } from '../../store/conversation/conversation.action';
import { ConversationInterface } from 'src/app/v2/shared/interfaces/conversation.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserInterface } from 'src/app/v2/shared/interfaces/user.interface';
import { SessionService } from 'src/app/v2/shared/services/session.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, OnDestroy {


  subs: Subscription[] = [];
  selectedConversation: ConversationInterface;
  form: FormGroup;
  currentUser: UserInterface;

  constructor(
    private conversationSV: ConversationService,
    private formBuilder: FormBuilder,
    private sessionSV: SessionService
  ) { }

  ngOnInit() {
    this.currentUser = this.sessionSV.data.user;
    this.subs = [
      this.watchConversationState()
    ];
    this.buildForm();
  }

  private watchConversationState() {
    return this.conversationSV.conversationState.subscribe( x => {
      switch (x.action.name) {
        case CONVERSATION_SELECT:
          this.selectedConversation = x.conversation.selected;
          break;
        default:
          break;
      }
    });
  }

  sendMessage() {
    if (this.form.invalid || !this.selectedConversation) { return; }
    this.conversationSV.sendMessage(
      this.selectedConversation._id,
      {
        from: this.currentUser._id,
        message: this.form.value.message
      }
    ).toPromise();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      message: ['', Validators.required]
    });
  }

  onEnter(e) {
    if (e.which === 13) {
      this.sendMessage();
    }
  }

  ngOnDestroy() {
    this.subs.forEach(x => x.unsubscribe());
  }
}
