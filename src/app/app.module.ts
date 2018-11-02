import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FaceDetectComponent } from './face-detect/face-detect.component';
import { HttpClientModule } from '@angular/common/http'; 
import {WebcamModule} from 'ngx-webcam';
@NgModule({
  declarations: [
    AppComponent,
    FaceDetectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    WebcamModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
