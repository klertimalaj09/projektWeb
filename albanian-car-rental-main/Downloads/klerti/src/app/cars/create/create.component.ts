import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { v4 as uuidv4} from 'uuid';
import { Car } from '../../data/cars';
import { CarsService } from '../cars.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: 'create.component.html',
  styleUrl: './create.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent {


  createCar: FormGroup;
  carsService = inject(CarsService);
  router = inject(Router);


  constructor(private fb: FormBuilder){


    this.createCar = this.fb.group({
      brand: new FormControl(''),
      model: new FormControl(''),
      image: new FormControl(''),
      year: new FormControl(),
      cc: new FormControl(),
      color: new FormControl(''),
      fuelType: new FormControl('Diesel'),
      price: new FormControl(0)
    })
  }

  saveCar(){
    if(this.createCar.valid){
      const id = uuidv4();
      const car = this.createCar.value;

      const carToSave: Car = {id, ...car};
      this.carsService.setCars(carToSave);
      this.router.navigate([''])




    }
  }

}
