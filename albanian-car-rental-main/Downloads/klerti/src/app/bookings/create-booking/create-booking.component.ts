import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BookingService } from '../booking.service';
import { Booking } from '../../data/booking';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-booking',
  standalone: false,
  templateUrl: 'create-booking.component.html',
  styleUrl: './create-booking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBookingComponent implements OnInit, OnDestroy {
createBooking: FormGroup;
bookingService = inject(BookingService);
carToBook = this.bookingService.carToBook();
totalPrice = signal<number>(0);
destroyComponent$: Subject<void> =  new Subject();
router =  inject(Router);
constructor(private fb: FormBuilder){
  this.createBooking = this.fb.group({
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    customerName: new FormControl('')
  })
}

ngOnInit(): void {
    this.createBooking.valueChanges.pipe(takeUntil(this.destroyComponent$)).subscribe(res => {
      if(res?.startDate  && res?.endDate ){
        this.calculateDays(new Date(res.startDate), new Date(res.endDate))
      }
    })
}


calculateDays(startDate: Date, endDate: Date){
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
const firstDate = startDate;
const secondDate = endDate;

const diffDays = Math.round(Math.abs((+firstDate - +secondDate) / oneDay));
if(diffDays > 0 && this.carToBook){
  this.totalPrice.set(diffDays * this.carToBook.price);
}
console.log(diffDays, this.carToBook);
}

ngOnDestroy(): void {
  this.destroyComponent$.next()
    this.destroyComponent$.complete();
}


bookCar(){

  // const car = this.bookingService.carToBook();
  if(this.carToBook){
    const booking: Booking = {
      startDate: this.createBooking.controls['startDate'].value,
      endDate: this.createBooking.controls['endDate'].value,
      carId: this.carToBook.id,
      price: this.totalPrice(),
      customerName: this.createBooking.controls['customerName'].value

    }
    this.bookingService.saveBooking(booking);
    this.router.navigate(['']);

  }


  console.log(this.createBooking.value, this.bookingService.carToBook());




}

 }
