import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { environment } from '../environment';

export const authGuard: CanActivateFn = (route, state) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http
    .get(`${environment.apiUrl}/auth/check-session`, { withCredentials: true })
    .pipe(
      map((response: any) => {
        if (response.isAuthenticated) {
          return true;
        } else {
          router.navigate(['/home']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error during session check:', error);
        router.navigate(['/home']);
        return of(false);
      })
    );
};
