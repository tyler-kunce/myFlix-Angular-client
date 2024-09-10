import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

// Declaring the api url that will provide data for the client app
const apiUrl = 'https://sports-movies-b0988f99dc86.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {

  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  /**
   * Constructs new FetchApiDataService with HttpClient injected
   * @param http - Injected HttpClient
   */
  constructor(private http: HttpClient) {
  }

  // Making the api call for the user registration endpoint
  /**
   * Register new user
   * @param userDetails - Details of registered user
   * @returns Observable with registration response
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Login as user
  /**
   * 
   * @param userDetails - User login information
   * @returns Observable with login response
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login?' + new URLSearchParams(userDetails), {})
      .pipe(catchError(this.handleError));
  }

  // Edit user profile
  /**
   * 
   * @param updatedUser - Updated user information
   * @returns Observable with updated user information
   */
  editUser(updatedUser: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + user.userName, updatedUser, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Delete/de-register user
  /**
   * 
   * @returns Observable with response after user is deleted
   */
  deleteUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log(apiUrl + 'users/' + user.userName);
    return this.http
      .delete(apiUrl + 'users/' + user.username, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Retrieve/show all movies
  /**
   * 
   * @returns Observable of all movies
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get movie by title
  /**
   * 
   * @param movieName - Title of movie
   * @returns Observable with details of movie
   */
  getMovie(movieName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + movieName, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get director information by name
  /**
   * 
   * @param directorName - Name of director
   * @returns Observable with director bio
   */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + 'directors/' + directorName, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get genre information by name
  /**
   * 
   * @param genreName - Name of genre
   * @returns Observable with details of the genre
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/genres/' + genreName, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get user information
  /**
   * 
   * @returns Observable of user details
   */
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  // Retrieve user's favorite movies
  /**
   * 
   * @param movieName - Name of movie from favorites
   * @returns Observable with user's favorite movies
   */
  getFavoriteMovie(movieName: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/movies/' + movieName, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), map((data) => data.FavoriteMovies), catchError(this.handleError)
      );
  }

  // Add movie to user's favorites
  /**
   * 
   * @param movieID - _id of movie to be added
   * @returns Observable and response after favorite is added
   */
  addFavoriteMovie(movieID: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log('User: ' + user.Username + ', Movie: ' + movieID);
    return this.http
      .post(apiUrl + `users/${user.Username}/movies/${movieID}`, {}, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Delete movie from user's favorites
  /**
   * 
   * @param movieID - _id of movie to be deleted
   * @returns Observable and response after favorite is removed/deleted
   */
  deleteFavoriteMovie(movieID: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    console.log('User: ' + user + ', Movie: ' + movieID);
    return this.http
      .delete(apiUrl + `users/${user.Username}/movies/${movieID}`, {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + token }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError)
      );
  }

  // Response extraction
  private extractResponseData(result: any): any {
    const body = result;
    return body || {};
  }

  // HTTP error handler
  /**
   * 
   * @param error - HTTP error response
   * @returns Observable with error message
   */
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
