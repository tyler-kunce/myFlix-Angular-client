// src/app/movie-card/movie-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieInfoComponent } from '../movie-info/movie-info.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input()
  isFromFav: boolean = false;
  movies: any[] = [];
  genre: any = '';
  director: any = '';
  user: any = {};
  favoriteMovies: any[] = [];


  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((result: any) => {
      this.movies = result;
      return this.movies;
    });
  }

  getFavorites(): void {
    let user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.favoriteMovies = parsedUser.favoriteMovies || [];
    } else {
      this.favoriteMovies = [];
    }
  }

  openGenreDialog(name: string): void {
    console.log('Fetching genre:', name)
    this.fetchApiData.getGenre(name).subscribe((result: any) => {
      console.log('Genre fetched:', result);
      this.genre = result.Genre;
      this.dialog.open(GenreInfoComponent, {
        data: {
          name: this.genre.Name,
          description: this.genre.Description
        },
        width: '500px'
      });
    }, (error) => {
      console.error('Error fetching genre:', error);
    });
  }

  openDirectorDialog(name: string): void {
    this.fetchApiData.getDirector(name).subscribe((result: any) => {
      this.director = result.Director;
      this.dialog.open(DirectorInfoComponent, {
        data: {
          name: this.director.Name,
          bio: this.director.Bio,
          birthDate: this.director.BirthDate,
          deathDate: this.director.DeathDate
        },
        width: '500px'
      });
    });
  }

  openMovieDialog(title: string, description: string): void {
    this.dialog.open(MovieInfoComponent, {
      data: {
        title: title,
        description: description
      },
      width: '500px'
    });
  }

  isFav(movie: any): boolean {
    return this.favoriteMovies && this.favoriteMovies.includes(movie.title);
  }

  toggleFav(movie: any): void {
    const isFavorite = this.isFav(movie);
    isFavorite ? this.deleteFavMovie(movie) : this.addFavMovie(movie);
  }

  addFavMovie(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData
        .addFavoriteMovie(movie.title, parsedUser.username)
        .subscribe((result: any) => {
          localStorage.setItem('user', JSON.stringify(result));
          this.favoriteMovies.push(movie.title);
          this.snackBar.open(`${movie.title} added to your favorites`, 'OK', {
            duration: 2000,
          });
        });
    }
  }

  deleteFavMovie(movie: any): void {
    let user = localStorage.getItem('user');
    if (user) {
      let parsedUser = JSON.parse(user);
      this.fetchApiData
        .deleteFavoriteMovie(movie.title, parsedUser.username)
        .subscribe((result: any) => {
          localStorage.setItem('user', JSON.stringify(result));
          this.favoriteMovies = this.favoriteMovies.filter((title) => title !== movie.title);
          this.snackBar.open(`${movie.title} removed from your favorites`, 'OK', {
            duration: 2000,
          });
        });
    }
  }
}
