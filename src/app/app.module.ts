import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './components/authentication/authentication.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductManagementModule } from './components/product-management/product-management.module';
import { FormulaSummaryModule} from './components/formula-tool/formula.module';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './components/authentication/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from './components/organism/confirmation-modal/confirmation-modal.component';
import { StatelessModule } from './stateless/stateless.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LayoutModule } from './components/layout/layout.module';
import { DatePipe } from '@angular/common';
import { PsiBrandModalComponent } from './components/product-management/psi-brand-modal/psi-brand-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        ConfirmationModalComponent,
        PsiBrandModalComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AuthenticationModule,
        HttpClientModule,
        ProductManagementModule,
        FormulaSummaryModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        StatelessModule,
        AgGridModule,
        NgxSpinnerModule,
        LayoutModule
    ],
    exports: [

    ],
    providers: [
        HttpClientModule, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        DatePipe
    ],

    bootstrap: [AppComponent]
})
export class AppModule { }
