import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CallbackComponent } from './auth/callback/callback.component';
import { CreateComponent } from './cars/create/create.component';
import { ListComponent } from './cars/list/list.component';
import { CreateBookingComponent } from './bookings/create-booking/create-booking.component';
import { BookingComponent } from './bookings/booking/booking.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'create',
    component: CreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ListComponent
  },
  {
    path: 'book',
    component: CreateBookingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bookings',
    component: BookingComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
