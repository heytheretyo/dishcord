import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkSession().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/home']);
      }
    })
  );
};
