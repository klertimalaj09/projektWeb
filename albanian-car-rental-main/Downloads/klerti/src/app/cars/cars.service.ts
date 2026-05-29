import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Car } from "../data/cars";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  private apiUrl = `${environment.apiUrl}/cars`;
  private _cars = signal<Car[] | []>([]);
  cars = this._cars.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Get all cars from backend API
   */
  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  /**
   * Get all cars and update local signal
   */
  loadCars(): void {
    this.getCars().subscribe({
      next: (cars) => {
        this._cars.set(cars);
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this._cars.set([]);
      }
    });
  }

  /**
   * Create a new car on backend
   */
  createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car);
  }

  /**
   * Add car - calls backend API then updates local state
   */
  setCars(car: Car): void {
    this.createCar(car).subscribe({
      next: (newCar) => {
        const currentCars = this._cars();
        if (Array.isArray(currentCars)) {
          this._cars.set([...currentCars, newCar]);
        } else {
          this._cars.set([newCar]);
        }
      },
      error: (error) => {
        console.error('Error creating car:', error);
      }
    });
  }

  /**
   * Update a car on backend
   */
  updateCar(id: string, car: Partial<Car>): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }

  /**
   * Delete a car from backend
   */
  deleteCar(id: string): Observable<Car> {
    return this.http.delete<Car>(`${this.apiUrl}/${id}`);
  }
}
