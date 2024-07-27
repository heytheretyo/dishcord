import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl + '/auth';
  private loggedIn = false;

  constructor(private http: HttpClient) {}

  checkSession() {
    const url = `${this.baseUrl}/check-session`;
    return this.http.get(url, { withCredentials: true }).pipe(
      map((response: any) => {
        if (response.isAuthenticated) {
          this.loggedIn = true;
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('error during session check:', error);
        return of(false);
      })
    );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
