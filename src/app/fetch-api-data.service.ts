import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://sports-movies-b0988f99dc86.herokuapp.com/'
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {

  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  private getUsername(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.userName;
  }

  private getToken(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer' + token
      })
    };
  }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Login as user
  public userLogin(userData: any): Observable<any> {
    console.log(userData);
    return this.http
      .post(apiUrl + 'login', userData)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Edit user profile
  editUser(userDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + this.getUsername, userDetails, this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Delete/de-register user
  deleteUser(): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + this.getUsername, this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Retrieve/show all movies
  getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get movie by title
  getMovie(title: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + title, this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get director information by name
  getDirector(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + 'directors/' + name, this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get genre information by name
  getGenre(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + 'genres/' + name, this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get user information
  getUser(): Observable<any> {
    return this.http.get(apiUrl + 'users/' + this.getUsername(), this.getToken());
  }

  // Retrieve user's favorite movies
  getFavoriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http
      .get(`${apiUrl}users/${userId}/movies/${movieId}`, this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Add movie to user's favorites
  addFavoriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http
      .post(`${apiUrl}users/${userId}/movies/${movieId}`, {}, this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Delete movie from user's favorites
  deleteFavoriteMovie(userId: string, movieId: string): Observable<any> {
    return this.http
      .delete(`${apiUrl}users/${userId}/movies/${movieId}`, this.getToken())
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(
        `Server-side error: Status code ${error.status}, ` + `Error body: ${JSON.stringify(error.error)}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
