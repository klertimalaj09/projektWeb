import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { BookingService } from '../booking.service';
import { CarsService } from '../../cars/cars.service';
import { Booking } from '../../data/booking';
import { Car } from '../../data/cars';

type BookingList = Booking & {car: Car};

@Component({
  selector: 'app-booking',
  standalone: false,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit{
  bookingService = inject(BookingService);
  carService = inject(CarsService);
  bookingList: BookingList[] = [];

  ngOnInit(): void {
      this.bookingService.getBookings();
      this.carService.getCars();
      const cars = this.carService.cars();
      this.bookingList = this.bookings().map(booking => ({
        ...booking,
        car: cars.filter(car => car.id === booking.carId)[0]
      }));

      console.log(this.bookingList)

  }


  get bookings(){
    return this.bookingService.bookings;
  }
}
