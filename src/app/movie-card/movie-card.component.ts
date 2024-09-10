// src/app/movie-card/movie-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent implements OnInit {
  @Input()
  isFromFav: boolean = false;
  movies: any[] = [];
  FavoriteMovies: any[] = [];
  user: any = {};
  userData = { Username: "", FavoriteMovies: [] };

  // Constructs MovieCardComponent instance; initializes FetchApiDataService, MatDialog, and MatSnackBar
  /**
   * 
   * @param fetchApiData - Service that fetches data from movie_api
   * @param dialog - Material's service for launching dialogs
   * @param snackBar - Material's service for showing 'snack bar' notifications
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.getFavoriteMovies();
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      this.movies = result;
      return this.movies;
    });
  }

  // Material Dialog showing genre info
  /**
   * 
   * @param name - Name of genre
   * @param description - Description of genre
   */
  openGenreDialog(name: string, description: string): void {
    console.log('Fetching genre: ', name, description);
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: '400px'
    })
  }

  // Material Dialog showing director info
  /**
   * 
   * @param name - Name of director
   * @param bio - Bio of director
   * @param birthDate - Director's birth date
   * @param deathDate - Director's death date (if applicable)
   */
  openDirectorDialog(name: string, bio: string, birthDate: string, deathDate: string): void {
    console.log('Fetching director: ', name, birthDate, deathDate);
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        birthDate: birthDate,
        deathDate: deathDate
      },
      width: '400px'
    });
  }

  // Material Dialog showing movie info
  /**
   * 
   * @param description - Movie's description
   */
  openMovieDialog(description: string): void {
    console.log('Fetching movie: ', description);
    this.dialog.open(MovieInfoComponent, {
      data: {
        Description: description
      },
      width: '500px'
    });
  }

  getFavoriteMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.FavoriteMovies = this.user.FavoriteMovies;
    this.FavoriteMovies = this.user.FavoriteMovies;
    console.log('Favorite movies: ', this.FavoriteMovies);
  }

  // Check if movie marked as favorite
  /**
   * 
   * @param movieID - _id of movie
   * @returns True if movie marked as favorite
   */
  isFav(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }

  // Add movie to user's favorites
  /**
   * 
   * @param movie - Movie object to be added
   */
  addFavMovie(movie: string): void {
    let user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.addFavoriteMovie(movie).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies();
      this.snackBar.open('A movie has been added to your favorites!', 'OK', {
        duration: 2000,
      });
    });
  }

  // Delete movie from user's favorites
  /**
   * 
   * @param movie - Movie object to be removed
   */
  deleteFavMovie(movie: any): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.fetchApiData.deleteFavoriteMovie(movie)
      .subscribe((result) => {
        localStorage.setItem('user', JSON.stringify(result));
        this.getFavoriteMovies();
        this.snackBar.open('A movie has been removed from your favorites', 'OK', {
          duration: 2000
        });
      });
  }
}