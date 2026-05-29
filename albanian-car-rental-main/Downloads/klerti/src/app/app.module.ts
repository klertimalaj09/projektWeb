import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from "./auth/login/login.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateComponent } from './cars/create/create.component';
import { ListComponent } from './cars/list/list.component';
import { CarComponent } from './cars/car/car.component';
import { CreateBookingComponent } from './bookings/create-booking/create-booking.component';
import { BookingComponent } from './bookings/booking/booking.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { CallbackComponent } from './auth/callback/callback.component';
import { environment } from '../environments/environment';

const AUTH0_DOMAIN = 'dev-r5cgo0w6vhoq33zf.us.auth0.com';
const AUTH0_CLIENT_ID = 'lpy3gutzVJtEsLcDf5sI2JrMDHWsJHCo';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    CreateComponent,
    ListComponent,
    CarComponent,
    CreateBookingComponent,
    BookingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain: AUTH0_DOMAIN,
      clientId: AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`,
        audience: environment.auth0.audience,
        scope: environment.auth0.scope
      },
      httpInterceptor: {
        allowedList: ['http://localhost:3000/api/*']
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
