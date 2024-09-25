import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './components/authentication/authentication.module';
import {HTTP_INTERCEPTORS, HttpClientModule}  from '@angular/common/http';
import { ProductManagementModule } from './components/product-management/product-management.module';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './components/authentication/auth.interceptor';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    HttpClientModule,
    ProductManagementModule,
    SharedModule
  ],
  exports: [
   
  ],
  providers: [HttpClientModule, {provide : HTTP_INTERCEPTORS,useClass: AuthInterceptor, multi: true}],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
