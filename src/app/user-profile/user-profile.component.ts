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
  @Input() userData: any = { Username: '', Password: '', Email: '', Birthdate: '' };
  user: any = {};
  movies: any[] = [];
  favoriteMovies: any[] = [];
  _id: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  public getProfile(): void {
    this.fetchApiData.getUser().subscribe((result) => {
      this.user = result;
      this.userData.Username = this.user.userName;
      this.userData.Email = this.user.email;
      if (this.user.birthDate) {
        let Birthday = new Date(this.user.birthDate);
        if (!isNaN(Birthday.getTime())) {
          this.userData.Birthdate = Birthday.toISOString().split('T')[0];
        }
      }
      this.fetchApiData.getAllMovies().subscribe((movies: any[]) => {
        this.favoriteMovies = movies.filter((movie: any) => {
          this._id.includes(movie._id)
        })
      })
    })
  }

  public userProfile(): void {
    this.fetchApiData.getUser().subscribe((result: any) => {
      this.user = result;
      this.userData.Username = this.user.userName;
      this.userData.Email = this.user.email;
      this.userData.Birthdate = this.user.birthDate;

      this.fetchApiData.getAllMovies().subscribe((result) => {
        this.favoriteMovies = result.filter((movie: any) => this.user.favoriteMovies.includes(movie._id));
      });
    });
  }

  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result));
      this.snackBar.open('User update successful', 'OK', {
        duration: 2000
      });
      this.snackBar.open('Fialed to update user', 'OK', {
        duration: 2000
      });
    });
  }

  deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe((result) => {
      this.snackBar.open('User successfully deleted', 'OK', {
        duration: 2000
      });
    });
    this.router.navigate(['welcome']).then(() => {
      localStorage.clear();
    });
  }

  getFavoriteMovies(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoriteMovies = this.user.favoriteMovies;
    this.favoriteMovies = this.user.favoriteMovies;
  }

}
