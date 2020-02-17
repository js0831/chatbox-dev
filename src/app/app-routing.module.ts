import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatboxxComponent } from './v2/chatboxx/chatboxx.component';
import { HomeComponent } from './v2/home/home.component';
import { AuthGuard } from './v2/shared/guards/auth.guard';
import { HomeGuard } from './v2/shared/guards/home.guard';


const routes: Routes = [
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
