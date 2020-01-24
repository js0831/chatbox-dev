import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingModule } from './landing/landing.module';
import { ChatboxModule } from './chatbox/chatbox.module';
import { JkWaitModule } from 'jk-wait';
import { JkAlertModule } from 'jk-alert';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorService } from './shared/interceptors/http-interceptor.service';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ChatboxxModule } from './v2/chatboxx/chatboxx.module';
import { HomeComponent } from './v2/home/home.component';
import { StoreModule } from '@ngrx/store';
import { friendReducer } from './v2/chatboxx/store/friends/friends.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FriendsEffects } from './v2/chatboxx/store/friends/friends.effects';
import { PaginationComponent } from './v2/shared/components/pagination/pagination.component';
const config: SocketIoConfig = { url: environment.apiURL, options: {}};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LandingModule,
    ChatboxModule,
    JkWaitModule,
    JkAlertModule,
    SocketIoModule.forRoot(config),
    ChatboxxModule,

    StoreModule.forRoot({
      friendState: friendReducer
    }),
    EffectsModule.forRoot([
      FriendsEffects
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
