import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { AuthService } from '../auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-callback',
  standalone: false,
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {
  private auth0 = inject(Auth0Service);
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    // Handle the Auth0 callback
    this.auth0.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        // User is authenticated, update auth service
        this.authService.loginWithAuth0State();

        // Prefer Auth0 appState target, then query returnUrl, finally home.
        this.auth0.appState$.pipe(take(1)).subscribe(appState => {
          const appStateTarget = (appState as { target?: string } | null)?.target;
          const returnUrl = appStateTarget || this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        });
      } else {
        this.error = 'Authentication failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
