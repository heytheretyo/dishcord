import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = environment.apiUrl + '/posts';

  constructor(private http: HttpClient) {}

  fetchPosts() {
    const url = this.baseUrl + '/all';
    console.log(url);

    return this.http.get(url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.error('error creating post', error);
        return of({});
      })
    );
  }

  createPost(data: Record<string, any>) {
    const url = this.baseUrl;
    return this.http.post(url, data, { withCredentials: true }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        console.error('error creating post', error);
        return of({});
      })
    );
  }

  fetchMyPost(userId: string) {
    const url = this.baseUrl + '/user/' + userId;
    return this.http.get(url, { withCredentials: true }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error, a) => {
        console.error('error fetching post', error);
        return of({});
      })
    );
  }
  upvote(postId: string, userId: string): Observable<any> {
    const url = `${this.baseUrl}/${postId}/upvote`;
    return this.http.post(url, { userId }, { withCredentials: true });
  }

  downvote(postId: string, userId: string): Observable<any> {
    const url = `${this.baseUrl}/${postId}/downvote`;
    return this.http.post(url, { userId }, { withCredentials: true });
  }
}
