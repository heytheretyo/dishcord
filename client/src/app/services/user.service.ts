import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  getUserData() {
    const url = `${this.baseUrl}/me`;

    return this.http.get(url, { withCredentials: true }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.error('error during user fetch:', error);
        return of({});
      })
    );
  }
}
