import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip attaching token to login endpoint
    if (request.url.includes('/login') || request.url.includes('/callback')) {
      return next.handle(request);
    }

    // Get Auth0 token if user is logged in via Auth0
    return this.authService.getAccessTokenSilently$().pipe(
      switchMap((token: string | null) => {
        if (token) {
          // Clone the request and add Authorization header
          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(clonedRequest);
        }
        return next.handle(request);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token is invalid or expired, redirect to login
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
