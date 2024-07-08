// src/app/movie-card/movie-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
      let parsedUser = JSON.parse(user);
      this.favoriteMovies = parsedUser.favoriteMovies
    }
  }
}
