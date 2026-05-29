import { Component, inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Car } from './data/cars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})

export class AppComponent {

  //Important Function: Editing Car Components on localStorage without deleting all of your cars! *klerti

  constructor(){
    const cars = localStorage.getItem('cars');
    const allCars: Car[] = cars ? JSON.parse(cars) : [];
    const newCars: Car[] = []
    allCars.forEach(car => {
      if(car?.id === '7cbd2e6d-9e94-4a9f-9686-2e01b7464f33'){ //<-- Change ID to the ID of the car you want to edit. *klerti
        car.cc = 5980 //<-- Change to what attribute you want to edit on the car and its value. *klerti
      }
      newCars.push(car);
    });

    localStorage.setItem('cars', JSON.stringify(newCars))
  }

  // End of Function

  name = 'Albania';
  authService = inject(AuthService);

  get isLoggedIn(){
    return this.authService.isLoggedIn;
  }

  logout(){
    this.authService.logout();
  }
}
