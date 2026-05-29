import { Injectable, signal } from "@angular/core";
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = signal<boolean>(false);
  private _authMethod = signal<'local' | 'auth0' | null>(null); // Track which auth method
  isLoggedIn = this._isLoggedIn.asReadonly();
  authMethod = this._authMethod.asReadonly();

  constructor(private auth0: Auth0Service) {
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from localStorage or Auth0
   */
  private initializeAuthState() {
    const localUser = localStorage.getItem('user');
    const authMethod = localStorage.getItem('auth_method');

    if (localUser) {
      this._isLoggedIn.set(true);
      this._authMethod.set('local');
      console.log('Local user found');
      return;
    }

    if (authMethod === 'auth0') {
      this._isLoggedIn.set(true);
      this._authMethod.set('auth0');
    }

    // Check if Auth0 session exists
    this.auth0.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this._isLoggedIn.set(true);
        this._authMethod.set('auth0');
        localStorage.setItem('auth_method', 'auth0');
        console.log('Auth0 session found');
      } else if (!localUser) {
        this._isLoggedIn.set(false);
        this._authMethod.set(null);
        localStorage.removeItem('auth_method');
      }
    });
  }

  /**
   * Local login - stores user email in localStorage
   */
  login() {
    this._isLoggedIn.set(true);
    this._authMethod.set('local');
    localStorage.setItem('auth_method', 'local');
  }

  /**
   * Mark Auth0 login as active in app state
   */
  loginWithAuth0State() {
    this._isLoggedIn.set(true);
    this._authMethod.set('auth0');
    localStorage.setItem('auth_method', 'auth0');
  }

  /**
   * Login with Auth0
   */
  loginWithAuth0(targetRoute: string = '/') {
    this.auth0.loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/callback`
      },
      appState: {
        target: targetRoute
      }
    });
  }

  /**
   * Get Auth0 access token silently
   */
  getAccessTokenSilently$(): Observable<string | null> {
    return this.auth0.getAccessTokenSilently();
  }

  /**
   * Logout - handles both local and Auth0 logout
   */
  logout() {
    const method = this._authMethod();
    
    if (method === 'auth0') {
      // Logout from Auth0
      this.auth0.logout({ logoutParams: { returnTo: `${window.location.origin}/login` } });
    } else {
      // Logout from local
      localStorage.removeItem('user');
    }
    
    localStorage.removeItem('auth_method');
    this._isLoggedIn.set(false);
    this._authMethod.set(null);
  }

  /**
   * Check if user is logged in (either method)
   */
  isUserLoggedIn(): boolean {
    return this._isLoggedIn();
  }

  /**
   * Get current auth method
   */
  getCurrentAuthMethod(): 'local' | 'auth0' | null {
    return this._authMethod();
  }

  /**
   * Get user info from Auth0
   */
  getUserInfo$(): Observable<any> {
    return this.auth0.user$;
  }
}
