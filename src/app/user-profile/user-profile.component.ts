import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  @Input() userData = { Username: '', Password: '', Email: '', Birthdate: '', FavoriteMovies: [] };
  user: any = {};
  movies: any[] = [];
  FavoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    console.log('UserProfileComponent constructor called');
  }

  ngOnInit(): void {
    console.log('UserProfileComponent initialized')
    this.getProfile();
    this.getFavoriteMovies();
  }

  getProfile(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.Username = this.user.Username;
    this.userData.Password = this.user.Password;
    this.userData.Email = this.user.Email;
    this.userData.Birthdate = this.user.birthDate;
    this.fetchApiData.getAllMovies().subscribe((result) => {
      this.FavoriteMovies = result.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
    })
  }

  getFavoriteMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.FavoriteMovies = this.user.FavoriteMovies;
    this.FavoriteMovies = this.user.FavoriteMovies;
    console.log(`User's favorite movies ${this.FavoriteMovies}`);
  }

  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result: any) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('Profile updated successfully!', 'OK', {
        duration: 2000
      });
    });
  }

  deleteUser(): void {
    console.log('deleteUser method: ', this.userData.Username);
    if (confirm('Do you really want to delete this account?')) {
      this.fetchApiData.deleteUser().subscribe((result: any) => {
        localStorage.clear();
        this.router.navigate(['welcome']);
      });
    }
  }

}
