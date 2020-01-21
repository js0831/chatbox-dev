import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { UserGuard } from './shared/guards/user.guard';
import { LandingGuard } from './shared/guards/landing.guard';
import { ChatboxxComponent } from './v2/chatboxx/chatboxx.component';
import { HomeComponent } from './v2/home/home.component';
import { AuthGuard } from './v2/shared/guards/auth.guard';
import { HomeGuard } from './v2/shared/guards/home.guard';


const routes: Routes = [
  {
    path: '',
    canActivate: [LandingGuard],
    component: LandingComponent
  },
  {
    path: 'chat',
    canActivate: [UserGuard],
    component: ChatboxComponent
  },

  {
    path: 'v2',
    canActivate: [HomeGuard],
    component: HomeComponent
  },
  {
    path: 'v2/chat',
    canActivate: [AuthGuard],
    component: ChatboxxComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
