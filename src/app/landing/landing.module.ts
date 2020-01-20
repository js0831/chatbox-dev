import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class LandingModule { }
