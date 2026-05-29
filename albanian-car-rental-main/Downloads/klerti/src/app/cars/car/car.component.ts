import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Car } from '../../data/cars';

@Component({
  selector: 'app-car',
  standalone: false,
  templateUrl: 'car.component.html',
  styleUrl: './car.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarComponent {

  @Input() car: Car | undefined;
  @Input() showBooking = true;

  @Output() bookCarEmitter = new EventEmitter();

  bookCar(){
    this.bookCarEmitter.emit(this.car);
  }
}
