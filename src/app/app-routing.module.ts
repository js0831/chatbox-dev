import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { UserGuard } from './shared/guards/user.guard';
import { LandingGuard } from './shared/guards/landing.guard';


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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
