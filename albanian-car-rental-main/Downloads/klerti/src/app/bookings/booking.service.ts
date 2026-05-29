import { Car } from '../data/cars';
import { Booking } from './../data/booking';
import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  private _carToBook = signal<Car | null>(null);
  carToBook = this._carToBook.asReadonly();

  private _bookings = signal<Booking[] | []>([]);
  bookings = this._bookings.asReadonly();

  constructor(private http: HttpClient) {}












  /**
   * Store a car temporarily that user wants to book
   */
  saveCarToBook(car: Car): void {
    this._carToBook.set(car);
  }

  /**
   * Get the car currently selected for booking
   */
  getCarToBook(): Car | null {
    return this._carToBook();
  }

  /**
   * Clear the car to book
   */
  clearCarToBook(): void {
    this._carToBook.set(null);
  }

  /**
   * Get all bookings from backend API
   */
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  /**
   * Load all bookings and update local signal
   */
  loadBookings(): void {
    this.getBookings().subscribe({
      next: (bookings) => {
        this._bookings.set(bookings);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this._bookings.set([]);
      }
    });
  }

  /**
   * Create a new booking on backend
   */
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  /**
   * Save booking - calls backend API then updates local state
   */
  saveBooking(booking: Booking): void {
    this.createBooking(booking).subscribe({
      next: (newBooking) => {
        const currentBookings = this._bookings();
        if (Array.isArray(currentBookings)) {
          this._bookings.set([...currentBookings, newBooking]);
        } else {
          this._bookings.set([newBooking]);
        }
      },
      error: (error) => {
        console.error('Error saving booking:', error);
      }
    });
  }

  /**
   * Delete a booking from backend
   */
  deleteBooking(id: string): Observable<Booking> {
    return this.http.delete<Booking>(`${this.apiUrl}/${id}`);
  }
}
