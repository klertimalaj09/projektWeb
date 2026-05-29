import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CarsService } from '../cars.service';
import { Car } from '../../data/cars';
import { BookingService } from '../../bookings/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {

  carsService = inject(CarsService);
  bookingService = inject(BookingService);
  router = inject(Router);

  ngOnInit(): void {
    this.carsService.getCars();

  }

  get cars(){
    return this.carsService.cars;
  }

  bookCar(car: Car){

    this.bookingService.saveCarToBook(car);
    this.router.navigate(['book']);

    console.log(car)
  }

 }
