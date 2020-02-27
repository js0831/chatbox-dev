import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JkWaitModule } from 'jk-wait';
import { JkAlertModule } from 'jk-alert';
import { IloginButtonModule } from 'ilogin-button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ChatboxxModule } from './v2/chatboxx/chatboxx.module';
import { HomeComponent } from './v2/home/home.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FriendsEffects } from './v2/chatboxx/store/friends/friends.effects';
import { friendReducer } from './v2/chatboxx/store/friends/friends.reducer';
// import { ConversationEffects } from './v2/chatboxx/store/conversation/conversation.effects';
import { conversationReducer } from './v2/chatboxx/store/conversation/conversation.reducer';
import { ConversationEffects } from './v2/chatboxx/store/conversation/conversation.effects';
import { notificationReducer } from './v2/chatboxx/store/notification/notification.reducer';
import { NotificationEffects } from './v2/chatboxx/store/notification/notification.effects';
import { WaitConfig } from 'jk-wait/lib/config/wait.config';
import { HttpInterceptorService } from './v2/shared/services/http-interceptor.service';

const config: SocketIoConfig = { url: environment.apiURL, options: {}};
const waitConfig: WaitConfig = {
  type: 'SPINNER',
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    JkWaitModule.forRoot(waitConfig),
    JkAlertModule,
    IloginButtonModule.forRoot({
      appId: environment.appId
    }),
    SocketIoModule.forRoot(config),
    ChatboxxModule,

    StoreModule.forRoot({
      conversationState: conversationReducer,
      friendState: friendReducer,
      notificationState: notificationReducer
    }),
    EffectsModule.forRoot([
      ConversationEffects,
      FriendsEffects,
      NotificationEffects
    ])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
