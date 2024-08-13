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

  isFav(movieID: string): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.FavoriteMovies.indexOf(movieID) >= 0;
  }

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